import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, MessagesSquare, Salad, BrainCircuit, Utensils, Sparkles, ChevronDown } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user } = useSupabaseAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();

  // Features list for the landing page
  const features = [
    {
      icon: <BrainCircuit className="h-12 w-12 text-primary" />,
      title: "AI-Powered Nutrition Insights",
      description: "Get personalized nutrition advice tailored to your specific needs and goals from our advanced AI."
    },
    {
      icon: <Salad className="h-12 w-12 text-primary" />,
      title: "Personalized Meal Plans",
      description: "Receive customized meal plans based on your dietary restrictions, health goals, and food preferences."
    },
    {
      icon: <Utensils className="h-12 w-12 text-primary" />,
      title: "Food Tracking Made Easy",
      description: "Easily log your meals and track your nutrition with our intuitive food tracking system."
    },
    {
      icon: <Sparkles className="h-12 w-12 text-primary" />,
      title: "Smart Recipe Suggestions",
      description: "Discover new recipes tailored to your dietary preferences and nutritional requirements."
    }
  ];

  // If user is logged in, show the chat interface
  if (user) {
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
  }

  // Otherwise, show the landing page
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-16 pb-24 md:py-32 container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AI-Powered Nutrition Assistant
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Your Personal <span className="text-primary">Nutrition Guide</span> Powered by AI
            </h1>
            
            <p className="text-lg text-muted-foreground">
              Get personalized nutrition advice, meal plans, and food tracking with NutriGuide's intelligent chatbot assistant.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button 
                size="lg" 
                onClick={() => {
                  setActiveTab('signup');
                  setShowAuthModal(true);
                }}
                className="rounded-full"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  setActiveTab('signin');
                  setShowAuthModal(true);
                }}
                className="rounded-full"
              >
                Login
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-square max-w-md mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl" />
            <div className="relative h-full w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl">
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessagesSquare className="h-5 w-5 text-primary" />
                    <span className="font-medium">NutriGuide Chat</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <p className="text-sm">Hello! I'm your NutriGuide. How can I help with your nutrition today?</p>
                  </div>
                  
                  <div className="bg-primary/10 text-primary-foreground p-3 rounded-lg rounded-tr-none max-w-[80%] self-end">
                    <p className="text-sm">I want to build a healthy meal plan for weight loss.</p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <p className="text-sm">Great goal! I'll create a personalized meal plan based on your preferences. What foods do you enjoy eating?</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="flex justify-center mt-16">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="animate-bounce"
          >
            <Button variant="ghost" size="icon" onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <ChevronDown className="h-6 w-6" />
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Smart Nutrition Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              NutriGuide combines AI intelligence with nutrition science to provide you with personalized guidance.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 p-3 bg-primary/10 rounded-lg inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 md:p-12 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-xl rounded-3xl" />
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your nutrition?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of users who have improved their eating habits and health with NutriGuide's personalized approach.
              </p>
              <Button 
                size="lg" 
                onClick={() => {
                  setActiveTab('signup');
                  setShowAuthModal(true);
                }}
                className="rounded-full"
              >
                Create Your Free Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/20 dark:border-slate-800/20 backdrop-blur-sm">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="NutriGuide Logo" className="h-8 w-8" />
              <span className="font-semibold">NutriGuide</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              NutriGuide provides general nutritional information; for personalized advice, please consult a registered nutritionist or medical professional.
            </p>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary/50"></span>
              <span>© {new Date().getFullYear()} NutriGuide</span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default Index;
