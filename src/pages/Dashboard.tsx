
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductivityBarChart from '../components/dashboard/ProductivityBarChart';
import CompletionRateChart from '../components/dashboard/CompletionRateChart';
import FocusTimeDistribution from '../components/dashboard/FocusTimeDistribution';
import ProductivityTrends from '../components/dashboard/ProductivityTrends';
import { getSessionsByDateRange, getDailyProductivity, getProductivityTrends } from '../contexts/analytics/analyticsService';
import { DailyProductivity, PomodoroSession, ProductivityTrend } from '../contexts/analytics/analyticsTypes';
import { subDays, format } from 'date-fns';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dailyProductivity, setDailyProductivity] = useState<DailyProductivity[]>([]);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [productivityTrends, setProductivityTrends] = useState<ProductivityTrend[]>([]);
  const [trendPeriod, setTrendPeriod] = useState<'weekly' | 'monthly'>('weekly');
  
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Buscar dados de produtividade dos últimos 7 dias
        const productivity = await getDailyProductivity(user.id, 7);
        setDailyProductivity(productivity);
        
        // Buscar sessões do período
        const endDate = new Date();
        const startDate = subDays(endDate, 7);
        const sessionData = await getSessionsByDateRange(user.id, startDate, endDate);
        setSessions(sessionData);
        
        // Buscar tendências
        const trends = await getProductivityTrends(user.id, trendPeriod);
        setProductivityTrends(trends);
        
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
    
  }, [isAuthenticated, user, trendPeriod]);
  
  // Redirecionar para login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="trends">Tendências</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-60">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div>
            <TabsContent value="overview" className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <ProductivityBarChart data={dailyProductivity} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <CompletionRateChart data={dailyProductivity} />
                <FocusTimeDistribution sessions={sessions} />
              </div>
            </TabsContent>
            
            <TabsContent value="trends" className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <ProductivityTrends 
                  data={productivityTrends} 
                  period={trendPeriod}
                  onChangePeriod={setTrendPeriod}
                />
              </div>
            </TabsContent>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
