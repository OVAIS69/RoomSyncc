// TypeScript interfaces for better type safety
export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  block: string;
  features?: string[];
  equipment?: string[];
  isActive?: boolean;
}

export interface Booking {
  id: number;
  roomId: string;
  bookedBy: string;
  event: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  attendees?: number;
  description?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'faculty';
  email: string;
  department?: string;
}

export interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

export interface TeamMember {
  name: string;
  id: string;
  role: string;
  email?: string;
  github?: string;
}

// Enhanced room data with additional properties
export const roomsData: Record<string, Room[]> = {
  'X-Block': [
    { id: 'X-001', name: 'X-001', type: 'Classroom', capacity: 40, block: 'X', features: ['Projector', 'Whiteboard'], equipment: ['Projector', 'Sound System'], isActive: true },
    { id: 'X-002', name: 'X-002', type: 'Classroom', capacity: 34, block: 'X', features: ['Whiteboard'], equipment: ['Projector'], isActive: true },
    { id: 'X-003', name: 'X-003', type: 'Classroom', capacity: 34, block: 'X', features: ['Whiteboard'], equipment: ['Projector'], isActive: true },
    { id: 'X-004', name: 'X-004', type: 'Classroom', capacity: 35, block: 'X', features: ['Whiteboard'], equipment: ['Projector'], isActive: true },
    { id: 'X-005', name: 'X-005', type: 'Classroom', capacity: 37, block: 'X', features: ['Whiteboard'], equipment: ['Projector'], isActive: true },
    { id: 'X-006', name: 'X-006', type: 'Classroom', capacity: 36, block: 'X', features: ['Whiteboard'], equipment: ['Projector'], isActive: true },
    { id: 'X-007', name: 'X-007', type: 'Classroom', capacity: 31, block: 'X', features: ['Whiteboard'], equipment: ['Projector'], isActive: true },
    { id: 'X-008', name: 'X-008', type: 'Classroom', capacity: 33, block: 'X', features: ['Whiteboard'], equipment: ['Projector'], isActive: true },
    { id: 'X-011', name: 'X-011', type: 'Staff Room', capacity: 45, block: 'X', features: ['Conference Table', 'Coffee Machine'], equipment: ['Projector', 'Video Conferencing'], isActive: true },
    { id: 'X-012', name: 'X-012', type: 'Classroom', capacity: 45, block: 'X', features: ['Whiteboard'], equipment: ['Projector', 'Sound System'], isActive: true },
    { id: 'X-013', name: 'X-013', type: 'Classroom', capacity: 34, block: 'X', features: ['Whiteboard'], equipment: ['Projector'], isActive: true },
    { id: 'X-014', name: 'X-014', type: 'Classroom', capacity: 33, block: 'X', features: ['Whiteboard'], equipment: ['Projector'], isActive: true },
    { id: 'X-015', name: 'X-015', type: 'Classroom', capacity: 34, block: 'X', features: ['Whiteboard'], equipment: ['Projector'], isActive: true },
    { id: 'X-016', name: 'X-016', type: 'Office', capacity: 10, block: 'X', features: ['Private Space', 'Desk'], equipment: ['Computer', 'Phone'], isActive: true },
    { id: 'X-017', name: 'X-017', type: 'Laboratory', capacity: 40, block: 'X', features: ['Lab Equipment', 'Safety Equipment'], equipment: ['Microscopes', 'Lab Tools'], isActive: true },
    { id: 'X-018', name: 'X-018', type: 'Classroom', capacity: 40, block: 'X', features: ['Whiteboard'], equipment: ['Projector'], isActive: true },
    { id: 'X-019', name: 'X-019', type: 'Computer Lab', capacity: 40, block: 'X', features: ['Computers', 'Network Access'], equipment: ['40 Computers', 'Network Switch'], isActive: true },
    { id: 'X-020', name: 'X-020', type: 'Classroom', capacity: 40, block: 'X', features: ['Whiteboard'], equipment: ['Projector'], isActive: true },
    { id: 'X-104', name: 'X-104', type: 'Laboratory', capacity: 103, block: 'X', features: ['Advanced Lab Equipment', 'Safety Equipment'], equipment: ['Advanced Microscopes', 'Lab Tools'], isActive: true },
    { id: 'X-105', name: 'X-105', type: 'Laboratory', capacity: 16, block: 'X', features: ['Specialized Equipment'], equipment: ['Specialized Tools'], isActive: true },
    { id: 'X-106', name: 'X-106', type: 'Laboratory', capacity: 42, block: 'X', features: ['Lab Equipment', 'Safety Equipment'], equipment: ['Lab Tools'], isActive: true },
    { id: 'X-109', name: 'X-109', type: 'Exam Cell', capacity: 20, block: 'X', features: ['Secure Storage', 'Monitoring'], equipment: ['CCTV', 'Secure Cabinets'], isActive: true },
    { id: 'X-113', name: 'X-113', type: 'Seminar Hall', capacity: 60, block: 'X', features: ['Stage', 'Audio System'], equipment: ['Projector', 'Sound System', 'Microphones'], isActive: true },
    { id: 'X-114', name: 'X-114', type: 'Laboratory', capacity: 39, block: 'X', features: ['Lab Equipment'], equipment: ['Lab Tools'], isActive: true },
    { id: 'X-115', name: 'X-115', type: 'Laboratory', capacity: 16, block: 'X', features: ['Specialized Equipment'], equipment: ['Specialized Tools'], isActive: true },
    { id: 'X-116', name: 'X-116', type: 'Staff Room', capacity: 20, block: 'X', features: ['Lounge Area', 'Kitchen'], equipment: ['Microwave', 'Refrigerator'], isActive: true },
    { id: 'X-117', name: 'X-117', type: 'Mobile Lab', capacity: 15, block: 'X', features: ['Portable Equipment'], equipment: ['Laptops', 'Mobile Devices'], isActive: true },
    { id: 'X-118', name: 'X-118', type: 'Mobile Lab', capacity: 15, block: 'X', features: ['Portable Equipment'], equipment: ['Laptops', 'Mobile Devices'], isActive: true },
    { id: 'X-119', name: 'X-119', type: 'Laboratory', capacity: 20, block: 'X', features: ['Lab Equipment'], equipment: ['Lab Tools'], isActive: true },
    { id: 'X-120', name: 'X-120', type: 'Laboratory', capacity: 20, block: 'X', features: ['Lab Equipment'], equipment: ['Lab Tools'], isActive: true },
    { id: 'X-121', name: 'X-121', type: 'Laboratory', capacity: 20, block: 'X', features: ['Lab Equipment'], equipment: ['Lab Tools'], isActive: true },
    { id: 'X-122', name: 'X-122', type: 'Laboratory', capacity: 20, block: 'X', features: ['Lab Equipment'], equipment: ['Lab Tools'], isActive: true },
    { id: 'X-123', name: 'X-123', type: 'Laboratory', capacity: 50, block: 'X', features: ['Large Lab Equipment'], equipment: ['Advanced Lab Tools'], isActive: true },
    { id: 'X-101', name: 'X-101', type: 'Placement Cell', capacity: 25, block: 'X', features: ['Interview Rooms', 'Waiting Area'], equipment: ['Computers', 'Video Conferencing'], isActive: true },
    { id: 'X-102', name: 'X-102', type: 'IQAC', capacity: 15, block: 'X', features: ['Conference Room', 'Office Space'], equipment: ['Computers', 'Projector'], isActive: true },
    { id: 'X-103', name: 'X-103', type: 'Laboratory', capacity: 42, block: 'X', features: ['Lab Equipment'], equipment: ['Lab Tools'], isActive: true }
  ],
  'Y-Block': [
    { id: 'Y-001', name: 'Y-001', type: 'Seminar Hall', capacity: 60, block: 'Y', features: ['Stage', 'Audio System'], equipment: ['Projector', 'Sound System', 'Microphones'], isActive: true },
    { id: 'Y-002', name: 'Y-002', type: 'Classroom', capacity: 42, block: 'Y', features: ['Whiteboard'], equipment: ['Projector'], isActive: true },
    { id: 'Y-003', name: 'Y-003', type: 'Reading Room', capacity: 30, block: 'Y', features: ['Quiet Space', 'Study Tables'], equipment: ['Computers', 'Printers'], isActive: true },
    { id: 'Y-102', name: 'Y-102', type: 'Classroom', capacity: 40, block: 'Y', features: ['Whiteboard'], equipment: ['Projector'], isActive: true },
    { id: 'Y-103', name: 'Y-103', type: 'Classroom', capacity: 40, block: 'Y', features: ['Whiteboard'], equipment: ['Projector'], isActive: true },
    { id: 'Y-104', name: 'Y-104', type: 'Staff Room', capacity: 25, block: 'Y', features: ['Lounge Area', 'Kitchen'], equipment: ['Microwave', 'Refrigerator'], isActive: true },
    { id: 'Y-105', name: 'Y-105', type: 'Classroom', capacity: 40, block: 'Y', features: ['Whiteboard'], equipment: ['Projector'], isActive: true },
    { id: 'Y-106', name: 'Y-106', type: 'Classroom', capacity: 42, block: 'Y', features: ['Whiteboard'], equipment: ['Projector'], isActive: true }
  ]
};

export const allRooms: Room[] = [...roomsData['X-Block'], ...roomsData['Y-Block']];

// Enhanced mock bookings data with timestamps
export const mockBookings: Booking[] = [
  {
    id: 1,
    roomId: 'X-001',
    bookedBy: 'Dr. Smith',
    event: 'Mathematics Lecture',
    date: '2024-09-01',
    time: '09:00-11:00',
    status: 'confirmed',
    attendees: 35,
    description: 'Advanced Calculus for Engineering Students',
    createdAt: '2024-08-25T10:30:00Z'
  },
  {
    id: 2,
    roomId: 'Y-001',
    bookedBy: 'Prof. Johnson',
    event: 'Physics Seminar',
    date: '2024-09-01',
    time: '14:00-16:00',
    status: 'confirmed',
    attendees: 45,
    description: 'Quantum Mechanics Research Presentation',
    createdAt: '2024-08-26T14:15:00Z'
  },
  {
    id: 3,
    roomId: 'X-104',
    bookedBy: 'Dr. Brown',
    event: 'Chemistry Lab',
    date: '2024-09-02',
    time: '10:00-12:00',
    status: 'pending',
    attendees: 25,
    description: 'Organic Chemistry Laboratory Session',
    createdAt: '2024-08-27T09:45:00Z'
  },
  {
    id: 4,
    roomId: 'Y-002',
    bookedBy: 'Prof. Davis',
    event: 'Computer Science Lab',
    date: '2024-09-02',
    time: '13:00-15:00',
    status: 'confirmed',
    attendees: 30,
    description: 'Data Structures and Algorithms Lab',
    createdAt: '2024-08-28T11:20:00Z'
  },
];

// Enhanced FAQ data with categories
export const faqData: FAQ[] = [
  {
    question: "How do I book a room?",
    answer: "Faculty and admin users can book rooms by navigating to the Booking page, selecting a room, choosing date/time, and adding event details.",
    category: "Booking"
  },

  {
    question: "How do I check room availability?",
    answer: "You can check availability through the Dashboard calendar view or the Blueprint interactive map. Green indicates available, red means booked, and yellow shows pending bookings.",
    category: "Availability"
  },
  {
    question: "What happens if there's a booking conflict?",
    answer: "The system automatically checks for conflicts and will prevent double bookings. You'll receive an alert if you try to book an occupied time slot.",
    category: "Booking"
  },
  {
    question: "Can I cancel or modify my booking?",
    answer: "Yes, you can modify or cancel your bookings through the Dashboard. Changes must be made at least 24 hours in advance.",
    category: "Management"
  },
  {
    question: "What equipment is available in each room?",
    answer: "Each room has different equipment. Check the room details by clicking on any room in the Blueprint view to see available features and equipment.",
    category: "Equipment"
  }
];

// Enhanced team members data
export const teamMembers: TeamMember[] = [
  {
    name: 'Noorsharma Ansari',
    id: '29802B0044',
    role: 'Project Lead & Backend Developer',
    email: 'noorsharma.ansari@example.com',
    github: 'noorsharma-ansari'
  },
  {
    name: 'Sneha Singh',
    id: '29302C0008',
    role: 'Frontend Developer & UI/UX Designer',
    email: 'sneha.singh@example.com',
    github: 'sneha-singh'
  },
  {
    name: 'Mohd Ovais Shaikh',
    id: '29302B0058',
    role: 'Full Stack Developer & Database Designer',
    email: 'ovais.shaikh@example.com',
    github: 'ovais-shaikh'
  }
];

// Technology stack
export const techStack: string[] = ['React', 'TypeScript', 'Tailwind CSS', 'Django/ASP.NET', 'MySQL', 'Node.js'];

// Utility functions
export const getRoomById = (roomId: string): Room | undefined => {
  return allRooms.find(room => room.id === roomId);
};

export const getBookingsByRoom = (roomId: string, date?: string): Booking[] => {
  let filteredBookings = mockBookings.filter(booking => booking.roomId === roomId);
  if (date) {
    filteredBookings = filteredBookings.filter(booking => booking.date === date);
  }
  return filteredBookings;
};

export const getRoomStatus = (roomId: string, date: string): 'available' | 'booked' | 'pending' => {
  const roomBookings = getBookingsByRoom(roomId, date);
  if (roomBookings.length === 0) return 'available';
  if (roomBookings.some(booking => booking.status === 'pending')) return 'pending';
  return 'booked';
};

export const getAvailableTimeSlots = (): string[] => {
  return [
    '08:00-09:00',
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-13:00',
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
    '17:00-18:00'
  ];
};

export const getRoomTypes = (): string[] => {
  const types = new Set(allRooms.map(room => room.type));
  return Array.from(types);
};

export const getRoomsByType = (type: string): Room[] => {
  return allRooms.filter(room => room.type === type);
};

export const getRoomsByBlock = (block: string): Room[] => {
  return roomsData[`${block}-Block`] || [];
};
