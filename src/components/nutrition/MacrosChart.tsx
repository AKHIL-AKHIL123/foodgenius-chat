
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MacroData {
  name: string;
  value: number;
  goal: number;
}

interface MacrosChartProps {
  macroData: MacroData[];
  averages: {
    protein: number; // Explicitly required
    carbs: number;   // Explicitly required
    fat: number;     // Explicitly required
  };
  macroTargets: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const MacrosChart: React.FC<MacrosChartProps> = ({ 
  macroData, 
  averages, 
  macroTargets
}) => {
  const calculatePercentage = (value: number, goal: number) => {
    if (goal <= 0) return 0;
    return (value / goal) * 100;
  };

  return (
    <>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={macroData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" />
            <YAxis unit="g" />
            <Tooltip 
              formatter={(value: number, name: string, props: any) => {
                return [`${Math.round(value)}g (${Math.round(calculatePercentage(value, props.payload.goal))}% of goal)`, name];
              }}
            />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-xs text-muted-foreground">Protein</div>
          <div className="text-lg font-semibold">
            {Math.round(averages.protein)}g
          </div>
          <div className="text-xs mt-1 flex justify-between">
            <span>{Math.round(macroTargets.protein)}% of calories</span>
            <span>{Math.round(calculatePercentage(averages.protein, macroData[0].goal))}% of goal</span>
          </div>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-xs text-muted-foreground">Carbs</div>
          <div className="text-lg font-semibold">
            {Math.round(averages.carbs)}g
          </div>
          <div className="text-xs mt-1 flex justify-between">
            <span>{Math.round(macroTargets.carbs)}% of calories</span>
            <span>{Math.round(calculatePercentage(averages.carbs, macroData[1].goal))}% of goal</span>
          </div>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-xs text-muted-foreground">Fat</div>
          <div className="text-lg font-semibold">
            {Math.round(averages.fat)}g
          </div>
          <div className="text-xs mt-1 flex justify-between">
            <span>{Math.round(macroTargets.fat)}% of calories</span>
            <span>{Math.round(calculatePercentage(averages.fat, macroData[2].goal))}% of goal</span>
          </div>
        </div>
      </div>
    </>
  );
};
