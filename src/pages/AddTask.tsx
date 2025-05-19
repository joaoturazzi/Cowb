
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts';
import Layout from '../components/Layout';
import { TaskForm, TaskFormHeader } from '../components/task/form';

const AddTask = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get date from location state if provided
  const selectedDateFromNav = location.state?.selectedDate;
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-60">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <TaskFormHeader title="Nova tarefa" />
      <TaskForm selectedDate={selectedDateFromNav} />
    </Layout>
  );
};

export default AddTask;
