
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  username?: string;
  avatar_url?: string;
  display_name?: string;
  level?: number;
  total_points?: number;
}

/**
 * Fetch user profile data
 * @param userId The user ID
 */
export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception fetching profile:', error);
    return null;
  }
};

/**
 * Update user profile points
 * @param userId The user ID
 * @param points New points total
 */
export const updateProfilePoints = async (userId: string, points: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        total_points: points,
        // Calculate level based on points (simplified formula)
        level: Math.floor(points / 100) + 1
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile points:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception updating profile points:', error);
    return false;
  }
};

/**
 * Update user profile information
 * @param userId The user ID
 * @param profile Updated profile data
 */
export const updateProfile = async (userId: string, profile: Partial<UserProfile>): Promise<boolean> => {
  try {
    // Don't allow updating ID
    const { id, ...updateData } = profile;
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }

    toast.success('Profile updated successfully');
    return true;
  } catch (error) {
    console.error('Exception updating profile:', error);
    toast.error('Failed to update profile');
    return false;
  }
};
