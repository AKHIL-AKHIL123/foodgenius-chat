
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DailyData {
  date: string;
  fullDate: Date;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  goal: number;
}

interface TrendsChartProps {
  dailyData: DailyData[];
  recommendations?: string[];
}

export const TrendsChart: React.FC<TrendsChartProps> = ({ 
  dailyData, 
  recommendations = [] 
}) => {
  // Assuming we want to show a trend of macronutrient ratios over time
  const ratioData = dailyData.map(day => {
    const totalGrams = day.protein + day.carbs + day.fat;
    return {
      date: day.date,
      proteinRatio: totalGrams ? (day.protein / totalGrams) * 100 : 0,
      carbsRatio: totalGrams ? (day.carbs / totalGrams) * 100 : 0,
      fatRatio: totalGrams ? (day.fat / totalGrams) * 100 : 0,
    };
  });

  return (
    <>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={ratioData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="date" />
            <YAxis>
              <Label 
                value="% of total macros" 
                angle={-90} 
                position="insideLeft" 
                style={{ textAnchor: 'middle', fontSize: 12 }} 
              />
            </YAxis>
            <Tooltip 
              formatter={(value: number) => [`${Math.round(value)}%`, '']}
            />
            <Line 
              type="monotone" 
              dataKey="proteinRatio" 
              name="Protein" 
              stroke="#7c3aed" 
              strokeWidth={2} 
              dot={{ r: 3 }} 
            />
            <Line 
              type="monotone" 
              dataKey="carbsRatio" 
              name="Carbs" 
              stroke="#2563eb" 
              strokeWidth={2} 
              dot={{ r: 3 }} 
            />
            <Line 
              type="monotone" 
              dataKey="fatRatio" 
              name="Fat" 
              stroke="#f59e0b" 
              strokeWidth={2} 
              dot={{ r: 3 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {recommendations && recommendations.length > 0 && (
        <Card className="mt-4 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recommendations</CardTitle>
            <CardDescription>Based on your nutrition data</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
};
