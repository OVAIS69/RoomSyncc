from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from .models import Booking
from .serializers import (
    BookingSerializer,
    BookingCreateSerializer,
    BookingApprovalSerializer,
    BookingRejectionSerializer
)


class BookingViewSet(viewsets.ModelViewSet):
    """API endpoint for managing bookings"""
    queryset = Booking.objects.all()
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'by_room', 'by_date']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        elif self.action == 'approve':
            return BookingApprovalSerializer
        elif self.action == 'reject':
            return BookingRejectionSerializer
        return BookingSerializer
    
    def get_queryset(self):
        queryset = Booking.objects.all().select_related('room', 'user', 'approved_by').order_by('-created_at')
        
        # Filter by room
        room_id = self.request.query_params.get('room', None)
        if room_id:
            queryset = queryset.filter(room_id=room_id)
        
        # Filter by date
        date = self.request.query_params.get('date', None)
        if date:
            queryset = queryset.filter(date=date)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by user (my bookings)
        if self.request.query_params.get('my_bookings', None) == 'true':
            if self.request.user.is_authenticated:
                from django.db.models import Q
                queryset = queryset.filter(
                    Q(user=self.request.user) | Q(faculty_email=self.request.user.email)
                )
        
        return queryset
    
    def perform_create(self, serializer):
        from django.contrib.auth import get_user_model
        from rest_framework.exceptions import ValidationError
        
        print(f"DEBUG: perform_create request.data: {self.request.data}")
        faculty_email = serializer.validated_data.get('faculty_email', None)
        print(f"DEBUG: perform_create called. faculty_email={faculty_email}")

        # Validate faculty email if provided by admin
        if self.request.user.role == 'admin' and faculty_email:
            User = get_user_model()
            try:
                user_obj = User.objects.get(email=faculty_email)
                if user_obj.role != 'faculty':
                    raise ValidationError({"faculty_email": "The provided email does not belong to a Faculty member."})
            except User.DoesNotExist:
                raise ValidationError({"faculty_email": "No user found with this email."})
        
        # 'faculty_email' is now a model field, so we DO NOT pop it. serializer.save() will handle it.

        booking = serializer.save(user=self.request.user)
        
        # Approve immediately since Admin is creating it
        if self.request.user.role == 'admin':
            print("DEBUG: User is admin, approving booking immediately.")
            booking.status = 'approved'
            booking.approved_by = self.request.user
            booking.approved_at = timezone.now()
            booking.save()
            
            # Use faculty_email if provided, otherwise user's email
            recipient_email = booking.faculty_email if booking.faculty_email else self.request.user.email
            print(f"DEBUG: Sending confirmation email to {recipient_email}")
            
            # Send confirmation email
            from django.core.mail import send_mail
            try:
                sent_count = send_mail(
                    'Room Booking Confirmation',
                    f'Your booking for Room {booking.room.room_number} on {booking.date} from {booking.start_time} to {booking.end_time} has been confirmed.',
                    'noreply@roomsync.com',
                    [recipient_email],
                    fail_silently=False, # Change to False to see errors
                )
                print(f"DEBUG: Email sent successfully. Count: {sent_count}")
            except Exception as e:
                print(f"DEBUG: Failed to send email: {e}")
                import traceback
                traceback.print_exc()

    def perform_destroy(self, instance):
        """Send email before deleting/cancelling the booking"""
        from django.core.mail import send_mail
        
        print(f"DEBUG: perform_destroy called for booking {instance.id}")
        
        # Get recipient email (stored faculty_email or User's email)
        recipient_email = instance.faculty_email if instance.faculty_email else instance.user.email
        
        subject = 'Room Booking Cancelled'
        message = (
            f"Dear User,\n\n"
            f"Your booking for Room {instance.room.room_number} on {instance.date} "
            f"from {instance.start_time} to {instance.end_time} has been CANCELLED by the administrator.\n\n"
            "If you have any questions, please contact support.\n\n"
            "Regards,\nRoomSync Admin"
        )
        
        try:
            print(f"DEBUG: Sending cancellation email to {recipient_email}")
            send_mail(
                subject,
                message,
                'noreply@roomsync.com',
                [recipient_email],
                fail_silently=False,
            )
            print("DEBUG: Cancellation email sent.")
        except Exception as e:
            print(f"DEBUG: Failed to send cancellation email: {e}")
        
        # Proceed with deletion
        instance.delete()
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def pending(self, request):
        """Get all pending bookings (admin/faculty only)"""
        if request.user.role not in ['admin', 'faculty']:
            return Response(
                {'error': 'Only admin and faculty can view pending bookings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        pending_bookings = Booking.objects.filter(status='pending').select_related('room', 'user').order_by('date', 'start_time')
        serializer = BookingSerializer(pending_bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def approve(self, request, pk=None):
        """Approve a pending booking (admin/faculty only)"""
        if request.user.role not in ['admin', 'faculty']:
            return Response(
                {'error': 'Only admin and faculty can approve bookings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        booking = self.get_object()
        
        if booking.status != 'pending':
            return Response(
                {'error': f'Cannot approve booking with status: {booking.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            booking.approve(request.user)
            serializer = BookingSerializer(booking)
            return Response({
                'message': 'Booking approved successfully',
                'booking': serializer.data
            })
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def reject(self, request, pk=None):
        """Reject a pending booking (admin/faculty only)"""
        if request.user.role not in ['admin', 'faculty']:
            return Response(
                {'error': 'Only admin and faculty can reject bookings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        booking = self.get_object()
        
        if booking.status != 'pending':
            return Response(
                {'error': f'Cannot reject booking with status: {booking.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = BookingRejectionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        rejection_reason = serializer.validated_data.get('rejection_reason', '')
        booking.reject(request.user, rejection_reason)
        
        booking_serializer = BookingSerializer(booking)
        return Response({
            'message': 'Booking rejected successfully',
            'booking': booking_serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def by_room(self, request):
        """Get bookings for a specific room"""
        room_id = request.query_params.get('room_id', None)
        date = request.query_params.get('date', None)
        
        if not room_id:
            return Response(
                {'error': 'room_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        queryset = Booking.objects.filter(room_id=room_id)
        
        if date:
            queryset = queryset.filter(date=date)
        
        serializer = BookingSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_date(self, request):
        """Get all bookings for a specific date"""
        date = request.query_params.get('date', None)
        
        if not date:
            # Default to today
            date = timezone.now().date()
        
        queryset = Booking.objects.filter(date=date)
        serializer = BookingSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_bookings(self, request):
        """Get current user's bookings"""
        queryset = Booking.objects.filter(user=request.user).order_by('-date')
        serializer = BookingSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        """Cancel a booking"""
        booking = self.get_object()
        
        if booking.user != request.user and request.user.role != 'admin':
            return Response(
                {'error': 'You can only cancel your own bookings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if booking.status == 'cancelled':
            return Response(
                {'error': 'Booking is already cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booking.cancel()
        serializer = BookingSerializer(booking)
        return Response({
            'message': 'Booking cancelled successfully',
            'booking': serializer.data
        })

