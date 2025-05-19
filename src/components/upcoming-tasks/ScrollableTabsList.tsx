
import React from 'react';
import { TabsList } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { DayTasks } from './types';
import TabDay from './TabDay';
import TabsNavigation from './TabsNavigation';

interface ScrollableTabsListProps {
  days: DayTasks[];
  selectedDay: string;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  activeTabRef: React.RefObject<HTMLButtonElement>;
}

const ScrollableTabsList: React.FC<ScrollableTabsListProps> = ({
  days,
  selectedDay,
  onScrollLeft,
  onScrollRight,
  scrollContainerRef,
  activeTabRef
}) => {
  return (
    <div className="relative">
      <div 
        ref={scrollContainerRef} 
        className="overflow-x-auto scrollbar-hide py-3 px-1 snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <TabsList className="relative flex w-max mx-auto bg-primary/5 backdrop-blur-sm rounded-2xl p-2 border border-primary/10 shadow-sm">
          {days.map(day => {
            const isSelectedDay = day.formattedDate === selectedDay;
            const pendingTasksCount = day.tasks.filter(t => !t.completed).length;
            
            return (
              <TabDay 
                key={day.formattedDate} 
                date={day.date} 
                formattedDate={day.formattedDate} 
                isSelected={isSelectedDay} 
                tasksCount={pendingTasksCount}
                tabRef={isSelectedDay ? activeTabRef : undefined} 
              />
            );
          })}
        </TabsList>
      </div>
      
      <TabsNavigation onScrollLeft={onScrollLeft} onScrollRight={onScrollRight} />
    </div>
  );
};

export default ScrollableTabsList;
