
import React from 'react';
import { HabitLog } from '@/contexts/habit/habitTypes';

interface HabitCompletionCalendarProps {
  logs?: HabitLog[];
}

const HabitCompletionCalendar: React.FC<HabitCompletionCalendarProps> = ({ logs }) => {
  return (
    <div className="flex gap-1 justify-end">
      {Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayLog = logs?.find(log => 
          new Date(log.date).toDateString() === date.toDateString()
        );
        const isCompleted = dayLog?.completed;
        const dayOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][date.getDay()];
        
        return (
          <div 
            key={`day-${i}`} 
            className={`w-6 h-6 flex flex-col items-center justify-center rounded-full text-[10px] transition-all ${
              isCompleted 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            } ${date.toDateString() === new Date().toDateString() ? 'ring-1 ring-primary' : ''}`}
            title={date.toLocaleDateString()}
          >
            <span className="text-[8px]">{dayOfWeek}</span>
            {isCompleted && <div className="h-1 w-1 rounded-full bg-current mt-0.5"></div>}
          </div>
        );
      })}
    </div>
  );
};

export default HabitCompletionCalendar;
