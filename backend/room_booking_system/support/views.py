from rest_framework import viewsets, permissions
from .models import SupportMessage
from .serializers import SupportMessageSerializer

class SupportMessageViewSet(viewsets.ModelViewSet):
    queryset = SupportMessage.objects.all().order_by('-created_at')
    serializer_class = SupportMessageSerializer
    
    def get_queryset(self):
        # Only admins can see messages
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return SupportMessage.objects.all().order_by('-created_at')
        return SupportMessage.objects.none()
    
    def get_permissions(self):
        """
        Allow anyone to post (create) a message.
        Restrict list/retrieve to Admins (role='admin').
        """
        if self.action == 'create':
             return [permissions.AllowAny()] 
        return [permissions.IsAuthenticated()] # We check role in get_queryset or check logic

    def perform_create(self, serializer):
        # If user is authenticated, save them
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()
