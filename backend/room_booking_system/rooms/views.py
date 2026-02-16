from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Room, Block
from .serializers import RoomSerializer, RoomListSerializer, BlockSerializer


class BlockViewSet(viewsets.ModelViewSet):
    """API endpoint for viewing and managing blocks"""
    queryset = Block.objects.all()
    serializer_class = BlockSerializer
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'admin':
             return Response({'error': 'Only admins can manage blocks'}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'admin':
             return Response({'error': 'Only admins can manage blocks'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'admin':
             return Response({'error': 'Only admins can manage blocks'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


class RoomViewSet(viewsets.ModelViewSet):
    """API endpoint for viewing and managing rooms"""
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        """Allow read for all, write for admin only"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()] # Logic inside to check role manually or use custom permission
        return [AllowAny()]

    def get_serializer_class(self):
        if self.action == 'list':
            return RoomListSerializer
        return RoomSerializer
    
    def get_queryset(self):
        # Admins see all rooms, others see active only
        user = self.request.user
        if user.is_authenticated and (user.role == 'admin' or user.is_superuser):
            queryset = Room.objects.all()
        else:
            queryset = Room.objects.filter(is_active=True)
            
        # Filter by block
        block = self.request.query_params.get('block', None)
        if block:
            queryset = queryset.filter(block__name=block)
        
        # Filter by room type
        room_type = self.request.query_params.get('type', None)
        if room_type:
            queryset = queryset.filter(room_type=room_type)
        
        # Filter by minimum capacity
        min_capacity = self.request.query_params.get('min_capacity', None)
        if min_capacity:
            queryset = queryset.filter(capacity__gte=min_capacity)
        
        return queryset.order_by('room_number')

    def create(self, request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'admin':
             return Response({'error': 'Only admins can create rooms'}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'admin':
             return Response({'error': 'Only admins can update rooms'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'admin':
             return Response({'error': 'Only admins can delete rooms'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def by_block(self, request):
        """Get rooms grouped by block"""
        blocks = Block.objects.all()
        result = {}
        
        for block in blocks:
            rooms = Room.objects.filter(block=block, is_active=True)
            result[block.name] = RoomListSerializer(rooms, many=True).data
        
        return Response(result)
    
    @action(detail=False, methods=['get'])
    def types(self, request):
        """Get list of unique room types"""
        types = Room.objects.filter(is_active=True).values_list('room_type', flat=True).distinct()
        return Response(list(types))
