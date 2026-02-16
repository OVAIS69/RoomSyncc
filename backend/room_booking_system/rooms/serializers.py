from rest_framework import serializers
from .models import Room, Block


class BlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Block
        fields = ['id', 'name']


class RoomSerializer(serializers.ModelSerializer):
    block_name = serializers.CharField(source='block.name', read_only=True)
    
    class Meta:
        model = Room
        fields = [
            'id', 
            'room_number', 
            'room_type', 
            'capacity', 
            'block', 
            'block_name',
            'features', 
            'equipment', 
            'is_active'
        ]


class RoomListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    block = serializers.CharField(source='block.name', read_only=True)
    
    class Meta:
        model = Room
        fields = [
            'id',
            'room_number',
            'room_type',
            'capacity',
            'block',
            'features',
            'equipment',
            'is_active'
        ]
