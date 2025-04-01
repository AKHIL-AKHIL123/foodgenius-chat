
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MenuIcon, X } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import AuthModal from './AuthModal';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const { user, signOut } = useSupabaseAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeAuthTab, setActiveAuthTab] = useState<'signin' | 'signup'>('signin');
  const location = useLocation();
  const isMobile = useIsMobile();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSignOut = async () => {
    await signOut();
    closeMenu();
  };

  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : 'NG';

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <img src="/logo.svg" alt="NutriGuide Logo" className="h-8 w-8" />
            <span className="text-xl font-bold">NutriGuide</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          {user && (
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Dashboard
            </Link>
          )}
          <Link 
            to="/meal-tracker" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/meal-tracker' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Meal Tracker
          </Link>
          <Link 
            to="/preferences" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/preferences' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Preferences
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url || ''} alt={user.email || 'User'} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="font-medium text-sm">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" onClick={() => setShowAuthModal(true)}>
              Sign In
            </Button>
          )}
        </nav>
        
        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          {isMenuOpen ? (
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              <X className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              <MenuIcon className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && isMobile && (
        <div className="md:hidden p-4 pt-0 bg-background border-b border-border">
          <nav className="flex flex-col space-y-4 py-2">
            <Link 
              to="/"
              onClick={closeMenu}
              className={`px-2 py-1 ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Home
            </Link>
            {user && (
              <Link 
                to="/dashboard"
                onClick={closeMenu}
                className={`px-2 py-1 ${location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Dashboard
              </Link>
            )}
            <Link 
              to="/meal-tracker"
              onClick={closeMenu}
              className={`px-2 py-1 ${location.pathname === '/meal-tracker' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Meal Tracker
            </Link>
            <Link 
              to="/preferences"
              onClick={closeMenu}
              className={`px-2 py-1 ${location.pathname === '/preferences' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Preferences
            </Link>
            {user ? (
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-sm font-medium">{user.email}</span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full"
                onClick={() => {
                  closeMenu();
                  setShowAuthModal(true);
                }}
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      )}
      
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          activeTab={activeAuthTab}
          setActiveTab={setActiveAuthTab}
        />
      )}
    </header>
  );
};

export default Header;
