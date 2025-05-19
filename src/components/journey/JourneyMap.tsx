
import React, { useEffect, useState } from 'react';
import { useTask, useAuth } from '@/contexts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO, isAfter, isBefore, eachDayOfInterval, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Flag, MapPin, Map, ArrowRight, CheckCircle } from 'lucide-react';
import './JourneyMap.css';

interface JourneyPoint {
  date: Date;
  completedTasks: number;
  streak: boolean;
}

const JourneyMap: React.FC = () => {
  const { tasks } = useTask();
  const { user } = useAuth();
  const [journeyData, setJourneyData] = useState<JourneyPoint[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);

  // Calculate journey data for visualization
  useEffect(() => {
    if (!user || tasks.length === 0) return;
    
    // Get completed tasks
    const completedTasks = tasks.filter(task => task.completed);
    setTotalCompleted(completedTasks.length);
    
    // Generate dates for the last 30 days
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);
    const dateRange = eachDayOfInterval({ start: thirtyDaysAgo, end: today });
    
    // Calculate tasks completed per day and identify streaks
    let streak = 0;
    let maxStreak = 0;
    const journeyPoints: JourneyPoint[] = [];
    
    dateRange.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const tasksCompletedOnDay = completedTasks.filter(task => 
        task.target_date === dateStr || 
        (task.createdAt && format(parseISO(task.createdAt), 'yyyy-MM-dd') === dateStr)
      );
      
      const hasCompletions = tasksCompletedOnDay.length > 0;
      
      // Update streak calculation
      if (hasCompletions) {
        streak += 1;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 0;
      }
      
      journeyPoints.push({
        date,
        completedTasks: tasksCompletedOnDay.length,
        streak: hasCompletions
      });
    });
    
    setJourneyData(journeyPoints);
    setCurrentStreak(streak);
    setLongestStreak(maxStreak);
    
  }, [tasks, user]);

  // Helper function to get intensity class based on completed tasks count
  const getIntensityClass = (count: number): string => {
    if (count === 0) return 'intensity-0';
    if (count <= 2) return 'intensity-1';
    if (count <= 5) return 'intensity-2';
    return 'intensity-3';
  };

  return (
    <Card className="journey-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          <span>Mapa da Jornada</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="journey-stats">
          <div className="stat-item">
            <div className="stat-value">{totalCompleted}</div>
            <div className="stat-label">Total Concluídas</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{currentStreak}</div>
            <div className="stat-label">Sequência Atual</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{longestStreak}</div>
            <div className="stat-label">Maior Sequência</div>
          </div>
        </div>
        
        <div className="journey-path">
          <div className="journey-start">
            <MapPin className="h-5 w-5" />
            <span>Início</span>
          </div>
          
          <div className="journey-timeline">
            {journeyData.map((point, index) => (
              <div 
                key={index}
                className={`journey-point ${getIntensityClass(point.completedTasks)} ${point.streak ? 'streak' : ''}`}
                title={`${format(point.date, 'dd/MM/yyyy')}: ${point.completedTasks} tarefas concluídas`}
              >
                {point.completedTasks > 0 && (
                  <div className="journey-hint">
                    <div className="hint-date">{format(point.date, 'dd MMM', { locale: ptBR })}</div>
                    <div className="hint-count">
                      <CheckCircle className="h-3 w-3" />
                      <span>{point.completedTasks}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="journey-end">
            <Flag className="h-5 w-5" />
            <span>Hoje</span>
          </div>
        </div>
        
        <div className="journey-legend">
          <div className="legend-item">
            <div className="legend-color intensity-0"></div>
            <span>Sem tarefas</span>
          </div>
          <div className="legend-item">
            <div className="legend-color intensity-1"></div>
            <span>1-2 tarefas</span>
          </div>
          <div className="legend-item">
            <div className="legend-color intensity-2"></div>
            <span>3-5 tarefas</span>
          </div>
          <div className="legend-item">
            <div className="legend-color intensity-3"></div>
            <span>6+ tarefas</span>
          </div>
        </div>
        
        <div className="journey-message">
          {currentStreak > 0 ? (
            <p>Você tem uma sequência de {currentStreak} {currentStreak === 1 ? 'dia' : 'dias'}! Continue assim!</p>
          ) : (
            <p>Complete tarefas hoje para iniciar uma nova sequência!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyMap;
