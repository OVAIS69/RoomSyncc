from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'blocks', views.BlockViewSet, basename='block')
router.register(r'', views.RoomViewSet, basename='room')

urlpatterns = router.urls
