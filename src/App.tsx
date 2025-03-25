
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";

import Index from './pages/Index';
import MealTracker from './pages/MealTracker';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import UserPreferences from './pages/UserPreferences';

function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <SupabaseAuthProvider>
        <UserPreferencesProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto py-6">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/meal-tracker" element={<MealTracker />} />
                    <Route path="/preferences" element={<UserPreferences />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Toaster />
              </div>
            </ThemeProvider>
          </QueryClientProvider>
        </UserPreferencesProvider>
      </SupabaseAuthProvider>
    </BrowserRouter>
  );
}

export default App;
