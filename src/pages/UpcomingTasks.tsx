
import React from 'react';
import Layout from '../components/Layout';
import UpcomingTasksComponent from '../components/UpcomingTasks';
import ErrorBoundary from '../components/ErrorBoundary';

const UpcomingTasksPage = () => {
  return (
    <ErrorBoundary>
      <Layout>
        <div className="max-w-4xl mx-auto pb-6 px-1 sm:px-4">
          <UpcomingTasksComponent />
        </div>
      </Layout>
    </ErrorBoundary>
  );
};

export default UpcomingTasksPage;
