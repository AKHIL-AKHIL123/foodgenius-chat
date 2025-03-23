
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Info } from 'lucide-react';

interface DailyData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface TrendsChartProps {
  dailyData: DailyData[];
  recommendations?: string[];
}

export const TrendsChart: React.FC<TrendsChartProps> = ({ 
  dailyData,
  recommendations = []
}) => {
  return (
    <>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dailyData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="calories" 
              name="Calories" 
              stroke="hsl(var(--primary))" 
              activeDot={{ r: 8 }} 
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="protein" 
              name="Protein (g)" 
              stroke="hsl(var(--destructive))" 
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="carbs" 
              name="Carbs (g)" 
              stroke="hsl(var(--accent-foreground))" 
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="fat" 
              name="Fat (g)" 
              stroke="hsl(var(--muted-foreground))" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {recommendations && recommendations.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Info className="h-4 w-4" />
            Recommendations
          </h3>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-muted-foreground flex gap-2">
                <span>•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
