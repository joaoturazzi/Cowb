
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../AuthContext';
import { UserProfile, getProfile, updateProfilePoints } from '../userProfileService';
import { toast } from 'sonner';

type UserContextType = {
  userProfile: UserProfile | null;
  isLoading: boolean;
  addPoints: (points: number) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    setIsLoading(true);
    try {
      const profile = await getProfile(userId);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
    } else {
      setUserProfile(null);
      setIsLoading(false);
    }
  }, [user]);

  const addPoints = async (points: number) => {
    if (!user?.id || !userProfile) return;
    
    try {
      const newTotalPoints = (userProfile.total_points || 0) + points;
      const success = await updateProfilePoints(user.id, newTotalPoints);
      
      if (success) {
        // Update local state
        setUserProfile(prev => {
          if (!prev) return null;
          
          // Calculate new level
          const newLevel = Math.floor(newTotalPoints / 100) + 1;
          const leveledUp = newLevel > (prev.level || 1);
          
          if (leveledUp) {
            toast.success(`Level up! You're now level ${newLevel}! 🎉`);
          }
          
          if (points > 0) {
            toast.success(`+${points} points earned!`, {
              description: `Total: ${newTotalPoints} points`
            });
          }
          
          return {
            ...prev,
            total_points: newTotalPoints,
            level: newLevel
          };
        });
      }
    } catch (error) {
      console.error('Error updating points:', error);
      toast.error('Failed to update points');
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  return (
    <UserContext.Provider value={{ userProfile, isLoading, addPoints, refreshProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
