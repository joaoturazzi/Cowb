
import React from 'react';
import { AuthProvider } from './AuthContext';
import { TaskProvider } from './TaskContext';
import { TimerProvider } from './TimerContext';
import { ThemeProvider } from './ThemeContext';

// This is now a combined provider that wraps all our context providers
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TimerProvider>
          <TaskProvider>
            {children}
          </TaskProvider>
        </TimerProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

// Re-export all our hooks from the new contexts
export {
  useAuth,
  useTask,
  useTimer,
  useTheme,
  Task,
  Priority,
  TimerState,
  TimerSettings
} from './index';
