import { supabase } from '../../integrations/supabase/client';
import { Task, Priority } from './taskTypes';
import { User } from '@supabase/supabase-js';

// Transform Supabase task data to our Task interface
export const transformTaskData = (task: any): Task => ({
  id: task.id,
  name: task.name,
  estimatedTime: task.estimated_time,
  priority: task.priority as Priority,
  completed: task.completed,
  createdAt: task.created_at,
  target_date: task.target_date
});

// Define a consistent return type for fetchTasks
export interface TaskFetchResult {
  tasks: Task[];
  movedTasksCount: number;
}

// Fetch tasks for today or move uncompleted tasks from previous days
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
    
    // Fetch all tasks for today
    const { data: taskData, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('target_date', today)
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

// Add a new task
export const addTask = async (
  user: User | null, 
  task: Omit<Task, 'id' | 'createdAt' | 'completed'>
) => {
  if (!user) {
    throw new Error("You must be authenticated to add tasks");
  }
  
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        name: task.name,
        estimated_time: task.estimatedTime,
        priority: task.priority,
        target_date: today,
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

// Update an existing task
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

// Toggle task completion status
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

// Clear completed tasks
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

// Remove a specific task
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
