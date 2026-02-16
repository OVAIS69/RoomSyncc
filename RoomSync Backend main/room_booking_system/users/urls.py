from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('user/', views.current_user_view, name='current-user'),
    path('check/', views.check_auth_view, name='check-auth'),
    path('manage/', views.get_users_view, name='get-users'),
    path('manage/create/', views.create_user_view, name='create-user'),
    path('manage/<int:pk>/', views.manage_user_view, name='manage-user'),
]
