
import React, { useState, useRef, useEffect } from 'react';
import { Task } from '@/contexts';

interface VirtualizedTaskListProps {
  tasks: Task[];
  itemHeight: number;
  windowHeight: number;
  renderItem: (task: Task, index: number) => React.ReactNode;
  className?: string;
}

const VirtualizedTaskList: React.FC<VirtualizedTaskListProps> = ({
  tasks,
  itemHeight,
  windowHeight,
  renderItem,
  className = '',
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate the range of visible items based on scroll position
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 5);
  const endIndex = Math.min(
    tasks.length,
    Math.ceil((scrollTop + windowHeight) / itemHeight) + 5
  );
  
  // Handle scroll events to update the visible range
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };
  
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  
  // Calculate the total height of all items
  const totalHeight = tasks.length * itemHeight;
  
  // Render only the visible items
  const visibleItems = tasks
    .slice(startIndex, endIndex)
    .map((task, index) => (
      <div
        key={task.id}
        style={{ 
          position: 'absolute', 
          top: (startIndex + index) * itemHeight,
          width: '100%',
          height: itemHeight,
        }}
      >
        {renderItem(task, startIndex + index)}
      </div>
    ));
  
  return (
    <div
      ref={containerRef}
      className={`relative overflow-y-auto ${className}`}
      style={{ height: windowHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems}
      </div>
    </div>
  );
};

export default VirtualizedTaskList;
