
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Calendar } from 'lucide-react';

const EmptyTasksAlert: React.FC = () => {
  return (
    <Alert className="bg-muted/20 border-muted shadow-sm">
      <Calendar className="h-5 w-5 text-muted-foreground" />
      <AlertTitle className="text-base">No tasks</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        You don't have any tasks for this day. Add a new task to get started.
      </AlertDescription>
    </Alert>
  );
};

export default EmptyTasksAlert;
