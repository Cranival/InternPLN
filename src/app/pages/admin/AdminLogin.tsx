import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAdmin } from '../../contexts/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin, isAdminAuthenticated } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (isAdminAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = adminLogin(username, password);
    
    if (success) {
      toast.success('Login berhasil!');
      navigate('/admin/dashboard');
    } else {
      setError('Username atau password salah');
      toast.error('Login gagal!');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100">
            <Shield className="size-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <p className="text-sm text-gray-600">
            Masuk untuk mengelola sistem PLN Intern
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="size-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4 text-gray-500" />
                  ) : (
                    <Eye className="size-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Login Admin'}
            </Button>

            <div className="mt-4 rounded-lg bg-gray-50 dark:bg-slate-800 p-3 text-center text-xs text-gray-600 dark:text-gray-300">
              <p className="font-medium">Demo Credentials:</p>
              <p>Username: <code className="rounded bg-gray-200 dark:bg-slate-700 px-1">admin</code></p>
              <p>Password: <code className="rounded bg-gray-200 dark:bg-slate-700 px-1">admin123</code></p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
