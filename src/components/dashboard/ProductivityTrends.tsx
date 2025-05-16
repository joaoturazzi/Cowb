
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProductivityTrend } from '@/contexts/analytics/analyticsTypes';
import { formatMinutes } from '@/utils/timeUtils';

interface ProductivityTrendsProps {
  data: ProductivityTrend[];
  period: 'weekly' | 'monthly';
  onChangePeriod: (period: 'weekly' | 'monthly') => void;
}

const ProductivityTrends: React.FC<ProductivityTrendsProps> = ({ 
  data, 
  period,
  onChangePeriod 
}) => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Tendências de Produtividade</CardTitle>
            <CardDescription>
              Evolução do seu tempo focado e tarefas concluídas
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => onChangePeriod('weekly')}
              className={`px-3 py-1 text-xs rounded-md ${
                period === 'weekly' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              Semanal
            </button>
            <button 
              onClick={() => onChangePeriod('monthly')}
              className={`px-3 py-1 text-xs rounded-md ${
                period === 'monthly' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              Mensal
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="period" 
                angle={-45} 
                textAnchor="end"
                height={60}
              />
              <YAxis 
                yAxisId="left"
                tickFormatter={(value) => formatMinutes(value)}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[0, 'auto']} 
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'Tempo Focado') return formatMinutes(value as number);
                  return value;
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="focusTime"
                name="Tempo Focado"
                stroke="#7c3aed"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="completedTasks"
                name="Tarefas Concluídas"
                stroke="#06b6d4"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductivityTrends;
