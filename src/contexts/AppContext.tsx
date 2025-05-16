
import React from 'react';
import { AuthProvider } from './AuthContext';
import { TaskProvider } from './task/TaskContext';
import { TimerProvider } from './TimerContext';
import { ThemeProvider } from './ThemeContext';
import { Toaster } from '@/components/ui/toaster';

// This is a combined provider that wraps all our context providers
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TaskProvider>
          <TimerProvider>
            <>
              {children}
              <Toaster />
            </>
          </TimerProvider>
        </TaskProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
