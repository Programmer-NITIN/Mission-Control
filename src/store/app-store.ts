import { create } from 'zustand';
import { Task, Volunteer, Report, Assignment, mockTasks, mockVolunteers, mockReports, mockAssignments } from '@/lib/mock-data';
import { addAssignmentToFirestore, addReportToFirestore, addTaskToFirestore, updateTaskInFirestore, addVolunteerToFirestore } from '@/lib/firestore';

type ViewType = 'landing' | 'dashboard' | 'map' | 'reports' | 'volunteers' | 'assignments';

interface AppState {
  // Navigation
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;

  // Data
  tasks: Task[];
  volunteers: Volunteer[];
  reports: Report[];
  assignments: Assignment[];

  // Data setters (for Firestore sync)
  setTasks: (tasks: Task[]) => void;
  setVolunteers: (volunteers: Volunteer[]) => void;
  setReports: (reports: Report[]) => void;
  setAssignments: (assignments: Assignment[]) => void;

  // Selections
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;

  // Actions (now with Firestore integration)
  addReport: (report: Report) => void;
  addTask: (task: Task) => void;
  addVolunteer: (volunteer: Volunteer) => void;
  assignVolunteer: (taskId: string, volunteerId: string, matchScore: number) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;

  // Filters
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeView: 'dashboard',
  setActiveView: (view) => set({ activeView: view }),

  tasks: mockTasks,
  volunteers: mockVolunteers,
  reports: mockReports,
  assignments: mockAssignments,

  setTasks: (tasks) => set({ tasks }),
  setVolunteers: (volunteers) => set({ volunteers }),
  setReports: (reports) => set({ reports }),
  setAssignments: (assignments) => set({ assignments }),

  selectedTask: null,
  setSelectedTask: (task) => set({ selectedTask: task }),

  addReport: (report) => {
    set((state) => ({ reports: [report, ...state.reports] }));
    // Fire-and-forget Firestore write
    const { id, ...rest } = report;
    addReportToFirestore(rest).catch(console.error);
  },

  addVolunteer: (volunteer) => {
    set((state) => ({ volunteers: [volunteer, ...state.volunteers] }));
    const { id, ...rest } = volunteer;
    addVolunteerToFirestore(rest).catch(console.error);
  },

  addTask: (task) => {
    set((state) => ({ tasks: [task, ...state.tasks] }));
    const { id, ...rest } = task;
    addTaskToFirestore(rest).catch(console.error);
  },

  assignVolunteer: (taskId, volunteerId, matchScore) => {
    set((state) => ({
      assignments: [
        ...state.assignments,
        {
          id: `a-${Date.now()}`,
          taskId,
          volunteerId,
          matchScore,
          status: 'pending' as const,
          assignedAt: new Date().toISOString(),
        },
      ],
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'assigned' as const, assignedVolunteer: volunteerId } : t
      ),
    }));

    // Firestore writes
    addAssignmentToFirestore({
      taskId,
      volunteerId,
      matchScore,
      status: 'pending',
      assignedAt: new Date().toISOString(),
    }).catch(console.error);

    updateTaskInFirestore(taskId, {
      status: 'assigned',
      assignedVolunteer: volunteerId,
    }).catch(console.error);
  },

  updateTaskStatus: (taskId, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    }));
    updateTaskInFirestore(taskId, { status }).catch(console.error);
  },

  categoryFilter: 'all',
  setCategoryFilter: (cat) => set({ categoryFilter: cat }),
  statusFilter: 'all',
  setStatusFilter: (status) => set({ statusFilter: status }),
}));
