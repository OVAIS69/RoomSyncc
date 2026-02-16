from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupportMessageViewSet

router = DefaultRouter()
router.register(r'messages', SupportMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
