
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface TaskFormHeaderProps {
  title: string;
}

const TaskFormHeader: React.FC<TaskFormHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  return (
    <div className="mb-6 flex items-center">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleBackClick}
        className="mr-2"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-2xl font-semibold">{title}</h1>
    </div>
  );
};

export default TaskFormHeader;
