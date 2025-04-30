
import React, { useRef, useEffect } from 'react';
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
  
  // Scroll to selected tab when it changes
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const tabElement = activeTabRef.current;
      const scrollContainer = scrollContainerRef.current;
      
      // Calculate the center position for the selected tab
      const tabLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const containerWidth = scrollContainer.offsetWidth;
      
      const centerPosition = tabLeft - (containerWidth / 2) + (tabWidth / 2);
      
      // Smooth scroll to the center position
      scrollContainer.scrollTo({
        left: centerPosition,
        behavior: 'smooth'
      });
    }
  }, [selectedDay]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-card rounded-xl border shadow-md animate-fade-in">
      <Tabs 
        defaultValue={selectedDay} 
        onValueChange={onDayChange}
        className="animate-fade-in"
      >
        <div className="px-4 pt-5 pb-1 relative">
          <ScrollableTabsList
            days={days}
            selectedDay={selectedDay}
            onScrollLeft={handleScrollLeft}
            onScrollRight={handleScrollRight}
            scrollContainerRef={scrollContainerRef}
            activeTabRef={activeTabRef}
          />
        </div>

        <div className="p-4 md:p-6 space-y-6">
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
