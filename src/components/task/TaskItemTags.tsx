
import React from 'react';
import { Tag } from '@/contexts/task/types/tagTypes';
import TagBadge from '../tag/TagBadge';

interface TaskItemTagsProps {
  tags: Tag[];
  isLoading: boolean;
}

const TaskItemTags: React.FC<TaskItemTagsProps> = ({ tags, isLoading }) => {
  if (isLoading) {
    return <div className="flex gap-1 mt-1 h-3 animate-pulse"></div>;
  }
  
  if (tags.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {tags.map(tag => (
        <span 
          key={tag.id} 
          className="inline-flex items-center rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground"
          style={tag.color ? { backgroundColor: `${tag.color}20`, color: tag.color } : {}}
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
};

export default TaskItemTags;
