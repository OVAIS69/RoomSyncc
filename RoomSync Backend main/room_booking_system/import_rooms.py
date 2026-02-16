import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'room_booking_system.settings')
django.setup()

from rooms.models import Room, Block

# Data extracted from src/data.ts
rooms_data = [
    # X-Block
    { 'id': 'X-001', 'name': 'X-001', 'type': 'Classroom', 'capacity': 40, 'block': 'X', 'features': ['Projector', 'Whiteboard'], 'equipment': ['Projector', 'Sound System'], 'isActive': True },
    { 'id': 'X-002', 'name': 'X-002', 'type': 'Classroom', 'capacity': 34, 'block': 'X', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True },
    { 'id': 'X-003', 'name': 'X-003', 'type': 'Classroom', 'capacity': 34, 'block': 'X', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True },
    { 'id': 'X-004', 'name': 'X-004', 'type': 'Classroom', 'capacity': 35, 'block': 'X', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True },
    { 'id': 'X-005', 'name': 'X-005', 'type': 'Classroom', 'capacity': 37, 'block': 'X', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True },
    { 'id': 'X-006', 'name': 'X-006', 'type': 'Classroom', 'capacity': 36, 'block': 'X', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True },
    { 'id': 'X-007', 'name': 'X-007', 'type': 'Classroom', 'capacity': 31, 'block': 'X', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True },
    { 'id': 'X-008', 'name': 'X-008', 'type': 'Classroom', 'capacity': 33, 'block': 'X', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True },
    { 'id': 'X-011', 'name': 'X-011', 'type': 'Staff Room', 'capacity': 45, 'block': 'X', 'features': ['Conference Table', 'Coffee Machine'], 'equipment': ['Projector', 'Video Conferencing'], 'isActive': True },
    { 'id': 'X-012', 'name': 'X-012', 'type': 'Classroom', 'capacity': 45, 'block': 'X', 'features': ['Whiteboard'], 'equipment': ['Projector', 'Sound System'], 'isActive': True },
    { 'id': 'X-013', 'name': 'X-013', 'type': 'Classroom', 'capacity': 34, 'block': 'X', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True },
    { 'id': 'X-014', 'name': 'X-014', 'type': 'Classroom', 'capacity': 33, 'block': 'X', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True },
    { 'id': 'X-015', 'name': 'X-015', 'type': 'Classroom', 'capacity': 34, 'block': 'X', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True },
    { 'id': 'X-016', 'name': 'X-016', 'type': 'Office', 'capacity': 10, 'block': 'X', 'features': ['Private Space', 'Desk'], 'equipment': ['Computer', 'Phone'], 'isActive': True },
    { 'id': 'X-017', 'name': 'X-017', 'type': 'Laboratory', 'capacity': 40, 'block': 'X', 'features': ['Lab Equipment', 'Safety Equipment'], 'equipment': ['Microscopes', 'Lab Tools'], 'isActive': True },
    { 'id': 'X-018', 'name': 'X-018', 'type': 'Classroom', 'capacity': 40, 'block': 'X', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True },
    { 'id': 'X-019', 'name': 'X-019', 'type': 'Computer Lab', 'capacity': 40, 'block': 'X', 'features': ['Computers', 'Network Access'], 'equipment': ['40 Computers', 'Network Switch'], 'isActive': True },
    { 'id': 'X-020', 'name': 'X-020', 'type': 'Classroom', 'capacity': 40, 'block': 'X', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True },
    { 'id': 'X-104', 'name': 'X-104', 'type': 'Laboratory', 'capacity': 103, 'block': 'X', 'features': ['Advanced Lab Equipment', 'Safety Equipment'], 'equipment': ['Advanced Microscopes', 'Lab Tools'], 'isActive': True },
    { 'id': 'X-105', 'name': 'X-105', 'type': 'Laboratory', 'capacity': 16, 'block': 'X', 'features': ['Specialized Equipment'], 'equipment': ['Specialized Tools'], 'isActive': True },
    { 'id': 'X-106', 'name': 'X-106', 'type': 'Laboratory', 'capacity': 42, 'block': 'X', 'features': ['Lab Equipment', 'Safety Equipment'], 'equipment': ['Lab Tools'], 'isActive': True },
    { 'id': 'X-109', 'name': 'X-109', 'type': 'Exam Cell', 'capacity': 20, 'block': 'X', 'features': ['Secure Storage', 'Monitoring'], 'equipment': ['CCTV', 'Secure Cabinets'], 'isActive': True },
    { 'id': 'X-113', 'name': 'X-113', 'type': 'Seminar Hall', 'capacity': 60, 'block': 'X', 'features': ['Stage', 'Audio System'], 'equipment': ['Projector', 'Sound System', 'Microphones'], 'isActive': True },
    { 'id': 'X-114', 'name': 'X-114', 'type': 'Laboratory', 'capacity': 39, 'block': 'X', 'features': ['Lab Equipment'], 'equipment': ['Lab Tools'], 'isActive': True },
    { 'id': 'X-115', 'name': 'X-115', 'type': 'Laboratory', 'capacity': 16, 'block': 'X', 'features': ['Specialized Equipment'], 'equipment': ['Specialized Tools'], 'isActive': True },
    { 'id': 'X-116', 'name': 'X-116', 'type': 'Staff Room', 'capacity': 20, 'block': 'X', 'features': ['Lounge Area', 'Kitchen'], 'equipment': ['Microwave', 'Refrigerator'], 'isActive': True },
    { 'id': 'X-117', 'name': 'X-117', 'type': 'Mobile Lab', 'capacity': 15, 'block': 'X', 'features': ['Portable Equipment'], 'equipment': ['Laptops', 'Mobile Devices'], 'isActive': True },
    { 'id': 'X-118', 'name': 'X-118', 'type': 'Mobile Lab', 'capacity': 15, 'block': 'X', 'features': ['Portable Equipment'], 'equipment': ['Laptops', 'Mobile Devices'], 'isActive': True },
    { 'id': 'X-119', 'name': 'X-119', 'type': 'Laboratory', 'capacity': 20, 'block': 'X', 'features': ['Lab Equipment'], 'equipment': ['Lab Tools'], 'isActive': True },
    { 'id': 'X-120', 'name': 'X-120', 'type': 'Laboratory', 'capacity': 20, 'block': 'X', 'features': ['Lab Equipment'], 'equipment': ['Lab Tools'], 'isActive': True },
    { 'id': 'X-121', 'name': 'X-121', 'type': 'Laboratory', 'capacity': 20, 'block': 'X', 'features': ['Lab Equipment'], 'equipment': ['Lab Tools'], 'isActive': True },
    { 'id': 'X-122', 'name': 'X-122', 'type': 'Laboratory', 'capacity': 20, 'block': 'X', 'features': ['Lab Equipment'], 'equipment': ['Lab Tools'], 'isActive': True },
    { 'id': 'X-123', 'name': 'X-123', 'type': 'Laboratory', 'capacity': 50, 'block': 'X', 'features': ['Large Lab Equipment'], 'equipment': ['Advanced Lab Tools'], 'isActive': True },
    { 'id': 'X-101', 'name': 'X-101', 'type': 'Placement Cell', 'capacity': 25, 'block': 'X', 'features': ['Interview Rooms', 'Waiting Area'], 'equipment': ['Computers', 'Video Conferencing'], 'isActive': True },
    { 'id': 'X-102', 'name': 'X-102', 'type': 'IQAC', 'capacity': 15, 'block': 'X', 'features': ['Conference Room', 'Office Space'], 'equipment': ['Computers', 'Projector'], 'isActive': True },
    { 'id': 'X-103', 'name': 'X-103', 'type': 'Laboratory', 'capacity': 42, 'block': 'X', 'features': ['Lab Equipment'], 'equipment': ['Lab Tools'], 'isActive': True },
    
    # Y-Block
    { 'id': 'Y-001', 'name': 'Y-001', 'type': 'Seminar Hall', 'capacity': 60, 'block': 'Y', 'features': ['Stage', 'Audio System'], 'equipment': ['Projector', 'Sound System', 'Microphones'], 'isActive': True },
    { 'id': 'Y-002', 'name': 'Y-002', 'type': 'Classroom', 'capacity': 42, 'block': 'Y', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True },
    { 'id': 'Y-003', 'name': 'Y-003', 'type': 'Reading Room', 'capacity': 30, 'block': 'Y', 'features': ['Quiet Space', 'Study Tables'], 'equipment': ['Computers', 'Printers'], 'isActive': True },
    { 'id': 'Y-102', 'name': 'Y-102', 'type': 'Classroom', 'capacity': 40, 'block': 'Y', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True },
    { 'id': 'Y-103', 'name': 'Y-103', 'type': 'Classroom', 'capacity': 40, 'block': 'Y', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True },
    { 'id': 'Y-104', 'name': 'Y-104', 'type': 'Staff Room', 'capacity': 25, 'block': 'Y', 'features': ['Lounge Area', 'Kitchen'], 'equipment': ['Microwave', 'Refrigerator'], 'isActive': True },
    { 'id': 'Y-105', 'name': 'Y-105', 'type': 'Classroom', 'capacity': 40, 'block': 'Y', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True },
    { 'id': 'Y-106', 'name': 'Y-106', 'type': 'Classroom', 'capacity': 42, 'block': 'Y', 'features': ['Whiteboard'], 'equipment': ['Projector'], 'isActive': True }
]

def import_rooms():
    # Ensure blocks exist
    blocks = {}
    for block_name in ['X', 'Y']:
        block, created = Block.objects.get_or_create(name=block_name)
        if created:
            print(f"Created Block: {block_name}")
        blocks[block_name] = block

    print(f"Starting import of {len(rooms_data)} rooms...")
    
    created_count = 0
    updated_count = 0

    for item in rooms_data:
        block_name = item['block']
        if block_name not in blocks:
            print(f"Skipping room {item['name']}: Block {block_name} not found")
            continue

        room, created = Room.objects.update_or_create(
            room_number=item['name'],
            block=blocks[block_name],
            defaults={
                'room_type': item['type'],
                'capacity': item['capacity'],
                'features': item['features'],
                'equipment': item['equipment'],
                'is_active': item.get('isActive', True)
            }
        )
        
        if created:
            created_count += 1
        else:
            updated_count += 1

    print(f"Import complete. Created: {created_count}, Updated: {updated_count}")
    print(f"Total rooms in DB: {Room.objects.count()}")

if __name__ == "__main__":
    import_rooms()
