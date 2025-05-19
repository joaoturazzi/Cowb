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
  return <div className="relative">
      <div ref={scrollContainerRef} style={{
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }} className="shrink-0 snap-center min-w-[9px] px-3 py-8 rounded-lg bg-white text-center shadow-sm\n">
        <TabsList className="relative mx-auto my-1 px-5 py-7 bg-sky-50 rounded-xl shadow-sm overflow-hidden">
          {days.map(day => {
          const isSelectedDay = day.formattedDate === selectedDay;
          const pendingTasksCount = day.tasks.filter(t => !t.completed).length;
          return <TabDay key={day.formattedDate} date={day.date} formattedDate={day.formattedDate} isSelected={isSelectedDay} tasksCount={pendingTasksCount} tabRef={isSelectedDay ? activeTabRef : undefined} />;
        })}
        </TabsList>
      </div>
      
      <TabsNavigation onScrollLeft={onScrollLeft} onScrollRight={onScrollRight} />
    </div>;
};
export default ScrollableTabsList;