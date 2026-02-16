from django.db import models

class Block(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']  # ✅ ascending order by name

class Room(models.Model):
    block = models.ForeignKey(Block, on_delete=models.CASCADE)
    room_number = models.CharField(max_length=20, unique=True)
    room_type = models.CharField(
        max_length=50,
        choices=[
            ('Classroom', 'Classroom'),
            ('Lab', 'Lab'),
            ('Seminar Hall', 'Seminar Hall'),
            ('Reading Room', 'Reading Room'),
            ('Auditorium', 'Auditorium'),
            ('Staff Room', 'Staff Room'),
            ('Office', 'Office'),
            ('Laboratory', 'Laboratory'),
            ('Computer Lab', 'Computer Lab'),
            ('Exam Cell', 'Exam Cell'),
            ('Mobile Lab', 'Mobile Lab'),
            ('Placement Cell', 'Placement Cell'),
            ('IQAC', 'IQAC'),
        ]
    )
    capacity = models.PositiveIntegerField()
    features = models.JSONField(default=list, blank=True)
    equipment = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.room_number} ({self.room_type})"

    class Meta:
        unique_together = ('room_number', 'block')  # ✅ prevents duplicates
        ordering = ['room_number']  # ✅ ascending order