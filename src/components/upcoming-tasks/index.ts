
// Export all components needed for the UpcomingTasks page
export { useUpcomingTasks } from './useUpcomingTasks';
export { default as UpcomingTasksHeader } from './UpcomingTasksHeader';
export { default as UpcomingDaysTabs } from './UpcomingDaysTabs';
export { default as UpcomingDayCard } from './UpcomingDayCard';
export { default as EmptyDayCard } from './EmptyDayCard';
export { default as EmptyTasksAlert } from './EmptyTasksAlert';
export { default as TaskSection } from './TaskSection';
export { default as TabDay } from './TabDay';
export { default as ScrollableTabsList } from './ScrollableTabsList';
export { default as TabsNavigation } from './TabsNavigation';
export { default as DayCardHeader } from './DayCardHeader';

// Add CSS to hide scrollbars with improved selectors
const style = document.createElement('style');
style.textContent = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none !important;
  }
  
  .hide-scrollbar {
    -ms-overflow-style: none !important;
    scrollbar-width: none !important;
  }
  
  /* Ensure tabs have proper interaction */
  [role="tab"] {
    cursor: pointer !important;
    user-select: none !important;
    -webkit-tap-highlight-color: transparent !important;
  }
  
  /* Improve tap targets on mobile */
  @media (max-width: 640px) {
    [role="tab"] {
      min-height: 44px !important;
    }
  }
`;
document.head.appendChild(style);
