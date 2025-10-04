import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSession, UserPreferences, DashboardStats } from '../types';

interface AppState {
  // Chat
  currentSession: ChatSession | null;
  sessions: ChatSession[];

  // Dashboard
  dashboardStats: DashboardStats | null;

  // Preferences
  preferences: UserPreferences;

  // UI State
  sidebarOpen: boolean;
  loading: boolean;

  // Actions
  setCurrentSession: (session: ChatSession | null) => void;
  addSession: (session: ChatSession) => void;
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  setDashboardStats: (stats: DashboardStats) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setSidebarOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentSession: null,
      sessions: [],
      dashboardStats: null,
      preferences: {
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          criticalFindings: true,
          reportComplete: true,
        },
        analysis: {
          defaultConfidenceThreshold: 0.8,
          autoAnnotations: true,
          preferredModels: ['medical-ai-v2'],
        },
        interface: {
          compactMode: false,
          showTutorials: true,
          defaultReportTemplate: 'comprehensive',
        },
      },
      sidebarOpen: true,
      loading: false,

      // Actions
      setCurrentSession: (session) =>
        set({ currentSession: session }),

      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions],
          currentSession: session
        })),

      updateSession: (sessionId, updates) =>
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId ? { ...session, ...updates } : session
          ),
          currentSession: state.currentSession?.id === sessionId
            ? { ...state.currentSession, ...updates }
            : state.currentSession
        })),

      setDashboardStats: (stats) =>
        set({ dashboardStats: stats }),

      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences }
        })),

      setSidebarOpen: (open) =>
        set({ sidebarOpen: open }),

      setLoading: (loading) =>
        set({ loading })
    }),
    {
      name: 'healthcare-chatbot-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        sessions: state.sessions,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);