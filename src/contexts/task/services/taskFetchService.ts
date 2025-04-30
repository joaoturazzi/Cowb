
import { supabase } from '../../../integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { transformTaskData } from '../utils/transformUtils';
import { Task } from '../taskTypes';

/**
 * Define a consistent return type for fetchTasks
 */
export interface TaskFetchResult {
  tasks: Task[];
  movedTasksCount: number;
}

/**
 * Fetch tasks for today or move uncompleted tasks from previous days
 */
export const fetchTasks = async (user: User | null): Promise<TaskFetchResult> => {
  if (!user) return { tasks: [], movedTasksCount: 0 };
  
  try {
    // Check for uncompleted tasks from previous days and move them to today
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Find uncompleted tasks from previous days
    const { data: oldTasks, error: oldTasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('completed', false)
      .eq('user_id', user.id)
      .lt('target_date', today);
    
    if (oldTasksError) throw oldTasksError;
    
    // Update those tasks to today's date
    if (oldTasks && oldTasks.length > 0) {
      // Create an array of objects with update info
      const updates = oldTasks.map(task => ({
        id: task.id,
        target_date: today,
        // We need to include all required fields when updating
        name: task.name,
        estimated_time: task.estimated_time,
        priority: task.priority,
        user_id: task.user_id,
        completed: task.completed,
        // Original creation date is kept
        created_at: task.created_at
      }));
      
      const { error: updateError } = await supabase
        .from('tasks')
        .upsert(updates);
      
      if (updateError) throw updateError;
      
      return { 
        tasks: [], 
        movedTasksCount: oldTasks.length 
      };
    }
    
    // Fetch all tasks for today and the next 4 days
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 4);
    const endDateString = endDate.toISOString().split('T')[0];
    
    const { data: taskData, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .gte('target_date', today)
      .lte('target_date', endDateString)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    // Transform data to match our Task interface
    const transformedTasks = taskData.map(transformTaskData);
    
    return { 
      tasks: transformedTasks,
      movedTasksCount: oldTasks ? oldTasks.length : 0
    };
    
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};
