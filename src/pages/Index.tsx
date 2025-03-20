
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
      
      <footer className="py-4 text-xs text-center text-muted-foreground">
        <div className="container">
          <p>NutriGuide provides general nutritional information; for personalized advice, please consult a registered nutritionist or medical professional.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
