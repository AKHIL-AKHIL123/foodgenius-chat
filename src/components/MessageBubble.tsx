
import React from 'react';
import { cn } from '@/lib/utils';
import FoodCard from './FoodCard';
import MealPlanCard from './MealPlanCard';
import { Message } from '@/utils/sampleData';
import { useTypingEffect } from '@/utils/animations';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageBubbleProps {
  message: Message;
  animate?: boolean;
  isLast?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  animate = true,
  isLast = false
}) => {
  const isUser = message.sender === 'user';
  const { displayedText, isTyping } = useTypingEffect(
    message.text,
    isLast && !isUser ? 15 : 0
  );
  const { toast } = useToast();

  const handleAddMealPlanToDay = () => {
    if (message.mealPlan) {
      toast({
        title: "Meal Plan Added",
        description: `${message.mealPlan.name} has been added to your meal plan for today.`
      });
    }
  };

  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start",
      animate && "animate-fade-up",
      isUser ? "animate-slide-in-right" : "animate-slide-in-left"
    )}>
      <div className={cn(
        "max-w-[85%] md:max-w-[75%]",
        !isUser && (message.foodData || message.mealPlan) && "w-full"
      )}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1 ml-1">
            <div className="flex justify-center items-center w-6 h-6 rounded-full bg-primary/10 text-primary">
              <img src="/logo.svg" alt="NutriGuide" className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">NutriGuide</span>
          </div>
        )}
        
        <div className={cn(
          "rounded-2xl px-4 py-3 break-words text-pretty leading-relaxed transition-all",
          isUser
            ? "bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(40,177,132,0.15)]"
            : "bg-muted/50 backdrop-blur-xs border border-slate-200/50 dark:border-slate-800/50 text-foreground shadow-sm hover:shadow-md",
          "transform hover:scale-[1.01] transition-all duration-200"
        )}>
          {isLast && !isUser ? displayedText : message.text}
          
          {isLast && !isUser && isTyping && (
            <div className="typing-indicator inline-block ml-1">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>

        {message.foodData && (
          <div className="mt-3 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <FoodCard food={message.foodData} />
          </div>
        )}

        {message.mealPlan && (
          <div className="mt-3 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="space-y-2">
              <MealPlanCard mealPlan={message.mealPlan} />
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={handleAddMealPlanToDay}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add to Today's Meals
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
