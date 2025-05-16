
import React from 'react';
import { Tag } from '@/contexts/task/types/tagTypes';
import TagBadge from '../tag/TagBadge';

interface TaskItemTagsProps {
  tags: Tag[];
  isLoading: boolean;
}

const TaskItemTags: React.FC<TaskItemTagsProps> = ({ tags, isLoading }) => {
  if (isLoading) {
    return <div className="flex gap-1 mt-2 h-5 animate-pulse"></div>;
  }
  
  if (tags.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {tags.map(tag => (
        <TagBadge key={tag.id} tag={tag} />
      ))}
    </div>
  );
};

export default TaskItemTags;
