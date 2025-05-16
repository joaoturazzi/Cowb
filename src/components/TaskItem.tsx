
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Task } from '../contexts/task/taskTypes';
import { Clock, ArrowRight, Trash2, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import TaskCompletionMessage from './TaskCompletionMessage';
import { formatMinutes } from '../utils/timeUtils';
import { getTaskTags } from '../contexts/task/services/tagService';
import { Tag } from '../contexts/task/types/tagTypes';
import TagBadge from './tag/TagBadge';

interface TaskItemProps {
  task: Task;
  currentTask: Task | null;
  timerState: string;
  showCompletionMessage: string | null;
  completedTaskName: string;
  taskStreak: number;
  onCheckTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  currentTask,
  timerState,
  showCompletionMessage,
  completedTaskName,
  taskStreak,
  onCheckTask,
  onSelectTask,
  onEditTask,
  onDeleteTask
}) => {
  const [taskTags, setTaskTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  
  // Buscar tags da tarefa
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoadingTags(true);
        const tags = await getTaskTags(task.id);
        setTaskTags(tags);
      } catch (error) {
        console.error('Erro ao buscar tags da tarefa:', error);
      } finally {
        setIsLoadingTags(false);
      }
    };
    
    fetchTags();
  }, [task.id]);
  
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-tag priority-high';
      case 'medium': return 'priority-tag priority-medium';
      case 'low': return 'priority-tag priority-low';
      default: return 'priority-tag priority-low';
    }
  };

  // Get visual style for task card based on priority
  const getTaskCardClass = (task: Task) => {
    if (task.completed) return 'task-card task-completed';
    
    switch (task.priority) {
      case 'high': return 'task-card task-high-priority';
      case 'medium': return 'task-card task-medium-priority';
      case 'low': return 'task-card task-low-priority';
      default: return 'task-card';
    }
  };
  
  // Verificar se a tarefa tem recorrência
  const hasRecurrence = task.recurrence_type && task.recurrence_interval;
  
  // Verificar se a tarefa tem subtarefas
  const hasSubtasks = false; // Isso deve ser implementado no backend
  const isSubtask = !!task.parent_task_id;

  return (
    <div className="relative">
      <div className={getTaskCardClass(task)}>
        <div className="flex items-center gap-3">
          <Checkbox 
            checked={task.completed}
            onCheckedChange={() => onCheckTask(task.id)}
            id={`task-${task.id}`}
            disabled={timerState === 'work' && currentTask?.id === task.id}
          />
          <div className="flex-1">
            <div className="flex items-center">
              <label 
                htmlFor={`task-${task.id}`}
                className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''} ${isSubtask ? 'text-sm' : ''}`}
              >
                {task.name}
              </label>
              
              {/* Ícone de recorrência se aplicável */}
              {hasRecurrence && (
                <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-0.5 rounded-full">
                  Recorrente
                </span>
              )}
              
              {/* Indicador de tarefa redistribuída */}
              {task.target_date && new Date(task.target_date).toDateString() !== new Date().toDateString() && (
                <span className="ml-2 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 px-2 py-0.5 rounded-full">
                  Tarefa redistribuída
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" /> 
                {formatMinutes(task.estimatedTime)}
              </span>
              <span className={getPriorityClass(task.priority)}>
                {task.priority === 'low' ? 'baixa' : task.priority === 'medium' ? 'média' : 'alta'}
              </span>
            </div>
            
            {/* Exibir tags da tarefa */}
            {taskTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {taskTags.map(tag => (
                  <TagBadge key={tag.id} tag={tag} />
                ))}
              </div>
            )}
            
            {/* Botão para expandir/colapsar subtarefas */}
            {hasSubtasks && (
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-6 text-xs mt-1"
                onClick={() => setShowSubtasks(!showSubtasks)}
              >
                {showSubtasks ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Esconder subtarefas
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Mostrar subtarefas
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          {!task.completed && (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEditTask(task)}
                className="h-8 w-8 p-0 rounded-full"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onSelectTask(task)}
                disabled={timerState === 'work' && currentTask?.id !== task.id}
                className="h-8 w-8 p-0 rounded-full"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteTask(task.id)}
            className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showCompletionMessage === task.id && (
        <TaskCompletionMessage 
          taskName={completedTaskName} 
          streak={taskStreak} 
        />
      )}
    </div>
  );
};

export default TaskItem;
