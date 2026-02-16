from rest_framework import serializers
from .models import Booking
from rooms.serializers import RoomListSerializer


class BookingSerializer(serializers.ModelSerializer):
    room_details = RoomListSerializer(source='room', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_full_name = serializers.SerializerMethodField()
    user_email = serializers.EmailField(source='user.email', read_only=True)

    def get_user_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
    approved_by_name = serializers.CharField(source='approved_by.username', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id',
            'room',
            'room_details',
            'user',
            'user_name',
            'user_full_name',
            'user_email',
            'date',
            'start_time',
            'end_time',
            'purpose',
            'status',
            'rejection_reason',
            'approved_by',
            'approved_by_name',
            'approved_at',
            'created_at',
            'updated_at',
            'faculty_email'
        ]
        read_only_fields = ['user', 'status', 'approved_by', 'approved_at', 'created_at', 'updated_at']


class BookingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating bookings"""
    
    class Meta:
        model = Booking
        fields = [
            'room',
            'date',
            'start_time',
            'end_time',
            'purpose',
            'faculty_email'
        ]
    
    def validate(self, data):
        # Check for overlapping approved bookings
        overlapping = Booking.objects.filter(
            room=data['room'],
            date=data['date'],
            start_time__lt=data['end_time'],
            end_time__gt=data['start_time'],
            status='approved'
        )
        
        if overlapping.exists():
            raise serializers.ValidationError(
                "This room is already booked for the selected time slot."
            )
        
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError(
                "End time must be after start time."
            )
        
        return data


class BookingApprovalSerializer(serializers.Serializer):
    """Serializer for approving bookings"""
    pass


class BookingRejectionSerializer(serializers.Serializer):
    """Serializer for rejecting bookings"""
    rejection_reason = serializers.CharField(required=False, allow_blank=True)

