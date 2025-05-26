
"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('hr@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-primary">
            <path d="M12.378 1.602a.75.75 0 00-.756 0L3.366 6.026A.75.75 0 003 6.695V18.75a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V6.695a.75.75 0 00-.366-.669L12.378 1.602zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
          </svg>
        </div>
        <CardTitle className="text-3xl font-bold">HR Glimpse</CardTitle>
        <CardDescription>Sign in to access the HR Dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="hr@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-base"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Login'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        <p>Use hr@example.com / password to login.</p>
      </CardFooter>
    </Card>
  );
}
