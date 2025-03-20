
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import UserDashboard from './UserDashboard';
import { X, LogIn, LogOut, User } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import AuthForm from './AuthForm';
import { useToast } from '@/hooks/use-toast';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose }) => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const { user, signOut } = useSupabaseAuth();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    setShowAuthForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl transition-transform overflow-y-auto
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-background p-4 border-b">
          <h2 className="text-lg font-semibold">Your Nutrition Profile</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8 hover:bg-muted"
          >
            <X size={18} />
          </Button>
        </div>
        
        {user ? (
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between bg-muted rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Logged in</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="flex items-center gap-1"
              >
                <LogOut size={14} />
                Sign Out
              </Button>
            </div>
            <UserDashboard />
          </div>
        ) : showAuthForm ? (
          <div className="p-4">
            <AuthForm />
            <Button
              variant="ghost"
              className="mt-4 w-full"
              onClick={() => setShowAuthForm(false)}
            >
              Skip login for now
            </Button>
          </div>
        ) : (
          <div className="p-4">
            <div className="mb-4 bg-muted rounded-lg p-4 text-center">
              <h3 className="font-medium mb-2">Sign in to save your preferences</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create an account to save your nutrition preferences, meal plans and track your progress.
              </p>
              <Button 
                onClick={() => setShowAuthForm(true)}
                className="flex items-center gap-1"
              >
                <LogIn size={16} />
                Sign In / Create Account
              </Button>
            </div>
            <UserDashboard />
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
