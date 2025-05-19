
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Trophy, PieChart, Calendar, BarChart } from 'lucide-react';
import { useChallenge } from '@/contexts';
import ChallengeStats from '../components/challenges/ChallengeStats';
import ChallengeHistory from '../components/challenges/ChallengeHistory';
import { Progress } from '@/components/ui/progress';

const ChallengeDashboard = () => {
  const navigate = useNavigate();
  const { 
    challenges, 
    dailyChallenges, 
    weeklyChallenges, 
    surpriseChallenges, 
    completedChallenges 
  } = useChallenge();
  
  const totalChallenges = challenges.length;
  const completionRate = totalChallenges > 0 
    ? Math.round((completedChallenges / totalChallenges) * 100) 
    : 0;

  return (
    <Layout>
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/challenges')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Challenge Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Challenges</CardDescription>
            <CardTitle className="text-3xl">{totalChallenges}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Trophy className="mr-1 h-4 w-4" />
              <span>{completedChallenges} completed</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completion Rate</CardDescription>
            <CardTitle className="text-3xl">{completionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={completionRate} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Daily Challenges</CardDescription>
            <CardTitle className="text-3xl">{dailyChallenges.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              <span>Refreshes daily</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Weekly Challenges</CardDescription>
            <CardTitle className="text-3xl">{weeklyChallenges.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              <span>Refreshes weekly</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stats" className="flex items-center gap-1">
            <PieChart className="h-4 w-4" />
            <span>Statistics</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats" className="space-y-4">
          <ChallengeStats />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <ChallengeHistory />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default ChallengeDashboard;
