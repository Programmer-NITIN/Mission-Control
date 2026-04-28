export interface Report {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'food' | 'disaster' | 'shelter' | 'logistics' | 'education';
  severity: number;
  urgency: number;
  peopleAffected: number;
  location: { lat: number; lng: number; address: string };
  status: 'pending' | 'processed' | 'assigned' | 'resolved';
  imageUrl?: string;
  createdAt: string;
  createdBy: string;
}

export interface Task {
  id: string;
  reportId: string;
  title: string;
  description: string;
  category: string;
  priority: number;
  severity: number;
  urgency: number;
  peopleAffected: number;
  location: { lat: number; lng: number; address: string };
  requiredSkills: string[];
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  assignedVolunteer?: string;
  createdAt: string;
  payload?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  availability: 'available' | 'busy' | 'offline';
  location: { lat: number; lng: number };
  rating: number;
  reviewCount: number;
  completedTasks: number;
  vehicle?: string;
  verified: boolean;
  avatar: string;
}

export interface Assignment {
  id: string;
  taskId: string;
  volunteerId: string;
  matchScore: number;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed';
  assignedAt: string;
}

export const mockVolunteers: Volunteer[] = [
  { id: 'v-8842', name: 'Sarah Chen', email: 'sarah@ngo.org', role: 'Logistics Specialist', skills: ['Driving (Heavy)', 'First Aid Basic', 'Supply Chain'], availability: 'available', location: { lat: 10.015, lng: 76.345 }, rating: 4.9, reviewCount: 124, completedTasks: 87, vehicle: '4x4 Utility Truck', verified: true, avatar: '/avatars/sarah.jpg' },
  { id: 'v-7721', name: 'David Okeke', email: 'david@vol.org', role: 'General Volunteer', skills: ['Driving', 'Crowd Management'], availability: 'available', location: { lat: 10.022, lng: 76.356 }, rating: 4.6, reviewCount: 56, completedTasks: 34, verified: true, avatar: '/avatars/david.jpg' },
  { id: 'v-9915', name: 'Elena Rios', email: 'elena@med.org', role: 'Medical Student', skills: ['First Aid (Advanced)', 'Triage', 'Translation (Spanish)'], availability: 'available', location: { lat: 10.031, lng: 76.362 }, rating: 4.8, reviewCount: 42, completedTasks: 28, verified: true, avatar: '/avatars/elena.jpg' },
  { id: 'v-4401', name: 'Raj Patel', email: 'raj@tech.org', role: 'Tech Coordinator', skills: ['Communication Systems', 'Data Entry', 'GPS Navigation'], availability: 'available', location: { lat: 9.985, lng: 76.298 }, rating: 4.7, reviewCount: 89, completedTasks: 65, vehicle: 'Motorcycle', verified: true, avatar: '/avatars/raj.jpg' },
  { id: 'v-5523', name: 'Amara Diallo', email: 'amara@relief.org', role: 'Relief Worker', skills: ['Shelter Setup', 'Water Purification', 'First Aid Basic'], availability: 'busy', location: { lat: 10.045, lng: 76.312 }, rating: 4.5, reviewCount: 67, completedTasks: 45, verified: true, avatar: '/avatars/amara.jpg' },
  { id: 'v-6634', name: 'Kenji Tanaka', email: 'kenji@ngo.org', role: 'Search & Rescue', skills: ['Swimming', 'First Aid (Advanced)', 'Boat Operation'], availability: 'available', location: { lat: 9.992, lng: 76.334 }, rating: 4.9, reviewCount: 112, completedTasks: 91, vehicle: 'Rescue Boat', verified: true, avatar: '/avatars/kenji.jpg' },
  { id: 'v-7745', name: 'Priya Sharma', email: 'priya@health.org', role: 'Nurse', skills: ['Medical Care', 'Triage', 'Pediatrics'], availability: 'available', location: { lat: 10.008, lng: 76.341 }, rating: 4.8, reviewCount: 98, completedTasks: 72, verified: true, avatar: '/avatars/priya.jpg' },
  { id: 'v-8856', name: 'Carlos Mendez', email: 'carlos@build.org', role: 'Construction Lead', skills: ['Construction', 'Heavy Machinery', 'Electrical'], availability: 'available', location: { lat: 10.055, lng: 76.389 }, rating: 4.4, reviewCount: 34, completedTasks: 22, vehicle: 'Pickup Truck', verified: false, avatar: '/avatars/carlos.jpg' },
];

export const mockTasks: Task[] = [
  { id: 'INC-8901', reportId: 'r-001', title: 'Flash Flood Response - Kerala', description: 'Emergency response needed for flash flooding in Ernakulam district. Multiple villages submerged, residents stranded on rooftops.', category: 'disaster', priority: 9.2, severity: 9, urgency: 10, peopleAffected: 450, location: { lat: 10.015, lng: 76.345, address: 'Ernakulam District, Kerala' }, requiredSkills: ['Swimming', 'Boat Operation', 'First Aid'], status: 'pending', createdAt: '2026-04-28T03:14:00Z' },
  { id: 'INC-8902', reportId: 'r-002', title: 'Medical Supply Drop - Port-au-Prince', description: 'Critical shortage of trauma kits and antibiotics at Central Hospital. Immediate logistics support required for 250kg supply delivery.', category: 'health', priority: 7.8, severity: 7, urgency: 8, peopleAffected: 120, location: { lat: 18.541, lng: -72.336, address: 'Central Hospital, Port-au-Prince' }, requiredSkills: ['Driving (Heavy)', 'First Aid Basic'], status: 'pending', createdAt: '2026-04-28T00:14:00Z', payload: '250kg - Trauma Kits & Antibiotics' },
  { id: 'INC-8903', reportId: 'r-003', title: 'Shelter Setup - Regional Hub B', description: 'Temporary shelter construction needed for displaced families in Regional Hub B. Target capacity of 200 people.', category: 'shelter', priority: 5.2, severity: 4, urgency: 5, peopleAffected: 200, location: { lat: 10.045, lng: 76.312, address: 'Regional Hub B, Thrissur' }, requiredSkills: ['Construction', 'Shelter Setup'], status: 'pending', createdAt: '2026-04-27T05:14:00Z' },
  { id: 'INC-8904', reportId: 'r-004', title: 'Food Distribution - Chennai Suburbs', description: 'Organized food packet distribution required for 300 families affected by cyclone damage.', category: 'food', priority: 6.5, severity: 6, urgency: 7, peopleAffected: 300, location: { lat: 13.067, lng: 80.237, address: 'Tambaram, Chennai' }, requiredSkills: ['Crowd Management', 'Driving'], status: 'assigned', assignedVolunteer: 'v-7721', createdAt: '2026-04-27T12:00:00Z' },
  { id: 'INC-8992', reportId: 'r-005', title: 'Relief Distribution - Zone 4', description: 'Distribute relief packages to Zone 4 affected area. 5 volunteers needed for on-ground coordination.', category: 'logistics', priority: 8.1, severity: 8, urgency: 9, peopleAffected: 350, location: { lat: 10.025, lng: 76.330, address: 'Zone 4, Aluva' }, requiredSkills: ['Supply Chain', 'Driving', 'First Aid'], status: 'pending', createdAt: '2026-04-28T01:30:00Z' },
];

export const mockReports: Report[] = [
  { id: 'r-001', title: 'Flash Flood in Ernakulam', description: 'Severe flooding after heavy rains. Multiple areas submerged.', category: 'disaster', severity: 9, urgency: 10, peopleAffected: 450, location: { lat: 10.015, lng: 76.345, address: 'Ernakulam, Kerala' }, status: 'processed', createdAt: '2026-04-28T03:10:00Z', createdBy: 'admin@ngo.org' },
  { id: 'r-002', title: 'Medical Supply Shortage', description: 'Critical shortage at hospital.', category: 'health', severity: 7, urgency: 8, peopleAffected: 120, location: { lat: 18.541, lng: -72.336, address: 'Port-au-Prince, Haiti' }, status: 'processed', createdAt: '2026-04-28T00:10:00Z', createdBy: 'field@ngo.org' },
  { id: 'r-003', title: 'Families need shelter', description: 'Displaced families in Thrissur area.', category: 'shelter', severity: 4, urgency: 5, peopleAffected: 200, location: { lat: 10.045, lng: 76.312, address: 'Thrissur, Kerala' }, status: 'processed', createdAt: '2026-04-27T05:10:00Z', createdBy: 'admin@ngo.org' },
];

export const mockAssignments: Assignment[] = [
  { id: 'a-001', taskId: 'INC-8904', volunteerId: 'v-7721', matchScore: 88, status: 'accepted', assignedAt: '2026-04-27T13:00:00Z' },
];

export const dashboardStats = {
  activeNeeds: 124,
  volunteersOnline: 342,
  tasksResolved: 89,
};
