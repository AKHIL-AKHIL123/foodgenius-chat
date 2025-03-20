import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import MessageBubble from './MessageBubble';
import { Message, sampleFoods, welcomeMessage } from '@/utils/sampleData';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isProcessing) return;

    const userMessage: Message = {
      id: uuidv4(),
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate response delay (in a real app, this would be an API call)
    setTimeout(() => {
      handleBotResponse(userMessage.text);
    }, 1000);
  };

  const handleBotResponse = (userInput: string) => {
    // Simple keyword-based matching for demo purposes
    const userInputLower = userInput.toLowerCase();
    let botResponse: Message = {
      id: uuidv4(),
      sender: 'bot',
      text: "I'm sorry, I don't have specific information about that food item yet. Try asking about bananas, apples, chicken, broccoli, or salmon!",
      timestamp: new Date(),
    };

    // Check against sample foods
    const foodMatches = Object.values(sampleFoods).filter(food => 
      userInputLower.includes(food.name.toLowerCase())
    );

    if (foodMatches.length > 0) {
      const matchedFood = foodMatches[0];
      
      botResponse.text = `Here's the nutritional information for ${matchedFood.name}. ${matchedFood.name} contains ${matchedFood.calories} calories per serving, with ${matchedFood.macros.protein}g of protein, ${matchedFood.macros.carbs}g of carbs, and ${matchedFood.macros.fat}g of fat. It's particularly rich in ${matchedFood.nutrients[0].name} and ${matchedFood.nutrients[1].name}. ${matchedFood.benefits[0]}. To create a balanced meal, consider pairing it with a source of ${matchedFood.macros.protein < 5 ? 'protein' : matchedFood.macros.carbs < 5 ? 'healthy carbs' : 'vegetables'}.`;
      
      botResponse.foodData = matchedFood;
    } else if (userInputLower.includes('hello') || userInputLower.includes('hi')) {
      botResponse.text = "Hello! I'm NutriGuide, your nutrition assistant. How can I help you today? You can ask me about nutrition information for various foods like bananas, apples, chicken, broccoli, or salmon.";
    } else if (userInputLower.includes('thank')) {
      botResponse.text = "You're welcome! If you have any other nutrition questions, feel free to ask. I'm here to help!";
    } else if (userInputLower.includes('help')) {
      botResponse.text = "I can provide nutritional information for various foods, suggest food combinations for balanced meals, and offer general nutrition tips. Try asking about specific foods like 'What nutrients are in bananas?' or 'Tell me about salmon nutrition.'";
    }

    setMessages(prev => [...prev, botResponse]);
    setIsProcessing(false);
  };

  const clearChatHistory = () => {
    setMessages([welcomeMessage]);
  };

  return (
    <div className={cn(
      "flex flex-col h-full w-full max-w-3xl mx-auto",
      className
    )}>
      <div className="flex justify-between items-center mb-2 pt-16 px-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearChatHistory}
                className="text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 size={16} className="mr-1" />
                <span className="text-xs">Clear chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear the current conversation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-xs text-muted-foreground">
                <Info size={14} className="mr-1" />
                <span>Sample foods: banana, apple, chicken, broccoli, salmon</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Try asking about these foods for a demonstration</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex-1 overflow-y-auto py-1 px-4 hide-scrollbar">
        <div className="space-y-4 pb-20">
          {messages.map((message, index) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              isLast={index === messages.length - 1}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="sticky bottom-0 left-0 right-0 p-4">
        <form 
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-lg flex items-center p-2 gap-2 max-w-3xl mx-auto animate-fade-up"
        >
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ask about any food (e.g., 'Tell me about bananas')"
            className="flex-1 py-2 px-3 bg-transparent border-none outline-none text-sm"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing || inputValue.trim() === ''}
            className={cn(
              "rounded-full w-8 h-8 flex items-center justify-center transition-all",
              (isProcessing || inputValue.trim() === '') 
                ? "bg-slate-100 text-slate-400 dark:bg-slate-800" 
                : "bg-primary text-white hover:bg-primary/90 hover:scale-105 transition-transform"
            )}
          >
            {isProcessing ? (
              <div className="typing-indicator flex items-center justify-center">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
