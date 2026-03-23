import { create } from 'zustand';
import { Task } from '../types';
import { generateTasks } from '../data/generateData';

interface FilterState {
  status: string[];
  priority: string[];
  assignee: string[];
  fromDate: string;
  toDate: string;
}

interface CollaborationUser {
  id: string;
  name: string;
  color: string;
  currentTaskId: string | null;
}

interface StoreState {
  tasks: Task[];
  view: 'kanban' | 'list' | 'timeline';
  filters: FilterState;
  sortField: 'title' | 'priority' | 'dueDate' | null;
  sortDirection: 'asc' | 'desc';
  collaborationUsers: CollaborationUser[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  setView: (view: 'kanban' | 'list' | 'timeline') => void;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  setSort: (field: 'title' | 'priority' | 'dueDate') => void;
  updateCollaborationUser: (userId: string, currentTaskId: string | null) => void;
}

const initialTasks = generateTasks(500);

const getPriorityOrder = (priority: string): number => {
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return order[priority as keyof typeof order] || 4;
};

export const useStore = create<StoreState>((set, get) => ({
  tasks: initialTasks,
  view: 'kanban',
  filters: {
    status: [],
    priority: [],
    assignee: [],
    fromDate: '',
    toDate: '',
  },
  sortField: null,
  sortDirection: 'asc',
  collaborationUsers: [
    { id: 'user1', name: 'Priya', color: 'bg-pink-500', currentTaskId: null },
    { id: 'user2', name: 'Raj', color: 'bg-blue-500', currentTaskId: null },
    { id: 'user3', name: 'Amit', color: 'bg-green-500', currentTaskId: null },
    { id: 'user4', name: 'Neha', color: 'bg-purple-500', currentTaskId: null },
  ],

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),

  setView: (view) => set({ view }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  clearFilters: () =>
    set({
      filters: {
        status: [],
        priority: [],
        assignee: [],
        fromDate: '',
        toDate: '',
      },
    }),

  setSort: (field) =>
    set((state) => ({
      sortField: field,
      sortDirection: state.sortField === field && state.sortDirection === 'asc' ? 'desc' : 'asc',
    })),

  updateCollaborationUser: (userId, currentTaskId) =>
    set((state) => ({
      collaborationUsers: state.collaborationUsers.map((user) =>
        user.id === userId ? { ...user, currentTaskId } : user
      ),
    })),
}));

export const getFilteredTasks = (state: StoreState): Task[] => {
  let filtered = [...state.tasks];

  if (state.filters.status.length > 0) {
    filtered = filtered.filter((task) => state.filters.status.includes(task.status));
  }

  if (state.filters.priority.length > 0) {
    filtered = filtered.filter((task) => state.filters.priority.includes(task.priority));
  }

  if (state.filters.assignee.length > 0) {
    filtered = filtered.filter((task) => state.filters.assignee.includes(task.assignee));
  }

  if (state.filters.fromDate) {
    filtered = filtered.filter((task) => task.dueDate >= state.filters.fromDate);
  }

  if (state.filters.toDate) {
    filtered = filtered.filter((task) => task.dueDate <= state.filters.toDate);
  }

  if (state.sortField) {
    filtered.sort((a, b) => {
      let comparison = 0;
      if (state.sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (state.sortField === 'priority') {
        comparison = getPriorityOrder(a.priority) - getPriorityOrder(b.priority);
      } else if (state.sortField === 'dueDate') {
        comparison = a.dueDate.localeCompare(b.dueDate);
      }
      return state.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  return filtered;
};