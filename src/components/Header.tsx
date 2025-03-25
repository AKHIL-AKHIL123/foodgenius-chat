import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from '@/hooks/use-toast';

const Header: React.FC = () => {
  const { session, signOut } = useSupabaseAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold">
          NutriGuide
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Dashboard
          </Link>
          <Link to="/meal-tracker" className="text-sm font-medium hover:text-primary">
            Meal Tracker
          </Link>
          <Link to="/preferences" className="text-sm font-medium hover:text-primary">
            Preferences
          </Link>
          
          {session ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.user_metadata.avatar_url} />
                <AvatarFallback>{session.user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/auth" className="text-sm font-medium hover:text-primary">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
