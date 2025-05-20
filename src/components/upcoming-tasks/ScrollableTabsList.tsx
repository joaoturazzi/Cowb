import React, { useEffect, useCallback } from 'react';
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
      scrollContainer.scrollTo({
        left: boundedPosition,
        behavior: 'smooth'
      });
    }
  }, [activeTabRef, scrollContainerRef]);

  // Efeito para scroll automático quando a aba selecionada muda
  useEffect(() => {
    scrollToActiveTab();
  }, [selectedDay, scrollToActiveTab]);

  return (
    <div className="relative">
      <div 
        ref={scrollContainerRef} 
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
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
      />
      
      {/* Gradientes de fade nas bordas com animação suave */}
      <div className="absolute top-0 left-0 bottom-0 w-12 pointer-events-none bg-gradient-to-r from-background via-background/95 to-transparent z-[1] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
      <div className="absolute top-0 right-0 bottom-0 w-12 pointer-events-none bg-gradient-to-l from-background via-background/95 to-transparent z-[1] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
    </div>
  );
};

export default ScrollableTabsList;
