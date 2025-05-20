
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth';

// Define the user profile type
export type UserProfile = {
  id: string;
  username?: string;
  display_name?: string;
  email?: string;
  avatar_url?: string;
  level?: number;
  total_points?: number;
  created_at?: string;
  updated_at?: string;
};

// Define the context type
export type UserContextType = {
  profile: UserProfile | null;
  userProfile: UserProfile | null; // Added for backward compatibility
  isLoading: boolean;
  error: Error | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  addPoints: (points: number) => Promise<void>;
};

// Create the mock or simplified service methods
const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  // This would normally fetch from Supabase or another backend
  // For now, return a mock profile
  return {
    id: userId,
    username: 'user',
    display_name: 'Demo User',
    level: 1,
    total_points: 0
  };
};

const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
  // This would normally update the profile in Supabase
  // For now, just return the merged data
  return {
    id: userId,
    ...data
  };
};

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the provider
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (isAuthenticated && user) {
        setIsLoading(true);
        try {
          const userProfile = await fetchUserProfile(user.id);
          setProfile(userProfile);
        } catch (err: any) {
          setError(err);
          console.error("Failed to load user profile:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setProfile(null);
      }
    };

    loadProfile();
  }, [user, isAuthenticated]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error("User not authenticated");
      const updatedProfile = await updateUserProfile(user.id, data);
      setProfile(prev => prev ? {...prev, ...updatedProfile} : updatedProfile);
    } catch (err: any) {
      setError(err);
      console.error("Failed to update user profile:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addPoints = async (points: number) => {
    if (!profile) return;
    
    const currentPoints = profile.total_points || 0;
    const newPoints = currentPoints + points;
    
    // Calculate level based on points (100 points per level)
    const currentLevel = profile.level || 1;
    const newLevel = Math.floor(newPoints / 100) + 1;
    
    // Only update if points changed
    if (points !== 0) {
      await updateProfile({
        total_points: newPoints,
        level: newLevel > currentLevel ? newLevel : currentLevel
      });
    }
  };

  const value: UserContextType = {
    profile,
    userProfile: profile, // Added for backward compatibility
    isLoading,
    error,
    updateProfile,
    addPoints
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Create the hook
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
