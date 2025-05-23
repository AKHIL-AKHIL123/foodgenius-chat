
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MacroNutrients } from '@/types/nutrition.d';

interface MacroData {
  name: string;
  value: number;
  goal: number;
}

interface MacrosChartProps {
  macroData: MacroData[];
  averages: MacroNutrients;
  macroTargets: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const MacrosChart: React.FC<MacrosChartProps> = ({ 
  macroData = [], 
  averages, 
  macroTargets = { protein: 0, carbs: 0, fat: 0 }
}) => {
  const calculatePercentage = (value: number, goal: number) => {
    if (goal <= 0) return 0;
    return (value / goal) * 100;
  };

  if (macroData.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No macro data available. Start tracking your meals to see macronutrient analysis.
      </div>
    );
  }

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
                const goal = props?.payload?.goal || 0;
                return [`${Math.round(value)}g (${Math.round(calculatePercentage(value, goal))}% of goal)`, name];
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
            <span>{Math.round(macroTargets.protein || 0)}% of calories</span>
            <span>
              {Math.round(
                calculatePercentage(averages.protein, macroData[0]?.goal || 1)
              )}% of goal
            </span>
          </div>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-xs text-muted-foreground">Carbs</div>
          <div className="text-lg font-semibold">
            {Math.round(averages.carbs)}g
          </div>
          <div className="text-xs mt-1 flex justify-between">
            <span>{Math.round(macroTargets.carbs || 0)}% of calories</span>
            <span>
              {Math.round(
                calculatePercentage(averages.carbs, macroData[1]?.goal || 1)
              )}% of goal
            </span>
          </div>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-xs text-muted-foreground">Fat</div>
          <div className="text-lg font-semibold">
            {Math.round(averages.fat)}g
          </div>
          <div className="text-xs mt-1 flex justify-between">
            <span>{Math.round(macroTargets.fat || 0)}% of calories</span>
            <span>
              {Math.round(
                calculatePercentage(averages.fat, macroData[2]?.goal || 1)
              )}% of goal
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
