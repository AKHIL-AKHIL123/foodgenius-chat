
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { signIn, signUp } = useSupabaseAuth();
  const { toast } = useToast();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
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
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
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
          description: "Please check your email to confirm your account.",
        });
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">NutriGuide Account</CardTitle>
        <CardDescription>
          Sign in or create an account to save your preferences and meal plans
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={handleEmailChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required 
                  placeholder="********"
                />
              </div>
              
              {errorMessage && (
                <div className="text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-sm font-medium">Email</label>
                <Input 
                  id="signup-email" 
                  type="email" 
                  value={email}
                  onChange={handleEmailChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="signup-password" className="text-sm font-medium">Password</label>
                <Input 
                  id="signup-password" 
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required 
                  placeholder="********"
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
              </div>
              
              {errorMessage && (
                <div className="text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        {activeTab === 'signin' 
          ? "Don't have an account? Sign up to save your nutrition data." 
          : "Already have an account? Sign in to access your data."}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
