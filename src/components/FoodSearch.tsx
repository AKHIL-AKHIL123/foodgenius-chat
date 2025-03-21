
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Search, Plus } from 'lucide-react';
import { useNutrition } from '@/hooks/useNutrition';
import { FoodItem } from '@/types/nutrition';

interface FoodSearchProps {
  onFoodSelect?: (food: FoodItem) => void;
  placeholder?: string;
  showAddButton?: boolean;
  className?: string;
}

const FoodSearch: React.FC<FoodSearchProps> = ({ 
  onFoodSelect, 
  placeholder = "Search for foods...",
  showAddButton = true,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resultsVisible, setResultsVisible] = useState(false);
  
  const { useSearchFood } = useNutrition();
  const { data: searchResults, isLoading } = useSearchFood(searchQuery);
  
  const handleSelect = (food: FoodItem) => {
    if (onFoodSelect) {
      onFoodSelect(food);
    }
    setSearchQuery('');
    setResultsVisible(false);
  };
  
  return (
    <div className={className}>
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.length > 0) {
              setResultsVisible(true);
            } else {
              setResultsVisible(false);
            }
          }}
          onFocus={() => searchQuery.length > 0 && setResultsVisible(true)}
          className="w-full"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-muted-foreground" />
          ) : (
            <Search size={16} className="text-muted-foreground" />
          )}
        </div>
        
        {resultsVisible && searchQuery.trim().length > 0 && (
          <Card className="absolute w-full mt-1 z-10 max-h-60 overflow-y-auto">
            <CardContent className="p-0">
              {searchResults?.data && searchResults.data.length > 0 ? (
                <ul className="divide-y">
                  {searchResults.data.map((food) => (
                    <li 
                      key={food.id} 
                      className="p-2.5 hover:bg-muted flex justify-between items-center cursor-pointer"
                      onClick={() => handleSelect(food)}
                    >
                      <div>
                        <p className="text-sm font-medium">{food.name}</p>
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          <span>{food.nutritionInfo.calories} cal</span>
                          <span>•</span>
                          <span>P: {food.nutritionInfo.protein}g</span>
                          <span>•</span>
                          <span>C: {food.nutritionInfo.carbs}g</span>
                        </div>
                      </div>
                      {showAddButton && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(food);
                          }}
                          className="h-7 w-7 p-0"
                        >
                          <Plus size={14} />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? 'Searching...' : 'No foods found'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FoodSearch;
