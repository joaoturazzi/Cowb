
import React, { useEffect, useState } from 'react';
import { TabsList } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { DayTasks } from './types';
import TabDay from './TabDay';
import TabsNavigation from './TabsNavigation';
import { Separator } from '@/components/ui/separator';

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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll possibilities
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      checkScroll();
      scrollContainer.addEventListener('scroll', checkScroll);
      return () => scrollContainer.removeEventListener('scroll', checkScroll);
    }
  }, [scrollContainerRef]);

  // Automatically scroll to the active tab on mount and when selectedDay changes
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const tabElement = activeTabRef.current;
      const scrollContainer = scrollContainerRef.current;

      // Get positions for centering
      const tabLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const containerWidth = scrollContainer.offsetWidth;

      // Calculate center position and ensure it doesn't go out of bounds
      const centerPosition = Math.max(0, tabLeft - containerWidth / 2 + tabWidth / 2);

      // Smooth scroll to position
      scrollContainer.scrollTo({
        left: centerPosition,
        behavior: 'smooth'
      });
    }
  }, [selectedDay, activeTabRef, scrollContainerRef]);

  return (
    <div className="relative mt-1 mb-3">
      <div 
        ref={scrollContainerRef} 
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory'
        }} 
        className="overflow-x-auto hide-scrollbar px-2 py-2 rounded-lg"
      >
        <TabsList 
          className={cn(
            "flex bg-card backdrop-blur-sm rounded-xl p-1.5 border border-muted/40 shadow-sm min-w-fit",
            "gap-1"
          )}
        >
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
      
      <TabsNavigation 
        onScrollLeft={onScrollLeft} 
        onScrollRight={onScrollRight}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
      />
      
      {/* Enhanced gradient effect */}
      <div className="absolute top-0 left-0 bottom-0 w-12 pointer-events-none bg-gradient-to-r from-background via-background/90 to-transparent z-[1]"></div>
      <div className="absolute top-0 right-0 bottom-0 w-12 pointer-events-none bg-gradient-to-l from-background via-background/90 to-transparent z-[1]"></div>
      
      <Separator className="mt-2 mb-1 opacity-30" />
    </div>
  );
};

export default ScrollableTabsList;
