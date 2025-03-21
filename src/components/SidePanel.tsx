
import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { X, LogOut, UserCircle, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AuthForm from './AuthForm';
import { motion, AnimatePresence } from 'framer-motion';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose }) => {
  const { user, signOut } = useSupabaseAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully"
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white dark:bg-slate-900 z-50 shadow-lg overflow-y-auto"
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-slate-800">
              <h2 className="text-xl font-semibold">
                {user ? 'Account' : 'Sign In / Sign Up'}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              {user ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center space-y-2 p-6 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <UserCircle className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-medium mt-4">{user.email}</h3>
                    <p className="text-sm text-muted-foreground">Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}</p>
                  </div>

                  <div className="space-y-4">
                    <Button variant="outline" size="lg" className="w-full justify-start" disabled>
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      size="lg"
                      className="w-full"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex space-x-4 mb-6">
                    <Button 
                      variant={activeTab === 'signin' ? 'default' : 'outline'} 
                      className="flex-1"
                      onClick={() => setActiveTab('signin')}
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant={activeTab === 'signup' ? 'default' : 'outline'} 
                      className="flex-1"
                      onClick={() => setActiveTab('signup')}
                    >
                      Sign Up
                    </Button>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === 'signin' ? (
                        <div className="space-y-4">
                          <div className="text-center space-y-2">
                            <h3 className="text-xl font-medium">Welcome back</h3>
                            <p className="text-sm text-muted-foreground">Sign in to your NutriGuide account</p>
                          </div>
                          <AuthForm isSignUp={false} onSuccess={onClose} />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="text-center space-y-2">
                            <h3 className="text-xl font-medium">Create an account</h3>
                            <p className="text-sm text-muted-foreground">Join NutriGuide and start your nutrition journey</p>
                          </div>
                          <AuthForm isSignUp={true} onSuccess={onClose} />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidePanel;
