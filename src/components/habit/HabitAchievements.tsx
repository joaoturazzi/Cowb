
import React from 'react';
import { useHabit } from '@/contexts/habit/HabitContext';
import { Card } from '@/components/ui/card';
import { Award, Trophy, Flame, Star, CheckCircle2, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const HabitAchievements = () => {
  const { habits } = useHabit();

  // Calcular estatísticas gerais de hábitos
  const totalHabits = habits.length;
  const totalCompletions = habits.reduce((sum, habit) => 
    sum + (habit.logs?.filter(log => log.completed)?.length || 0), 0
  );
  const longestStreakHabit = habits.length > 0 
    ? habits.reduce((prev, current) => (prev.longestStreak > current.longestStreak) ? prev : current)
    : null;
  const totalCurrentStreak = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);
  
  // Checar conquistas específicas
  const achievements = [
    {
      id: 'first-habit',
      title: 'Primeiro Passo',
      description: 'Criar seu primeiro hábito',
      icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
      achieved: totalHabits > 0,
      progress: totalHabits > 0 ? 100 : 0,
    },
    {
      id: 'streak-7',
      title: 'Semana Consistente',
      description: 'Manter um hábito por 7 dias consecutivos',
      icon: <Flame className="h-6 w-6 text-orange-500" />,
      achieved: habits.some(h => h.currentStreak >= 7 || h.longestStreak >= 7),
      progress: Math.min(100, Math.max(...habits.map(h => Math.max(h.currentStreak, h.longestStreak) * 100 / 7)) || 0),
    },
    {
      id: 'streak-30',
      title: 'Maestria',
      description: 'Manter um hábito por 30 dias consecutivos',
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      achieved: habits.some(h => h.currentStreak >= 30 || h.longestStreak >= 30),
      progress: Math.min(100, Math.max(...habits.map(h => Math.max(h.currentStreak, h.longestStreak) * 100 / 30)) || 0),
    },
    {
      id: 'completions-50',
      title: 'Meio Centenário',
      description: 'Completar hábitos 50 vezes no total',
      icon: <Star className="h-6 w-6 text-blue-500" />,
      achieved: totalCompletions >= 50,
      progress: Math.min(100, (totalCompletions * 100) / 50),
    },
    {
      id: 'completions-100',
      title: 'Centenário',
      description: 'Completar hábitos 100 vezes no total',
      icon: <Award className="h-6 w-6 text-purple-500" />,
      achieved: totalCompletions >= 100,
      progress: Math.min(100, (totalCompletions * 100) / 100),
    },
    {
      id: 'all-habits-today',
      title: 'Dia Perfeito',
      description: 'Completar todos os hábitos do dia',
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      achieved: totalHabits > 0 && habits.every(h => h.completedToday),
      progress: totalHabits > 0 ? (habits.filter(h => h.completedToday).length * 100) / totalHabits : 0,
    },
  ];
  
  // Calcular nível baseado nas conquistas
  const achievedCount = achievements.filter(a => a.achieved).length;
  const level = Math.max(1, Math.floor(achievedCount / 2) + 1);
  const levelProgress = (achievedCount % 2) * 50;
  
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-lg font-medium mb-1">Nível {level}</h2>
            <p className="text-sm text-muted-foreground">
              {achievements.filter(a => a.achieved).length} de {achievements.length} conquistas
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {longestStreakHabit && (
              <div className="flex items-center gap-1 bg-orange-500/10 px-3 py-1.5 rounded-full">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-medium text-sm">
                  {longestStreakHabit.longestStreak} dias ({longestStreakHabit.name})
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs mb-1">
            <span>Próximo nível</span>
            <span className="font-medium">{levelProgress}%</span>
          </div>
          <Progress value={levelProgress} className="h-2" />
        </div>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`p-4 transition-all ${
              achievement.achieved 
                ? 'border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10' 
                : 'opacity-70'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${achievement.achieved ? 'bg-primary/10' : 'bg-muted'}`}>
                {achievement.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium mb-1">{achievement.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                
                <div className="space-y-1">
                  <Progress
                    value={achievement.progress}
                    className={`h-1.5 ${achievement.achieved ? 'bg-primary/20' : 'bg-muted'}`}
                  />
                  <div className="flex justify-between text-xs">
                    <span className={achievement.achieved ? 'text-primary' : 'text-muted-foreground'}>
                      {achievement.achieved ? 'Conquistado!' : `${Math.round(achievement.progress)}% completo`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Continue desenvolvendo seus hábitos para desbloquear mais conquistas!</p>
      </div>
    </div>
  );
};

export default HabitAchievements;
