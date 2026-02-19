from django.core.management.base import BaseCommand
from users.models import User
from bookings.models import Booking
from rooms.models import Room
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = 'Creates default admin user and sample bookings for testing'

    def handle(self, *args, **kwargs):
        # Create default admin user
        admin_username = 'admin'
        admin_email = 'admin@roomsync.com'
        admin_password = 'admin123'
        
        if User.objects.filter(username=admin_username).exists():
            self.stdout.write(self.style.WARNING(f'Admin user "{admin_username}" already exists. Resetting password.'))
            admin_user = User.objects.get(username=admin_username)
            admin_user.set_password(admin_password)
            admin_user.save()
        else:
            admin_user = User.objects.create_user(
                username=admin_username,
                email=admin_email,
                password=admin_password,
                role='admin',
                first_name='Admin',
                last_name='User'
            )
            self.stdout.write(self.style.SUCCESS(f'✅ Created admin user: {admin_username}'))
            self.stdout.write(self.style.SUCCESS(f'   Email: {admin_email}'))
            self.stdout.write(self.style.SUCCESS(f'   Password: {admin_password}'))

        # Create faculty user
        faculty_username = 'faculty'
        faculty_email = 'faculty@roomsync.com'
        faculty_password = 'faculty123'
        
        if User.objects.filter(username=faculty_username).exists():
            self.stdout.write(self.style.WARNING(f'Faculty user "{faculty_username}" already exists'))
            faculty_user = User.objects.get(username=faculty_username)
        else:
            faculty_user = User.objects.create_user(
                username=faculty_username,
                email=faculty_email,
                password=faculty_password,
                role='faculty',
                first_name='John',
                last_name='Faculty'
            )
            self.stdout.write(self.style.SUCCESS(f'✅ Created faculty user: {faculty_username}'))
            self.stdout.write(self.style.SUCCESS(f'   Email: {faculty_email}'))
            self.stdout.write(self.style.SUCCESS(f'   Password: {faculty_password}'))

        # Create student user
        student_username = 'student'
        student_email = 'student@roomsync.com'
        student_password = 'student123'
        
        if User.objects.filter(username=student_username).exists():
            self.stdout.write(self.style.WARNING(f'Student user "{student_username}" already exists'))
            student_user = User.objects.get(username=student_username)
        else:
            student_user = User.objects.create_user(
                username=student_username,
                email=student_email,
                password=student_password,
                role='student',
                first_name='Jane',
                last_name='Student'
            )
            self.stdout.write(self.style.SUCCESS(f'✅ Created student user: {student_username}'))
            self.stdout.write(self.style.SUCCESS(f'   Email: {student_email}'))
            self.stdout.write(self.style.SUCCESS(f'   Password: {student_password}'))

        # Create IEEE Head (Student Representative)
        ieee_username = 'ieee_head'
        ieee_email = 'ieee@roomsync.com'
        ieee_password = 'ieee123'
        
        if User.objects.filter(username=ieee_username).exists():
            self.stdout.write(self.style.WARNING(f'Student Rep "{ieee_username}" already exists'))
            ieee_user = User.objects.get(username=ieee_username)
        else:
            ieee_user = User.objects.create_user(
                username=ieee_username,
                email=ieee_email,
                password=ieee_password,
                role='student_rep',
                first_name='IEEE',
                last_name='Head'
            )
            self.stdout.write(self.style.SUCCESS(f'✅ Created Student Rep: {ieee_username}'))
            self.stdout.write(self.style.SUCCESS(f'   Email: {ieee_email}'))
            self.stdout.write(self.style.SUCCESS(f'   Password: {ieee_password}'))

        # Create sample bookings
        self.stdout.write(self.style.SUCCESS('\n📅 Creating sample bookings...'))
        
        # Get some rooms
        rooms = Room.objects.filter(is_active=True)[:5]
        
        if rooms.exists():
            today = datetime.now().date()
            
            # Create approved booking (by faculty)
            room1 = rooms[0]
            if not Booking.objects.filter(room=room1, date=today).exists():
                booking1 = Booking.objects.create(
                    room=room1,
                    user=faculty_user,
                    date=today,
                    start_time='09:00',
                    end_time='11:00',
                    purpose='Mathematics Lecture',
                    status='approved',
                    approved_by=admin_user,
                    approved_at=datetime.now()
                )
                self.stdout.write(self.style.SUCCESS(f'   ✅ Approved booking: {room1.room_number} by {faculty_user.username}'))

            # Create pending booking (by student)
            room2 = rooms[1] if len(rooms) > 1 else rooms[0]
            tomorrow = today + timedelta(days=1)
            if not Booking.objects.filter(room=room2, date=tomorrow, user=student_user).exists():
                booking2 = Booking.objects.create(
                    room=room2,
                    user=student_user,
                    date=tomorrow,
                    start_time='14:00',
                    end_time='16:00',
                    purpose='Study Group Session',
                    status='pending'
                )
                self.stdout.write(self.style.SUCCESS(f'   ✅ Pending booking: {room2.room_number} by {student_user.username}'))

            # Create another pending booking
            room3 = rooms[2] if len(rooms) > 2 else rooms[0]
            if not Booking.objects.filter(room=room3, date=tomorrow, start_time='10:00').exists():
                booking3 = Booking.objects.create(
                    room=room3,
                    user=student_user,
                    date=tomorrow,
                    start_time='10:00',
                    end_time='12:00',
                    purpose='Project Presentation',
                    status='pending'
                )
                self.stdout.write(self.style.SUCCESS(f'   ✅ Pending booking: {room3.room_number} by {student_user.username}'))

        self.stdout.write(self.style.SUCCESS('\n' + '='*50))
        self.stdout.write(self.style.SUCCESS('🎉 Setup Complete!'))
        self.stdout.write(self.style.SUCCESS('='*50))
        self.stdout.write(self.style.SUCCESS('\n📝 Default Users Created:'))
        self.stdout.write(self.style.SUCCESS('\n1. Admin:'))
        self.stdout.write(self.style.SUCCESS(f'   Username: {admin_username}'))
        self.stdout.write(self.style.SUCCESS(f'   Password: {admin_password}'))
        self.stdout.write(self.style.SUCCESS('\n2. Faculty:'))
        self.stdout.write(self.style.SUCCESS(f'   Username: {faculty_username}'))
        self.stdout.write(self.style.SUCCESS(f'   Password: {faculty_password}'))
        self.stdout.write(self.style.SUCCESS('\n3. Student:'))
        self.stdout.write(self.style.SUCCESS(f'   Username: {student_username}'))
        self.stdout.write(self.style.SUCCESS(f'   Password: {student_password}'))
        self.stdout.write(self.style.SUCCESS('\n💡 You can now login at http://localhost:3000'))
        self.stdout.write(self.style.SUCCESS('='*50 + '\n'))
