import React from 'react';
import Layout from '../components/Layout';
import UpcomingTasksComponent from '../components/UpcomingTasks';
import ErrorBoundary from '../components/ErrorBoundary';
const UpcomingTasksPage = () => {
  return <ErrorBoundary>
      <Layout>
        <div className="max-w-4xl pb-6 px-1 mx-0 py-0 sm:px-0">
          <UpcomingTasksComponent />
        </div>
      </Layout>
    </ErrorBoundary>;
};
export default UpcomingTasksPage;