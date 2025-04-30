
import React from 'react';
import Layout from '../components/Layout';
import UpcomingTasks from '../components/UpcomingTasks';

const UpcomingTasksPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-6 px-1 sm:px-4">
        <UpcomingTasks />
      </div>
    </Layout>
  );
};

export default UpcomingTasksPage;
