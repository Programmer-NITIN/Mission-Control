import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/backend/config/firebase';
import { Report, Task, Volunteer, Assignment, mockReports, mockTasks, mockVolunteers, mockAssignments } from '@/backend/data/mock-data';

// ─── Collection names ─────────────────────────────────────
const REPORTS = 'reports';
const TASKS = 'tasks';
const VOLUNTEERS = 'volunteers';
const ASSIGNMENTS = 'assignments';

// ─── Reports ──────────────────────────────────────────────
export async function getReports(): Promise<Report[]> {
  if (!db) return mockReports;
  const snap = await getDocs(query(collection(db, REPORTS), orderBy('createdAt', 'desc'), limit(50)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Report));
}

export async function addReportToFirestore(report: Omit<Report, 'id'>): Promise<string> {
  if (!db) return `r-${Date.now()}`;
  const docRef = await addDoc(collection(db, REPORTS), { ...report, createdAt: serverTimestamp() });
  return docRef.id;
}

export function subscribeReports(callback: (reports: Report[]) => void): Unsubscribe {
  if (!db) {
    callback(mockReports);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, REPORTS), orderBy('createdAt', 'desc'), limit(50)),
    (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Report)))
  );
}

// ─── Tasks ────────────────────────────────────────────────
export async function getTasks(): Promise<Task[]> {
  if (!db) return mockTasks;
  const snap = await getDocs(query(collection(db, TASKS), orderBy('priority', 'desc'), limit(50)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Task));
}

export async function addTaskToFirestore(task: Omit<Task, 'id'>): Promise<string> {
  if (!db) return `INC-${Date.now().toString().slice(-4)}`;
  const docRef = await addDoc(collection(db, TASKS), { ...task, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function updateTaskInFirestore(taskId: string, data: Partial<Task>): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, TASKS, taskId), data);
}

export function subscribeTasks(callback: (tasks: Task[]) => void): Unsubscribe {
  if (!db) {
    callback(mockTasks);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, TASKS), orderBy('priority', 'desc'), limit(50)),
    (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Task)))
  );
}

// ─── Volunteers ───────────────────────────────────────────
export async function getVolunteers(): Promise<Volunteer[]> {
  if (!db) return mockVolunteers;
  const snap = await getDocs(query(collection(db, VOLUNTEERS), limit(100)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Volunteer));
}

export async function addVolunteerToFirestore(volunteer: Omit<Volunteer, 'id'>): Promise<string> {
  if (!db) return `v-${Date.now().toString().slice(-4)}`;
  const docRef = await addDoc(collection(db, VOLUNTEERS), volunteer);
  return docRef.id;
}

export function subscribeVolunteers(callback: (volunteers: Volunteer[]) => void): Unsubscribe {
  if (!db) {
    callback(mockVolunteers);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, VOLUNTEERS), limit(100)),
    (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Volunteer)))
  );
}

// ─── Assignments ──────────────────────────────────────────
export async function getAssignments(): Promise<Assignment[]> {
  if (!db) return mockAssignments;
  const snap = await getDocs(query(collection(db, ASSIGNMENTS), orderBy('assignedAt', 'desc'), limit(50)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Assignment));
}

export async function addAssignmentToFirestore(assignment: Omit<Assignment, 'id'>): Promise<string> {
  if (!db) return `a-${Date.now()}`;
  const docRef = await addDoc(collection(db, ASSIGNMENTS), { ...assignment, assignedAt: serverTimestamp() });
  return docRef.id;
}

export function subscribeAssignments(callback: (assignments: Assignment[]) => void): Unsubscribe {
  if (!db) {
    callback(mockAssignments);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, ASSIGNMENTS), orderBy('assignedAt', 'desc'), limit(50)),
    (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Assignment)))
  );
}

// ─── Dashboard Aggregation ────────────────────────────────
export async function getDashboardStats() {
  if (!db) return { activeNeeds: 124, volunteersOnline: 342, tasksResolved: 89 };

  const [taskSnap, volSnap] = await Promise.all([
    getDocs(collection(db, TASKS)),
    getDocs(query(collection(db, VOLUNTEERS), where('availability', '==', 'available'))),
  ]);

  const tasks = taskSnap.docs.map(d => d.data() as Task);
  return {
    activeNeeds: tasks.filter(t => t.status === 'pending').length,
    volunteersOnline: volSnap.size,
    tasksResolved: tasks.filter(t => t.status === 'completed').length,
  };
}
