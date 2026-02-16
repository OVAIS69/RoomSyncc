from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from users.models import User
from rooms.models import Room
from django.core.mail import send_mail
from django.conf import settings
import threading


class Booking(models.Model):
    room = models.ForeignKey('rooms.Room', on_delete=models.CASCADE, related_name='bookings')
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='bookings')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    purpose = models.CharField(max_length=255, blank=True, null=True)
    faculty_email = models.EmailField(max_length=255, blank=True, null=True)  # Store faculty email for admin overrides

    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('approved', 'Approved'),
            ('rejected', 'Rejected'),
            ('cancelled', 'Cancelled')
        ],
        default='approved'  # Changed from pending to approved
    )
    
    # New fields for approval workflow
    rejection_reason = models.TextField(blank=True, null=True)
    approved_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_bookings'
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.room.room_number} booked by {self.user.username} on {self.date}"

    def approve(self, approved_by_user):
        """Approve the booking"""
        self.status = 'approved'
        self.approved_by = approved_by_user
        self.approved_at = timezone.now()
        self.save()
        # Email is sent via confirmation now for new bookings
        if self.pk: # Only if it's an existing update
             self.send_approval_email()

    def reject(self, rejected_by_user, reason=''):
        """Reject the booking"""
        self.status = 'rejected'
        self.rejection_reason = reason
        self.approved_by = rejected_by_user  # Track who rejected it
        self.approved_at = timezone.now()
        self.save()
        self.send_rejection_email()

    def cancel(self):
        """Cancel the booking"""
        self.status = 'cancelled'
        self.save()
        self.send_cancellation_email()

    def _send_email_thread(self, subject, message, recipient_list):
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                recipient_list,
                fail_silently=False,
            )
        except Exception as e:
            print(f"Failed to send email: {e}")

    def send_approval_email(self):
        """Send email when booking is approved"""
        subject = f"Booking Approved: {self.room.room_number}"
        message = (
            f"Dear {self.user.username},\n\n"
            f"Your booking has been APPROVED!\n\n"
            f"Room: {self.room.room_number} ({self.room.room_type})\n"
            f"Block: {self.room.block.name}\n"
            f"Date: {self.date}\n"
            f"Time: {self.start_time} - {self.end_time}\n"
            f"Purpose: {self.purpose}\n\n"
            f"Approved by: {self.approved_by.username if self.approved_by else 'System'}\n\n"
            f"Best regards,\nRoomSync Team"
        )
        
        threading.Thread(target=self._send_email_thread, args=(subject, message, [self.user.email])).start()

    def send_rejection_email(self):
        """Send email when booking is rejected"""
        subject = f"Booking Rejected: {self.room.room_number}"
        message = (
            f"Dear {self.user.username},\n\n"
            f"Unfortunately, your booking has been REJECTED.\n\n"
            f"Room: {self.room.room_number} ({self.room.room_type})\n"
            f"Block: {self.room.block.name}\n"
            f"Date: {self.date}\n"
            f"Time: {self.start_time} - {self.end_time}\n"
            f"Purpose: {self.purpose}\n\n"
            f"Reason: {self.rejection_reason or 'No reason provided'}\n\n"
            f"Please contact the admin for more information.\n\n"
            f"Best regards,\nRoomSync Team"
        )
        
        threading.Thread(target=self._send_email_thread, args=(subject, message, [self.user.email])).start()

    def send_cancellation_email(self):
        """Send email when booking is cancelled"""
        subject = f"Booking Cancelled: {self.room.room_number}"
        message = (
            f"Dear {self.user.username},\n\n"
            f"Your booking has been CANCELLED.\n\n"
            f"Room: {self.room.room_number} ({self.room.room_type})\n"
            f"Block: {self.room.block.name}\n"
            f"Date: {self.date}\n"
            f"Time: {self.start_time} - {self.end_time}\n\n"
            f"Best regards,\nRoomSync Team"
        )
        
        threading.Thread(target=self._send_email_thread, args=(subject, message, [self.user.email])).start()

    def send_confirmation_email(self):
        """Send email when booking is created (Now Confirmed)"""
        subject = f"Booking Confirmed: {self.room.room_number}"
        message = (
            f"Dear {self.user.username},\n\n"
            f"Your booking has been CONFIRMED!\n\n"
            f"Room: {self.room.room_number} ({self.room.room_type})\n"
            f"Block: {self.room.block.name}\n"
            f"Date: {self.date}\n"
            f"Time: {self.start_time} - {self.end_time}\n"
            f"Purpose: {self.purpose}\n\n"
            f"Best regards,\nRoomSync Team"
        )
        
        threading.Thread(target=self._send_email_thread, args=(subject, message, [self.user.email])).start()

    def clean(self):
        """Validate booking doesn't overlap with approved bookings"""
        overlapping = Booking.objects.filter(
            room=self.room,
            date=self.date,
            start_time__lt=self.end_time,
            end_time__gt=self.start_time,
            status='approved'  # Only check against approved bookings
        ).exclude(id=self.id)

        if overlapping.exists():
            raise ValidationError("Room already booked for that time.")
        
        # Validate time range
        if self.start_time >= self.end_time:
            raise ValidationError("End time must be after start time.")

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        self.full_clean()  # triggers clean()
        super().save(*args, **kwargs)
        
        # Send confirmation email for new bookings
        if is_new and self.status == 'approved':
            self.send_confirmation_email()

