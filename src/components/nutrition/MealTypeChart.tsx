
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MealTypeData {
  name: string;
  calories: number;
  count: number;
}

interface MealTypeChartProps {
  mealTypeData: MealTypeData[];
}

export const MealTypeChart: React.FC<MealTypeChartProps> = ({ mealTypeData }) => {
  return (
    <>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mealTypeData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`${value} calories`, 'Avg. Calories']}
            />
            <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {mealTypeData.map((meal) => (
          <div key={meal.name} className="bg-muted/50 p-3 rounded-lg">
            <div className="text-xs text-muted-foreground">{meal.name}</div>
            <div className="text-lg font-semibold">
              {meal.calories} cal
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {meal.count} meals logged
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
