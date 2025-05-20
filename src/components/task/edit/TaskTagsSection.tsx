
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Tag } from '@/contexts/task/types/tagTypes';
import TagSelector from '../../tag/TagSelector';

interface TaskTagsSectionProps {
  isLoading: boolean;
  selectedTags: Tag[];
  availableTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  onCreateTagClick: () => void;
}

const TaskTagsSection: React.FC<TaskTagsSectionProps> = ({
  isLoading,
  selectedTags,
  availableTags,
  onTagsChange,
  onCreateTagClick
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <TagSelector
      selectedTags={selectedTags}
      availableTags={availableTags}
      onTagsChange={onTagsChange}
      onCreateTagClick={onCreateTagClick}
    />
  );
};

export default TaskTagsSection;
