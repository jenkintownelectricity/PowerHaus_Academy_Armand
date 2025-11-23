import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FlaskConical } from 'lucide-react';
import { Link } from 'wouter';

export default function Login() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Get the redirect URL from query params or sessionStorage
  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get('redirect') || sessionStorage.getItem('redirectAfterLogin') || null;

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        // Handle both JSON and plain text error responses
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await res.json();
          throw new Error(error.error || 'Login failed');
        } else {
          const textError = await res.text();
          throw new Error(textError || 'Server error - please check your deployment');
        }
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);

      // Clear the saved redirect
      sessionStorage.removeItem('redirectAfterLogin');

      // Redirect to intended page or default based on role
      if (redirectTo) {
        setLocation(redirectTo);
      } else if (data.user.role === 'admin') {
        setLocation('/admin');
      } else if (data.user.role === 'teacher') {
        setLocation('/teacher');
      } else {
        setLocation('/');
      }
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <FlaskConical className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-3xl">Welcome Back</CardTitle>
            <CardDescription className="text-base mt-2">
              Sign in to your SPU LMS account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register">
                <a className="text-primary hover:underline font-medium">
                  Sign up
                </a>
              </Link>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-center text-muted-foreground">
                Demo: Use <strong>john.doe@example.com</strong> / <strong>password123</strong>
              </p>
              <p className="text-xs text-center text-muted-foreground mt-1">
                Admin: <strong>admin@spulms.com</strong> / <strong>admin123</strong>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
