from users.models import User
try:
    u = User.objects.get(username='admin')
    u.set_password('admin123')
    u.save()
    print("Successfully reset admin password to 'admin123'")
except User.DoesNotExist:
    print("Admin user does not exist. Please run create_default_users command.")
except Exception as e:
    print(f"Error: {e}")
