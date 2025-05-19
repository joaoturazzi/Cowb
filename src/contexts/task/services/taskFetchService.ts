import { supabase } from '../../../integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { transformTaskData } from '../utils/transformUtils';
import { Task } from '../taskTypes';
import { format, addDays } from '@/utils/dateUtils';

/**
 * Define a consistent return type for fetchTasks
 */
export interface TaskFetchResult {
  tasks: Task[];
  movedTasksCount: number;
}

/**
 * Fetch tasks for today and upcoming days, moving uncompleted tasks from previous days
 */
export const fetchTasks = async (user: User | null): Promise<TaskFetchResult> => {
  if (!user) return { tasks: [], movedTasksCount: 0 };
  
  try {
    // Get today's date in YYYY-MM-DD format
    const today = format(new Date(), 'yyyy-MM-dd');
    let movedTasksCount = 0;
    
    // Step 1: Find and move uncompleted tasks from previous days
    await moveUncompletedTasks(user.id, today).then(count => {
      movedTasksCount = count;
    });
    
    // Step 2: Fetch all tasks for today and the next 4 days
    const endDate = format(addDays(new Date(), 4), 'yyyy-MM-dd');
    
    const { data: taskData, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .gte('target_date', today)
      .lte('target_date', endDate)
      .order('priority', { ascending: false }) // Sort high priority first in DB query
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    // Transform data to match our Task interface
    const transformedTasks = taskData.map(transformTaskData);
    
    return { 
      tasks: transformedTasks,
      movedTasksCount
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    // Instead of throwing, return empty result with error logged
    return { tasks: [], movedTasksCount: 0 };
  }
};

/**
 * Helper function to move uncompleted tasks from previous days to today
 * Returns the number of moved tasks
 */
async function moveUncompletedTasks(userId: string, today: string): Promise<number> {
  try {
    // Find uncompleted tasks from previous days
    const { data: oldTasks, error: oldTasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('completed', false)
      .eq('user_id', userId)
      .lt('target_date', today);
    
    if (oldTasksError) throw oldTasksError;
    
    // If no old tasks, return early
    if (!oldTasks || oldTasks.length === 0) {
      return 0;
    }
    
    // Create an array of objects with update info
    const updates = oldTasks.map(task => ({
      id: task.id,
      target_date: today,
      // Include all required fields when updating
      name: task.name,
      estimated_time: task.estimated_time,
      priority: task.priority,
      user_id: task.user_id,
      completed: task.completed,
      // Original creation date is kept
      created_at: task.created_at
    }));
    
    // Update those tasks to today's date with a single bulk operation
    const { error: updateError } = await supabase
      .from('tasks')
      .upsert(updates);
    
    if (updateError) throw updateError;
    
    // Return the count of moved tasks
    return oldTasks.length;
  } catch (error) {
    console.error('Error moving tasks:', error);
    return 0; // Return 0 on error to avoid breaking the main function
  }
}
