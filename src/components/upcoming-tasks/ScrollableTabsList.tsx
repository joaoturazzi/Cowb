<<<<<<< HEAD
import React, { useEffect, useCallback } from 'react';
=======

import React, { useEffect, useState } from 'react';
>>>>>>> 9e44140c44d801a0481ecf4acdf4a08dbe51b0d7
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
<<<<<<< HEAD
  // Função otimizada para scroll suave
  const scrollToActiveTab = useCallback(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const tabElement = activeTabRef.current;
      const scrollContainer = scrollContainerRef.current;

      // Calcula a posição central
      const tabLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const containerWidth = scrollContainer.offsetWidth;
      const scrollLeft = scrollContainer.scrollLeft;

      // Calcula a posição ideal para centralizar a aba
      const idealPosition = tabLeft - (containerWidth / 2) + (tabWidth / 2);
      
      // Aplica limites para evitar scroll excessivo
      const maxScroll = scrollContainer.scrollWidth - containerWidth;
      const boundedPosition = Math.max(0, Math.min(idealPosition, maxScroll));

      // Scroll suave para a posição
=======
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll possibilities more frequently
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 5); // Small threshold to detect scrolling
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5); // More precise detection
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      // Initial check
      checkScroll();
      
      // Add event listeners
      scrollContainer.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      
      // Periodic check to handle edge cases
      const intervalCheck = setInterval(checkScroll, 500);
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
        clearInterval(intervalCheck);
      }
    }
  }, [scrollContainerRef, days]);

  // Scroll to the active tab when selectedDay changes
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const tabElement = activeTabRef.current;
      const scrollContainer = scrollContainerRef.current;
      
      // Get positions for centering
      const tabLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const containerWidth = scrollContainer.offsetWidth;
      
      // Calculate center position - ensure it's within bounds
      const centerPosition = Math.max(0, tabLeft - containerWidth / 2 + tabWidth / 2);
      
      // Smooth scroll to position
>>>>>>> 9e44140c44d801a0481ecf4acdf4a08dbe51b0d7
      scrollContainer.scrollTo({
        left: boundedPosition,
        behavior: 'smooth'
      });
      
      // Force another check of scroll status after scrolling
      setTimeout(() => {
        if (scrollContainer) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
          setCanScrollLeft(scrollLeft > 5);
          setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
        }
      }, 300);
    }
  }, [activeTabRef, scrollContainerRef]);

  // Efeito para scroll automático quando a aba selecionada muda
  useEffect(() => {
    scrollToActiveTab();
  }, [selectedDay, scrollToActiveTab]);

  return (
    <div className="relative mt-0.5">
      <div 
        ref={scrollContainerRef} 
        className="overflow-x-auto hide-scrollbar px-4 py-2 rounded-lg"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
<<<<<<< HEAD
          scrollSnapType: 'x mandatory',
          scrollPadding: '0 1rem'
        }} 
        className={cn(
          "overflow-x-auto hide-scrollbar px-4 py-2",
          "scroll-smooth"
        )}
      >
        <TabsList 
          className={cn(
            "flex bg-card/50 backdrop-blur-sm rounded-xl p-1 border border-muted/40 shadow-sm min-w-fit",
            "gap-1.5",
            "transition-all duration-200"
=======
          scrollSnapType: 'x mandatory'
        }}
      >
        <TabsList 
          className={cn(
            "flex bg-card backdrop-blur-sm rounded-xl p-1.5 border border-muted/40 shadow-sm",
            "min-w-fit gap-0.5 w-full justify-start"
>>>>>>> 9e44140c44d801a0481ecf4acdf4a08dbe51b0d7
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
      
<<<<<<< HEAD
      {/* Gradientes de fade nas bordas com animação suave */}
      <div className="absolute top-0 left-0 bottom-0 w-12 pointer-events-none bg-gradient-to-r from-background via-background/95 to-transparent z-[1] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
      <div className="absolute top-0 right-0 bottom-0 w-12 pointer-events-none bg-gradient-to-l from-background via-background/95 to-transparent z-[1] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
=======
      {/* Enhanced gradients for better fading effect */}
      <div className="absolute top-0 left-0 bottom-0 w-10 pointer-events-none bg-gradient-to-r from-background to-transparent z-[1]"></div>
      <div className="absolute top-0 right-0 bottom-0 w-10 pointer-events-none bg-gradient-to-l from-background to-transparent z-[1]"></div>
      
      <Separator className="mt-2 mb-0.5 opacity-30" />
>>>>>>> 9e44140c44d801a0481ecf4acdf4a08dbe51b0d7
    </div>
  );
};

export default ScrollableTabsList;
