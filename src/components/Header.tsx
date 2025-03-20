
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User } from 'lucide-react';
import SidePanel from './SidePanel';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const Header: React.FC = () => {
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex" onClick={() => navigate('/')}>
          <a className="mr-6 flex items-center space-x-2 cursor-pointer">
            <img src="/logo.svg" alt="NutriGuide" className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">NutriGuide</span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <a 
              className={`transition-colors hover:text-foreground/80 ${location.pathname === '/' ? 'text-foreground' : 'text-foreground/60'}`} 
              href="/"
            >
              Chat
            </a>
            <a 
              className={`transition-colors hover:text-foreground/80 ${location.pathname === '/meal-tracker' ? 'text-foreground' : 'text-foreground/60'}`} 
              href="/meal-tracker"
            >
              Meal Tracker
            </a>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <a className="flex items-center space-x-2" href="/">
              <img src="/logo.svg" alt="NutriGuide" className="h-6 w-6" />
              <span className="font-bold">NutriGuide</span>
            </a>
            <nav className="flex flex-col gap-4 mt-6">
              <a 
                className={`text-sm font-medium transition-colors hover:text-foreground/80 ${location.pathname === '/' ? 'text-foreground' : 'text-foreground/60'}`} 
                href="/"
              >
                Chat
              </a>
              <a 
                className={`text-sm font-medium transition-colors hover:text-foreground/80 ${location.pathname === '/meal-tracker' ? 'text-foreground' : 'text-foreground/60'}`} 
                href="/meal-tracker"
              >
                Meal Tracker
              </a>
            </nav>
          </SheetContent>
        </Sheet>
        <a className="mr-6 flex items-center space-x-2 md:hidden" href="/">
          <img src="/logo.svg" alt="NutriGuide" className="h-6 w-6" />
          <span className="font-bold">NutriGuide</span>
        </a>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidePanelOpen(true)}
            className={`rounded-full ${user ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
          >
            <User className="h-5 w-5" />
            <span className="sr-only">User profile</span>
          </Button>
        </div>
      </div>
      <SidePanel isOpen={sidePanelOpen} onClose={() => setSidePanelOpen(false)} />
    </header>
  );
};

export default Header;
