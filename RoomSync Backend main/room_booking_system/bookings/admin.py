from django.contrib import admin
from django.core.mail import send_mail
from django.conf import settings
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('room', 'user', 'date', 'start_time', 'end_time', 'status')
    list_filter = ('status', 'date', 'room')
    search_fields = ('room__room_number', 'user__username', 'user__email')
    ordering = ('date', 'start_time')
    list_editable = ('status',)

    def save_model(self, request, obj, form, change):
        # If status is updated
        if change and 'status' in form.changed_data:
            if obj.status == 'approved':
                subject = f"Booking Approved: Room {obj.room.room_number}"
                message = (
                    f"Dear {obj.user.username},\n\n"
                    f"Your booking for Room {obj.room.room_number} "
                    f"on {obj.date} from {obj.start_time} to {obj.end_time} has been APPROVED.\n\n"
                    f"Regards,\nAdmin"
                )
                # Send email to the user
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [obj.user.email])

                # Optionally, notify all faculty/admins (if you have a group email list)
                faculty_admin_emails = ["faculty1@example.com", "faculty2@example.com"]  
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, faculty_admin_emails)

        super().save_model(request, obj, form, change)
