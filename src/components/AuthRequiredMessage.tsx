
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { LockKeyhole, LogIn } from 'lucide-react';

interface AuthRequiredMessageProps {
  title?: string;
  description?: string;
  showLoginButton?: boolean;
  className?: string;
}

const AuthRequiredMessage: React.FC<AuthRequiredMessageProps> = ({
  title = "Authentication Required",
  description = "You need to be signed in to access this feature.",
  showLoginButton = true,
  className = ""
}) => {
  const { signIn } = useSupabaseAuth();
  
  const handleSignIn = () => {
    // You can implement modal opening or redirect to login page
    // For now, we'll just log it
    console.log('User wants to sign in');
  };
  
  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
          <LockKeyhole className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center">
          Sign in to track your nutrition, customize your preferences, and get personalized insights.
        </p>
      </CardContent>
      {showLoginButton && (
        <CardFooter className="flex justify-center">
          <Button onClick={handleSignIn} className="gap-2">
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AuthRequiredMessage;
