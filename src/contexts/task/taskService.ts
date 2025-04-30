
// Re-export all task services from their respective files
export { transformTaskData } from './utils/transformUtils';
export { fetchTasks } from './services/taskFetchService';
export type { TaskFetchResult } from './services/taskFetchService';
export { 
  addTask,
  updateTask,
  toggleTaskCompletion,
  clearCompletedTasks,
  removeTask
} from './services/taskCrudService';
