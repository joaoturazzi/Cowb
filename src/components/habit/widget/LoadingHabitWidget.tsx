
import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const LoadingHabitWidget: React.FC = () => {
  return (
    <Card className="p-4 h-full flex items-center justify-center bg-gradient-to-br from-card to-background border-primary/10">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
    </Card>
  );
};

export default LoadingHabitWidget;
