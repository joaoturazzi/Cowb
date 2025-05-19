
import React from 'react';
import Layout from '../components/Layout';
import UpcomingTasksComponent from '../components/UpcomingTasks';
import ErrorBoundary from '../components/ErrorBoundary';

const UpcomingTasksPage = () => {
  return (
    <ErrorBoundary>
      <Layout>
        <div className="max-w-4xl w-full mx-auto px-0 pb-16">
          <UpcomingTasksComponent />
        </div>
      </Layout>
    </ErrorBoundary>
  );
};

export default UpcomingTasksPage;
