
import React, { useEffect } from 'react';
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
  // Automatically scroll to the active tab on mount and when selectedDay changes
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const tabElement = activeTabRef.current;
      const scrollContainer = scrollContainerRef.current;
      
      // Get positions for centering
      const tabLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const containerWidth = scrollContainer.offsetWidth;
      
      // Calculate center position
      const centerPosition = tabLeft - (containerWidth / 2) + (tabWidth / 2);
      
      // Smooth scroll to position
      scrollContainer.scrollTo({
        left: centerPosition,
        behavior: 'smooth'
      });
    }
  }, [selectedDay, activeTabRef, scrollContainerRef]);
  
  return (
    <div className="relative">
      <div 
        ref={scrollContainerRef} 
        className="overflow-x-auto py-3 px-1 snap-x snap-mandatory hide-scrollbar"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <TabsList className="flex min-w-max bg-card/50 backdrop-blur-sm rounded-2xl p-2 border border-muted/40 shadow-sm">
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
      
      {/* Enhanced gradient effect for better scrolling indication but with pointer-events-none */}
      <div className="absolute top-0 left-0 bottom-0 w-12 pointer-events-none bg-gradient-to-r from-background via-background/90 to-transparent z-[1]"></div>
      <div className="absolute top-0 right-0 bottom-0 w-12 pointer-events-none bg-gradient-to-l from-background via-background/90 to-transparent z-[1]"></div>
    </div>
  );
};

export default ScrollableTabsList;
