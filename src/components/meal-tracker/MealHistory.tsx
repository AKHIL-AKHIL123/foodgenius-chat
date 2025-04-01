
import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { MealLog } from '@/types/nutrition';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNutrition } from '@/hooks/useNutrition';
import { useToast } from '@/hooks/use-toast';

interface MealHistoryProps {
  mealLogsData: { data: MealLog[] } | undefined;
  logsLoading: boolean;
  logsError: unknown;
}

export const MealHistory: React.FC<MealHistoryProps> = ({ 
  mealLogsData, 
  logsLoading, 
  logsError 
}) => {
  const [selectedMeal, setSelectedMeal] = useState<MealLog | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  const { useLogMeal } = useNutrition();
  const { mutate: logMeal, isPending: isDeleting } = useLogMeal();
  const { toast } = useToast();
  
  const handleDelete = () => {
    if (!selectedMeal) return;
    
    // In a real app, we would call an API to delete the meal
    // For now, we'll just show a success toast
    setTimeout(() => {
      toast({
        title: "Meal deleted",
        description: `Your ${selectedMeal.mealType} has been deleted.`
      });
      setDeleteDialogOpen(false);
      setSelectedMeal(null);
    }, 500);
  };
  
  if (logsLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }
  
  if (logsError) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error loading meal history</AlertTitle>
        <AlertDescription>
          There was a problem loading your meal history. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!mealLogsData?.data || mealLogsData.data.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No meals logged in the past 30 days
        </p>
      </div>
    );
  }
  
  const mealsByDate = mealLogsData.data.reduce((acc: Record<string, MealLog[]>, meal: MealLog) => {
    const date = format(new Date(meal.date), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(meal);
    return acc;
  }, {});
  
  return (
    <div className="space-y-6">
      {Object.entries(mealsByDate)
        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
        .map(([date, meals]) => (
          <div key={date} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              <h3 className="text-sm font-medium">
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </h3>
            </div>
            
            <div className="pl-3 space-y-2">
              {(meals as MealLog[]).sort((a, b) => {
                const mealOrder = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
                return (mealOrder as any)[a.mealType] - (mealOrder as any)[b.mealType];
              }).map((meal: MealLog) => (
                <div key={meal.id} className="bg-muted/50 rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline" className="capitalize">
                      {meal.mealType}
                    </Badge>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">{Math.round(meal.totalCalories)} cal</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedMeal(meal);
                            setDetailDialogOpen(true);
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            // In a real app, we would navigate to the edit page
                            toast({
                              title: "Edit meal",
                              description: `Editing functionality will be added soon.`
                            });
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={() => {
                              setSelectedMeal(meal);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {meal.foods.map(f => f.name).join(', ')}
                  </div>
                  <div className="mt-2 text-xs flex gap-3">
                    <span>P: {Math.round(meal.totalProtein)}g</span>
                    <span>C: {Math.round(meal.totalCarbs)}g</span>
                    <span>F: {Math.round(meal.totalFat)}g</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      }
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Meal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {selectedMeal?.mealType}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Meal Details Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">{selectedMeal?.mealType} Details</DialogTitle>
            <DialogDescription>
              {selectedMeal && format(new Date(selectedMeal.date), 'EEEE, MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Foods</h4>
              <ul className="space-y-2">
                {selectedMeal?.foods.map((food, index) => (
                  <li key={index} className="text-sm p-2 bg-muted rounded-md">
                    <div className="font-medium">{food.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {food.nutritionInfo.calories} calories | {food.nutritionInfo.servingSize}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-1 text-xs">
                      <div>Protein: {food.nutritionInfo.protein}g</div>
                      <div>Carbs: {food.nutritionInfo.carbs}g</div>
                      <div>Fat: {food.nutritionInfo.fat}g</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-2 border-t">
              <h4 className="text-sm font-medium mb-2">Nutrition Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Total calories: {Math.round(selectedMeal?.totalCalories || 0)}</div>
                <div>Protein: {Math.round(selectedMeal?.totalProtein || 0)}g</div>
                <div>Carbs: {Math.round(selectedMeal?.totalCarbs || 0)}g</div>
                <div>Fat: {Math.round(selectedMeal?.totalFat || 0)}g</div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
