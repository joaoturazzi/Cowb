
import React from 'react';
import Layout from '../components/Layout';
import UpcomingTasksComponent from '../components/UpcomingTasks';
import ErrorBoundary from '../components/ErrorBoundary';

const UpcomingTasksPage = () => {
  // Debug log to verify we're rendering the correct page
  console.log("Rendering UpcomingTasksPage");
  
  return (
    <ErrorBoundary>
      <Layout>
        <div className="max-w-4xl w-full mx-auto px-1 sm:px-2 md:px-4 pb-16">
          <UpcomingTasksComponent />
        </div>
      </Layout>
    </ErrorBoundary>
  );
};

export default UpcomingTasksPage;
