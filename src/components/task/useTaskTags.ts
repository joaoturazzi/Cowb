
import { useState, useEffect } from 'react';
import { Tag } from '@/contexts/task/types/tagTypes';
import { getTaskTags } from '@/contexts/task/services/tagService';

export const useTaskTags = (taskId: string) => {
  const [taskTags, setTaskTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoadingTags(true);
        const tags = await getTaskTags(taskId);
        setTaskTags(tags);
      } catch (error) {
        console.error('Erro ao buscar tags da tarefa:', error);
      } finally {
        setIsLoadingTags(false);
      }
    };
    
    fetchTags();
  }, [taskId]);

  return { taskTags, isLoadingTags };
};
