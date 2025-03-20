
import React from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex flex-col">
      <Header />
      
      <main className="flex-1 container py-4 flex flex-col">
        <ChatInterface />
      </main>
      
      <footer className="py-4 border-t border-slate-200/20 dark:border-slate-800/20 backdrop-blur-sm">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-xs text-center md:text-left text-muted-foreground">
              NutriGuide provides general nutritional information; for personalized advice, please consult a registered nutritionist or medical professional.
            </p>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary/50"></span>
              <span>AI-powered nutrition assistant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
