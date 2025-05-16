
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SubtasksToggleProps {
  hasSubtasks: boolean;
  showSubtasks: boolean;
  setShowSubtasks: (show: boolean) => void;
}

const SubtasksToggle: React.FC<SubtasksToggleProps> = ({
  hasSubtasks,
  showSubtasks,
  setShowSubtasks
}) => {
  if (!hasSubtasks) {
    return null;
  }
  
  return (
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
  );
};

export default SubtasksToggle;
