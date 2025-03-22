
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthForm from '@/components/AuthForm';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'signin' | 'signup';
  setActiveTab: (tab: 'signin' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const handleSwitchMode = () => {
    setActiveTab(activeTab === 'signin' ? 'signup' : 'signin');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md p-0 gap-0 bg-transparent border-none shadow-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-lg shadow-xl overflow-hidden"
            >
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')}>
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b dark:border-slate-700">
                  <TabsList className="grid w-full grid-cols-2 relative z-10">
                    <TabsTrigger value="signin" className="text-sm md:text-base">Sign In</TabsTrigger>
                    <TabsTrigger value="signup" className="text-sm md:text-base">Sign Up</TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="p-6">
                  <TabsContent value="signin" className="mt-0">
                    <div className="space-y-4 py-2">
                      <div className="space-y-2 text-center">
                        <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
                        <p className="text-sm text-muted-foreground">
                          Enter your credentials to sign in to your account
                        </p>
                      </div>
                      <AuthForm 
                        isSignUp={false} 
                        onSuccess={onClose} 
                        onSwitchMode={handleSwitchMode}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="mt-0">
                    <div className="space-y-4 py-2">
                      <div className="space-y-2 text-center">
                        <h2 className="text-2xl font-semibold tracking-tight">Create an account</h2>
                        <p className="text-sm text-muted-foreground">
                          Enter your details to create your NutriGuide account
                        </p>
                      </div>
                      <AuthForm 
                        isSignUp={true} 
                        onSuccess={onClose} 
                        onSwitchMode={handleSwitchMode}
                      />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
