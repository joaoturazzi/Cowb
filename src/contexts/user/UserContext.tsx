import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth';
import { fetchUserProfile, updateUserProfile } from '../userProfileService';

// Define the context type
type UserContextType = {
  profile: any | null;
  isLoading: boolean;
  error: Error | null;
  updateProfile: (data: any) => Promise<void>;
};

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the provider
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
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

  const updateProfile = async (data: any) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error("User not authenticated");
      await updateUserProfile(user.id, data);
      setProfile(data); // Optimistically update the profile
    } catch (err: any) {
      setError(err);
      console.error("Failed to update user profile:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: UserContextType = {
    profile,
    isLoading,
    error,
    updateProfile,
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
