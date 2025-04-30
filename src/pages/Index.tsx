
import React from 'react';
import Layout from '../components/Layout';
import DigitalClock from '../components/DigitalClock';
import PomodoroTimer from '../components/PomodoroTimer';
import TaskList from '../components/TaskList';

const Index = () => {
  return (
    <Layout>
      <DigitalClock />
      <PomodoroTimer />
      <TaskList />
    </Layout>
  );
};

export default Index;
