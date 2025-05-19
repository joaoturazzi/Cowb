
import React from 'react';
import HabitStreakSummary from './habit/HabitStreakSummary';

// Note: This component will be imported in the Summary page
// It wraps the existing DailySummary component and adds our HabitStreakSummary
const DailySummaryWithHabits: React.FC = () => {
  return (
    <div>
      <HabitStreakSummary />
      {/* The original DailySummary component is imported here by the parent component */}
    </div>
  );
};

export default DailySummaryWithHabits;
