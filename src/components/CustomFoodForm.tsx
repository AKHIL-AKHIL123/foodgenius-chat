
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus } from 'lucide-react';
import { useNutrition } from '@/hooks/useNutrition';
import { FoodItem } from '@/types/nutrition';
import { useToast } from '@/hooks/use-toast';

interface CustomFoodFormProps {
  onFoodAdded?: (food: FoodItem) => void;
  className?: string;
}

const CustomFoodForm: React.FC<CustomFoodFormProps> = ({ onFoodAdded, className }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('general');
  const [servingSize, setServingSize] = useState('100g');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [fiber, setFiber] = useState('');
  const [sugar, setSugar] = useState('');
  
  const { useAddFoodItem } = useNutrition();
  const { mutate: addFoodItem, isPending } = useAddFoodItem();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !calories.trim() || !protein.trim() || !carbs.trim() || !fat.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const newFood: Omit<FoodItem, 'id'> = {
      name: name.trim(),
      category,
      nutritionInfo: {
        calories: parseFloat(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fat: parseFloat(fat),
        servingSize,
        fiber: fiber ? parseFloat(fiber) : undefined,
        sugar: sugar ? parseFloat(sugar) : undefined
      }
    };
    
    addFoodItem(newFood, {
      onSuccess: (data) => {
        if (data.success && data.data && onFoodAdded) {
          onFoodAdded(data.data);
        }
        
        // Reset form
        setName('');
        setCategory('general');
        setServingSize('100g');
        setCalories('');
        setProtein('');
        setCarbs('');
        setFat('');
        setFiber('');
        setSugar('');
        
        toast({
          title: "Food added successfully",
          description: `${name} has been added to your custom foods`
        });
      }
    });
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Add Custom Food</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="custom-food-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="food-name">Food Name</Label>
            <Input
              id="food-name"
              placeholder="e.g., Homemade Granola"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="food-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="food-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="fruit">Fruit</SelectItem>
                  <SelectItem value="vegetable">Vegetable</SelectItem>
                  <SelectItem value="protein">Protein</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="grain">Grain</SelectItem>
                  <SelectItem value="beverage">Beverage</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                  <SelectItem value="dessert">Dessert</SelectItem>
                  <SelectItem value="sauce">Sauce/Condiment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serving-size">Serving Size</Label>
              <Input
                id="serving-size"
                placeholder="e.g., 100g, 1 cup"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              type="number"
              placeholder="Calories per serving"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                step="0.1"
                placeholder="Protein"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                step="0.1"
                placeholder="Carbs"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                step="0.1"
                placeholder="Fat"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fiber">Fiber (g)</Label>
              <Input
                id="fiber"
                type="number"
                step="0.1"
                placeholder="Optional"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sugar">Sugar (g)</Label>
              <Input
                id="sugar"
                type="number"
                step="0.1"
                placeholder="Optional"
                value={sugar}
                onChange={(e) => setSugar(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          form="custom-food-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Food
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CustomFoodForm;
