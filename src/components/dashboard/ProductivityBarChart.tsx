
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyProductivity } from '@/contexts/analytics/analyticsTypes';
import { formatMinutes } from '@/utils/timeUtils';

interface ProductivityBarChartProps {
  data: DailyProductivity[];
}

const ProductivityBarChart: React.FC<ProductivityBarChartProps> = ({ data }) => {
  // Converter segundos para minutos para exibição
  const chartData = data.map(item => ({
    ...item,
    totalFocusTimeMinutes: Math.round(item.totalFocusTime / 60),
    formattedDate: new Date(item.date).toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit',
      month: 'short'
    })
  }));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Tempo Focado por Dia</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedDate" 
                angle={-45} 
                textAnchor="end" 
                height={80}
              />
              <YAxis 
                tickFormatter={(value) => formatMinutes(value)} 
              />
              <Tooltip 
                formatter={(value: number) => [formatMinutes(value), 'Tempo Focado']}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Bar 
                dataKey="totalFocusTimeMinutes" 
                name="Tempo Focado" 
                fill="#7c3aed" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductivityBarChart;
