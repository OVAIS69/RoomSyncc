from django.db import models
from django.conf import settings

class SupportMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Optional: link to a user if they are logged in, but requirement says "Faculty send a message"
    # form just collects name/email/message usually, but good to link if possible.
    # The frontend form in SupportPage just asks for Name/Email/Message, so we'll stick to that
    # but maybe add optional user link.
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Message from {self.name} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
