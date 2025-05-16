
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyProductivity } from '@/contexts/analytics/analyticsTypes';

interface CompletionRateChartProps {
  data: DailyProductivity[];
}

const CompletionRateChart: React.FC<CompletionRateChartProps> = ({ data }) => {
  // Calcular total de tarefas concluídas
  const totalCompleted = data.reduce((sum, item) => sum + item.completedTasks, 0);
  
  // Calcular média de tarefas por dia
  const avgTasksPerDay = totalCompleted / data.length || 0;
  
  // Calcular dias produtivos (dias com pelo menos uma tarefa concluída)
  const productiveDays = data.filter(item => item.completedTasks > 0).length;
  const productiveDaysPercentage = (productiveDays / data.length) * 100 || 0;
  
  // Preparar dados para o gráfico
  const chartData = [
    { name: 'Dias Produtivos', value: productiveDays },
    { name: 'Dias Sem Conclusões', value: data.length - productiveDays }
  ];
  
  const COLORS = ['#7c3aed', '#e4e4e7'];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Taxa de Conclusão</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground text-sm">Taxa de Produtividade</span>
            <span className="text-2xl font-bold">{productiveDaysPercentage.toFixed(0)}%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground text-sm">Média de Tarefas</span>
            <span className="text-2xl font-bold">{avgTasksPerDay.toFixed(1)}/dia</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionRateChart;
