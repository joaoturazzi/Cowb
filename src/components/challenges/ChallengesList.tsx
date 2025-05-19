
import React, { useState } from 'react';
import { useChallenge, useAuth } from '@/contexts';
import ChallengeCard from './ChallengeCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Plus, Sparkles } from 'lucide-react';
import { sonnerToast as toast } from '@/components/ui';
import TaskListAuth from '../tasks/TaskListAuth';
import { useNavigate } from 'react-router-dom';

const ChallengesList: React.FC = () => {
  const { 
    dailyChallenges, 
    weeklyChallenges, 
    surpriseChallenges, 
    completedChallenges,
    generateSurpriseChallenge 
  } = useChallenge();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  const navigate = useNavigate();
  
  const activeChallenges = [
    ...dailyChallenges,
    ...weeklyChallenges,
    ...surpriseChallenges
  ].filter(challenge => challenge.status !== 'completed');
  
  const completedChallengesList = [
    ...dailyChallenges,
    ...weeklyChallenges,
    ...surpriseChallenges
  ].filter(challenge => challenge.status === 'completed');
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleGenerateSurpriseChallenge = () => {
    generateSurpriseChallenge();
    toast.success('Novo desafio surpresa gerado!');
  };

  return (
    <TaskListAuth
      isAuthenticated={isAuthenticated}
      onLogin={handleLogin}
    >
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Desafios
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateSurpriseChallenge}
              className="gap-1"
            >
              <Sparkles className="h-4 w-4" />
              <span>Desafio Surpresa</span>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Ativos</span>
                <span className="ml-1 bg-primary/20 text-primary px-1.5 py-0.5 rounded-full text-xs">
                  {activeChallenges.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                <span>Completados</span>
                <span className="ml-1 bg-primary/20 text-primary px-1.5 py-0.5 rounded-full text-xs">
                  {completedChallengesList.length}
                </span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4 mt-1">
              {activeChallenges.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-3" />
                  <p className="text-muted-foreground">Nenhum desafio ativo no momento</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={handleGenerateSurpriseChallenge}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    <span>Gerar Desafio Surpresa</span>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {activeChallenges.map(challenge => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4 mt-1">
              {completedChallengesList.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-3" />
                  <p className="text-muted-foreground">Nenhum desafio completado ainda</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {completedChallengesList.map(challenge => (
                    <ChallengeCard 
                      key={challenge.id} 
                      challenge={challenge} 
                      showActions={false}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TaskListAuth>
  );
};

export default ChallengesList;
