
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Tag } from '@/contexts/task/types/tagTypes';
import TagBadge from './TagBadge';
import { Plus, X } from 'lucide-react';

interface TagSelectorProps {
  selectedTags: Tag[];
  availableTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  onCreateTagClick?: () => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  availableTags,
  onTagsChange,
  onCreateTagClick
}) => {
  const [open, setOpen] = useState(false);
  
  const handleTagSelect = (tag: Tag) => {
    if (selectedTags.some(t => t.id === tag.id)) {
      onTagsChange(selectedTags.filter(t => t.id !== tag.id));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };
  
  const handleTagRemove = (tagId: string) => {
    onTagsChange(selectedTags.filter(t => t.id !== tagId));
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Tags</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 px-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="end">
            <div className="space-y-2">
              <div className="text-sm font-medium">Selecione as tags:</div>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                {availableTags.length > 0 ? (
                  availableTags.map(tag => (
                    <button
                      key={tag.id}
                      className={`px-2 py-1 rounded-md text-xs transition-colors ${
                        selectedTags.some(t => t.id === tag.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                      style={{
                        backgroundColor: selectedTags.some(t => t.id === tag.id) 
                          ? tag.color 
                          : undefined
                      }}
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag.name}
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground py-2">
                    Nenhuma tag disponível.
                  </div>
                )}
              </div>
              
              {onCreateTagClick && (
                <div className="pt-2 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => {
                      setOpen(false);
                      onCreateTagClick();
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Criar nova tag
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex flex-wrap gap-2 min-h-8">
        {selectedTags.length > 0 ? (
          selectedTags.map(tag => (
            <TagBadge 
              key={tag.id} 
              tag={tag}
              onRemove={() => handleTagRemove(tag.id)}
              showRemove 
            />
          ))
        ) : (
          <div className="text-xs text-muted-foreground py-1">
            Nenhuma tag selecionada
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSelector;
