from rest_framework import serializers
from .models import SupportMessage

class SupportMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportMessage
        fields = ['id', 'name', 'email', 'message', 'is_read', 'created_at', 'user']
        read_only_fields = ['id', 'created_at', 'is_read']
