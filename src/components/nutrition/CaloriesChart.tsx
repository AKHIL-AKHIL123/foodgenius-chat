
import React from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Legend } from 'recharts';

interface DailyData {
  date: string;
  fullDate: Date;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  goal: number;
}

interface CaloriesChartProps {
  dailyData: DailyData[];
  averageCalories: number;
  calorieGoal: number;
  days: number;
}

export const CaloriesChart: React.FC<CaloriesChartProps> = ({ 
  dailyData = [], 
  averageCalories = 0, 
  calorieGoal = 2000,
  days = 7
}) => {
  if (dailyData.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No calorie data available. Start tracking your meals to see your calorie trends.
      </div>
    );
  }

  // Ensure all days have data for the chart
  const safeData = dailyData.map(day => ({
    ...day,
    calories: day.calories || 0,
    goal: day.goal || calorieGoal
  }));

  const highestDay = Math.max(...safeData.map(day => day.calories || 0));
  const daysOnTrack = safeData.filter(day => 
    day.calories >= calorieGoal * 0.8 && 
    day.calories <= calorieGoal * 1.2
  ).length;

  return (
    <>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={safeData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" />
            <Tooltip 
              formatter={(value: number) => [`${value} calories`, 'Calories']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Bar 
              yAxisId="left" 
              dataKey="calories" 
              fill="hsl(var(--primary))" 
              name="Calories" 
              radius={[4, 4, 0, 0]} 
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="goal" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={2} 
              name="Daily Goal" 
              dot={false} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-xs text-muted-foreground">Average</div>
          <div className="text-lg font-semibold">
            {Math.round(averageCalories)} cal
          </div>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-xs text-muted-foreground">Goal</div>
          <div className="text-lg font-semibold">
            {calorieGoal} cal
          </div>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-xs text-muted-foreground">Highest Day</div>
          <div className="text-lg font-semibold">
            {highestDay} cal
          </div>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-xs text-muted-foreground">Days on Track</div>
          <div className="text-lg font-semibold">
            {daysOnTrack}/{days}
          </div>
        </div>
      </div>
    </>
  );
};
