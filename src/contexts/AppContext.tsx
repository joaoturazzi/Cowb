
import React from 'react';
import { TimerProvider } from './TimerContext';
import { TaskProvider } from './task/TaskContext';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { HabitProvider } from './habit/HabitContext';
import { ChallengeProvider } from './challenge/ChallengeContext';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <HabitProvider>
            <TimerProvider>
              <ChallengeProvider>
                {children}
              </ChallengeProvider>
            </TimerProvider>
          </HabitProvider>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
