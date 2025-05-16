
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PomodoroSession } from '@/contexts/analytics/analyticsTypes';
import { formatMinutes } from '@/utils/timeUtils';

interface FocusTimeDistributionProps {
  sessions: PomodoroSession[];
}

const FocusTimeDistribution: React.FC<FocusTimeDistributionProps> = ({ sessions }) => {
  // Filtrar apenas sessões de trabalho e concluídas
  const workSessions = sessions.filter(
    session => session.session_type === 'work' && session.status === 'completed'
  );
  
  // Calcular tempo total por tarefa
  const taskTimeMap: Record<string, number> = {};
  const taskNames: Record<string, string> = {};
  
  workSessions.forEach(session => {
    if (session.task_id) {
      // Se não temos o nome da tarefa, usamos o ID temporariamente
      const taskId = session.task_id;
      taskTimeMap[taskId] = (taskTimeMap[taskId] || 0) + (session.actual_duration || 0);
      
      // Aqui, idealmente, buscaríamos o nome real da tarefa do contexto
      taskNames[taskId] = taskId; // Placeholder
    } else {
      // Tempo sem tarefa específica
      taskTimeMap['sem_tarefa'] = (taskTimeMap['sem_tarefa'] || 0) + (session.actual_duration || 0);
      taskNames['sem_tarefa'] = 'Sem tarefa específica';
    }
  });
  
  // Converter para o formato esperado pelo gráfico
  const chartData = Object.keys(taskTimeMap).map(taskId => ({
    id: taskId,
    name: taskNames[taskId],
    value: Math.round(taskTimeMap[taskId] / 60) // Converter para minutos
  }));
  
  // Limitar a 5 itens + "Outros" para melhor visualização
  let processedData = chartData;
  if (chartData.length > 5) {
    const topItems = chartData
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
    
    const otherItems = chartData
      .sort((a, b) => b.value - a.value)
      .slice(4);
    
    const otherValue = otherItems.reduce((sum, item) => sum + item.value, 0);
    
    processedData = [
      ...topItems,
      { id: 'outros', name: 'Outros', value: otherValue }
    ];
  }
  
  const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Distribuição de Tempo Focado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatMinutes(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusTimeDistribution;
