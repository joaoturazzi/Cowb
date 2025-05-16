
// Export all context hooks for easy imports
export { useAuth } from './AuthContext';
export { useTask } from './task/TaskContext';
export { useTimer } from './TimerContext';
export { useTheme } from './ThemeContext';

// Re-export providers and types
export { AuthProvider } from './AuthContext';
export { TaskProvider } from './task/TaskContext';
export { TimerProvider } from './TimerContext';
export { ThemeProvider } from './ThemeContext';
export { AppProvider } from './AppContext';

// Re-export types properly
export type { Task, Priority, DailySummary } from './task/taskTypes';
export type { TimerState, TimerSettings } from './TimerContext';

// Export analytics services
export * from './analytics/analyticsService';
