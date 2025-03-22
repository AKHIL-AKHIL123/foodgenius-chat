
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { AlertCircle, Loader2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { isSupabaseAuthConfigured } from '@/lib/supabase';
import { Alert, AlertDescription } from './ui/alert';

interface AuthFormProps {
  isSignUp: boolean;
  onSuccess?: () => void;
  onSwitchMode?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isSignUp, onSuccess, onSwitchMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, signUp } = useSupabaseAuth();
  const { toast } = useToast();
  const isConfigured = isSupabaseAuthConfigured();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConfigured) {
      setErrorMessage("Authentication is not available. Supabase credentials are not configured.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isSignUp) {
        // Sign up with email password
        const { error } = await signUp(email, password);
        
        if (error) {
          setErrorMessage(error.message);
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sign up successful",
            description: "Your account has been created successfully.",
          });
          if (onSwitchMode) onSwitchMode(); // Switch to sign in mode
        }
      } else {
        // Sign in with email password
        const { error } = await signIn(email, password);
        
        if (error) {
          setErrorMessage(error.message);
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Signed in successfully",
            description: "Welcome back to NutriGuide!",
          });
          if (onSuccess) onSuccess();
        }
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Authentication is not available. Supabase credentials are not configured.
          </AlertDescription>
        </Alert>
        <p className="text-sm text-muted-foreground text-center">
          To enable authentication, please connect this project to Supabase.
        </p>
      </div>
    );
  }

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit} 
      className="space-y-4"
    >
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input 
          id="email" 
          type="email" 
          value={email}
          onChange={handleEmailChange}
          required
          placeholder="your.email@example.com"
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <div className="relative">
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            required 
            placeholder="********"
            minLength={6}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 pr-10"
          />
          <Button
            type="button"
            variant="ghost" 
            size="icon"
            className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
        {isSignUp && (
          <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
        )}
      </div>
      
      {errorMessage && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-sm text-red-500 flex items-center gap-2 bg-red-50 dark:bg-red-950/30 p-2 rounded"
        >
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </motion.div>
      )}
      
      <Button 
        type="submit" 
        className="w-full transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isSignUp ? 'Creating account...' : 'Signing in...'}
          </>
        ) : (
          isSignUp ? 'Create Account' : 'Sign In'
        )}
      </Button>
      
      <div className="text-center">
        <button 
          type="button" 
          onClick={onSwitchMode}
          className="text-sm text-primary hover:text-primary/80 hover:underline focus:outline-none"
        >
          {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
        </button>
      </div>
    </motion.form>
  );
};

export default AuthForm;
