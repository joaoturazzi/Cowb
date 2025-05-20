
import React, { useState, useEffect } from 'react';
import { useTasks, useAuth } from '@/contexts';
import { Task } from '@/contexts/task/taskTypes';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { fetchTags, createTag, getTaskTags, assignTagsToTask } from '@/contexts/task/services/tagService';
import { Tag } from '@/contexts/task/types/tagTypes';
import CreateTagDialog from '../../tag/CreateTagDialog';
import RecurrenceSelector from '../../task/recurrence';
import TaskEditForm, { TaskFormValues } from './TaskEditForm';
import TaskTagsSection from './TaskTagsSection';

interface EditTaskSheetProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const EditTaskSheet: React.FC<EditTaskSheetProps> = ({ task, isOpen, onClose }) => {
  const { updateTask } = useTasks();
  const { user } = useAuth();
  const [isTagLoading, setIsTagLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isShowingCreateTag, setIsShowingCreateTag] = useState(false);
  const [recurrenceOptions, setRecurrenceOptions] = useState({
    enabled: !!task.recurrence_type,
    type: task.recurrence_type as 'daily' | 'weekly' | 'monthly' || 'daily',
    interval: task.recurrence_interval || 1,
    endDate: task.recurrence_end_date ? new Date(task.recurrence_end_date) : null
  });
  
  const defaultValues: TaskFormValues = {
    name: task.name,
    estimatedTime: task.estimatedTime,
    priority: task.priority,
  };
  
  // Load available tags
  useEffect(() => {
    if (isOpen && user) {
      const loadTags = async () => {
        setIsTagLoading(true);
        try {
          // Fetch all tags
          const tags = await fetchTags(user.id);
          setAvailableTags(tags);
          
          // Fetch task tags
          const taskTags = await getTaskTags(task.id);
          setSelectedTags(taskTags);
        } catch (error) {
          console.error('Erro ao carregar tags:', error);
        } finally {
          setIsTagLoading(false);
        }
      };
      
      loadTags();
    }
  }, [isOpen, user, task.id]);
  
  const handleCreateTag = async (name: string, color: string) => {
    if (!user) return;
    
    try {
      const newTag = await createTag({
        name,
        color,
        user_id: user.id
      });
      
      setAvailableTags([...availableTags, newTag]);
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      throw error;
    }
  };

  const handleSubmit = async (values: TaskFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Create a base updates object with the form values
      const updates = {
        name: values.name,
        estimatedTime: values.estimatedTime,
        priority: values.priority,
      };
      
      // Add recurrence fields if enabled
      if (recurrenceOptions.enabled) {
        // Now we can update the task with all fields together
        await updateTask(task.id, {
          ...updates,
          recurrence_type: recurrenceOptions.type,
          recurrence_interval: recurrenceOptions.interval,
          recurrence_end_date: recurrenceOptions.endDate?.toISOString() || null
        });
      } else {
        // Just update with the base fields
        await updateTask(task.id, {
          ...updates,
          recurrence_type: null,
          recurrence_interval: null,
          recurrence_end_date: null
        });
      }
      
      // Save tags
      if (selectedTags.length > 0) {
        await assignTagsToTask(task.id, selectedTags.map(tag => tag.id));
      }
      
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Editar Tarefa</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-6 pt-6">
            <TaskEditForm 
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              onCancel={onClose}
              isSubmitting={isSubmitting}
            />
            
            <TaskTagsSection 
              isLoading={isTagLoading}
              selectedTags={selectedTags}
              availableTags={availableTags}
              onTagsChange={setSelectedTags}
              onCreateTagClick={() => setIsShowingCreateTag(true)}
            />
            
            <RecurrenceSelector 
              value={recurrenceOptions}
              onChange={setRecurrenceOptions}
            />
          </div>
        </SheetContent>
      </Sheet>
      
      <CreateTagDialog 
        isOpen={isShowingCreateTag}
        onClose={() => setIsShowingCreateTag(false)}
        onCreateTag={handleCreateTag}
      />
    </>
  );
};

export default EditTaskSheet;
