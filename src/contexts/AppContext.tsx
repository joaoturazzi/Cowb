
import React, { Suspense } from 'react';
import { AuthProvider } from './auth';
import { ThemeProvider } from './ThemeContext';
import { UserProvider } from './user/UserContext';
import { TaskProvider } from './task/TaskContext';
import { TimerProvider } from './TimerContext';
import { HabitProvider } from './habit/HabitContext';
import ErrorBoundary from '../components/ErrorBoundary';

// Simplified loading fallback component
const ContextLoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// This is a combined provider that wraps all our context providers
// Reordered providers to fix circular dependency issues:
// 1. ThemeProvider (no dependencies)
// 2. AuthProvider (no context dependencies)
// 3. UserProvider (depends on AuthProvider)
// 4. TaskProvider (depends on AuthProvider & UserProvider)
// 5. TimerProvider (depends on TaskProvider)
// 6. HabitProvider (might depend on multiple contexts)
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <TaskProvider>
              <TimerProvider>
                <HabitProvider>
                  <Suspense fallback={<ContextLoadingFallback />}>
                    {children}
                  </Suspense>
                </HabitProvider>
              </TimerProvider>
            </TaskProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
