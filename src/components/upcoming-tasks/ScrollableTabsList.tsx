import React, { useEffect, useState, useCallback } from 'react';
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

  // Checa se é possível rolar para esquerda/direita
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 5);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
      }
    };
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      checkScroll();
      scrollContainer.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      const intervalCheck = setInterval(checkScroll, 500);
      return () => {
        scrollContainer.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
        clearInterval(intervalCheck);
      };
    }
  }, [scrollContainerRef, days]);

  // Scroll suave para a aba ativa
  const scrollToActiveTab = useCallback(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const tabElement = activeTabRef.current;
      const scrollContainer = scrollContainerRef.current;
      const tabLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const containerWidth = scrollContainer.offsetWidth;
      const idealPosition = tabLeft - (containerWidth / 2) + (tabWidth / 2);
      const maxScroll = scrollContainer.scrollWidth - containerWidth;
      const boundedPosition = Math.max(0, Math.min(idealPosition, maxScroll));
      scrollContainer.scrollTo({
        left: boundedPosition,
        behavior: 'smooth'
      });
      setTimeout(() => {
        if (scrollContainer) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
          setCanScrollLeft(scrollLeft > 5);
          setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
        }
      }, 300);
    }
  }, [activeTabRef, scrollContainerRef]);

  useEffect(() => {
    scrollToActiveTab();
  }, [selectedDay, scrollToActiveTab]);

  return (
    <div className="relative mt-0.5">
      <div 
        ref={scrollContainerRef} 
        className="overflow-x-auto hide-scrollbar px-4 py-2 rounded-lg scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory',
          scrollPadding: '0 1rem'
        }}
      >
        <TabsList 
          className={cn(
            "flex bg-card/50 backdrop-blur-sm rounded-xl p-1 border border-muted/40 shadow-sm min-w-fit",
            "gap-1.5 transition-all duration-200"
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
      {/* Gradientes de fade nas bordas com animação suave */}
      <div className="absolute top-0 left-0 bottom-0 w-12 pointer-events-none bg-gradient-to-r from-background via-background/95 to-transparent z-[1] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
      <div className="absolute top-0 right-0 bottom-0 w-12 pointer-events-none bg-gradient-to-l from-background via-background/95 to-transparent z-[1] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
      <Separator className="mt-2 mb-0.5 opacity-30" />
    </div>
  );
};

export default ScrollableTabsList;
