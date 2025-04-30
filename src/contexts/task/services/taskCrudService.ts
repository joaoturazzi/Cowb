
import { supabase } from '../../../integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Task, Priority } from '../taskTypes';
import { transformTaskData } from '../utils/transformUtils';

/**
 * Add a new task
 */
export const addTask = async (
  user: User | null, 
  task: Omit<Task, 'id' | 'createdAt' | 'completed'>
) => {
  if (!user) {
    throw new Error("You must be authenticated to add tasks");
  }
  
  try {
    const target_date = task.target_date || new Date().toISOString().split('T')[0]; // Use provided date or today
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        name: task.name,
        estimated_time: task.estimatedTime,
        priority: task.priority,
        target_date: target_date,
        user_id: user.id
      })
      .select('*')
      .single();
    
    if (error) throw error;
    
    return transformTaskData(data);
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (
  taskId: string,
  updates: {
    name?: string;
    estimatedTime?: number;
    priority?: Priority;
  }
) => {
  try {
    // Convert from our interface naming to database column naming
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.estimatedTime) dbUpdates.estimated_time = updates.estimatedTime;
    if (updates.priority) dbUpdates.priority = updates.priority;
    
    const { data, error } = await supabase
      .from('tasks')
      .update(dbUpdates)
      .eq('id', taskId)
      .select('*')
      .single();
    
    if (error) throw error;
    
    return transformTaskData(data);
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

/**
 * Toggle task completion status
 */
export const toggleTaskCompletion = async (id: string, isCompleted: boolean) => {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !isCompleted })
      .eq('id', id);
    
    if (error) throw error;
    
    return !isCompleted;
  } catch (error) {
    console.error('Error toggling task completion:', error);
    throw error;
  }
};

/**
 * Clear completed tasks
 */
export const clearCompletedTasks = async (completedTaskIds: string[]) => {
  try {
    if (completedTaskIds.length === 0) return false;
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .in('id', completedTaskIds);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error clearing completed tasks:', error);
    throw error;
  }
};

/**
 * Remove a specific task
 */
export const removeTask = async (id: string) => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error removing task:', error);
    throw error;
  }
};
