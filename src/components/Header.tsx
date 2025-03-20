
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-10 py-3 glass border-b border-slate-200/20 dark:border-slate-800/20 shadow-sm",
      className
    )}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2 animate-fade-in">
          <div className="relative group">
            <img 
              src="/logo.svg" 
              alt="NutriGuide Logo" 
              className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" 
            />
            <div className="absolute -inset-1 rounded-full bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-200"></div>
          </div>
          <h1 className="text-xl font-medium text-slate-900 dark:text-white">
            Nutri<span className="text-primary font-semibold">Guide</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-medium border border-emerald-100 dark:border-emerald-900 shadow-sm animate-pulse-subtle">
              Nutrition Assistant
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
