
import React, { useRef, useState, useEffect } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DayTasks } from './types';
import UpcomingDayCard from './UpcomingDayCard';
import { Task } from '@/contexts/task/taskTypes';
import ScrollableTabsList from './ScrollableTabsList';

interface UpcomingDaysTabsProps {
  days: DayTasks[];
  selectedDay: string;
  timerState: string;
  currentTask: Task | null;
  showCompletionMessage: string | null;
  completedTaskName: string;
  taskStreak: number;
  onDayChange: (day: string) => void;
  onAddTask: (date: string) => void;
  onCheckTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const UpcomingDaysTabs: React.FC<UpcomingDaysTabsProps> = ({
  days,
  selectedDay,
  timerState,
  currentTask,
  showCompletionMessage,
  completedTaskName,
  taskStreak,
  onDayChange,
  onAddTask,
  onCheckTask,
  onSelectTask,
  onEditTask,
  onDeleteTask
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  // Handle scroll navigation
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Set a minimum height for content to prevent layout shift
    const calculateMinHeight = () => {
      const contents = document.querySelectorAll('[role="tabpanel"]:not([hidden])');
      if (contents.length > 0) {
        const maxHeight = Math.max(
          ...Array.from(contents).map(el => el.getBoundingClientRect().height)
        );
        if (maxHeight > 0) {
          setContentHeight(maxHeight);
        }
      }
    };

    calculateMinHeight();
    // Recalculate after a short delay to ensure content is rendered
    const timer = setTimeout(calculateMinHeight, 300);
    
    return () => clearTimeout(timer);
  }, [selectedDay]);
  
  // Handler for day change
  const handleDayChange = (day: string) => {
    onDayChange(day);
  };

  return (
    <div className="bg-card rounded-xl border shadow-md overflow-hidden animate-fade-in">
      <Tabs 
        value={selectedDay} 
        onValueChange={handleDayChange}
        className="animate-fade-in"
      >
        <div className="pt-0.5 pb-0 bg-gradient-to-b from-muted/5 to-transparent">
          <ScrollableTabsList
            days={days}
            selectedDay={selectedDay}
            onScrollLeft={handleScrollLeft}
            onScrollRight={handleScrollRight}
            scrollContainerRef={scrollContainerRef}
            activeTabRef={activeTabRef}
          />
        </div>

        <div className="p-3 md:p-4 space-y-4" style={contentHeight ? { minHeight: contentHeight } : {}}>
          {days.map((day) => (
            <TabsContent 
              key={day.formattedDate} 
              value={day.formattedDate}
              className="animate-fade-in mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <UpcomingDayCard
                date={day.date}
                tasks={day.tasks}
                isEmpty={day.isEmpty}
                timerState={timerState}
                currentTask={currentTask}
                showCompletionMessage={showCompletionMessage}
                completedTaskName={completedTaskName}
                taskStreak={taskStreak}
                onAddTask={onAddTask}
                onCheckTask={onCheckTask}
                onSelectTask={onSelectTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default UpcomingDaysTabs;
