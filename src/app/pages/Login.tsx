import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { LogIn, Zap, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validasi input
    if (!username.trim()) {
      setError('Username harus diisi');
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setError('Password harus diisi');
      setIsLoading(false);
      return;
    }

    // Simulasi delay untuk loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (login(username, password)) {
      toast.success('Login berhasil! Mengarahkan ke dashboard...');
      navigate('/mentor/dashboard');
    } else {
      setError('Username atau password salah. Silakan periksa kembali kredensial Anda.');
    }
    setIsLoading(false);
  };

  const fillDemoCredentials = () => {
    setUsername('198501012010011001');
    setPassword('mentor123');
    toast.info('Kredensial demo telah diisi');
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-6">
      <Card className="w-full max-w-md border-0 shadow-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-800 via-blue-850 to-blue-900 shadow-lg">
            <Zap className="size-7 text-white" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">Login Mentor</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Masuk ke dashboard mentor PLN
          </p>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm text-foreground">Username (NIP)</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan NIP atau Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="h-9 rounded-lg border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 focus:border-blue-600 focus:ring-blue-600 transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-9 pr-10 rounded-lg border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 focus:border-blue-600 focus:ring-blue-600 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2 shadow-md hover:shadow-lg transition-all duration-200" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <LogIn className="size-4" />
                  Login
                </>
              )}
            </Button>

            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-800 p-3 text-sm border border-blue-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-blue-900 dark:text-blue-300">Demo Credentials:</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillDemoCredentials}
                  disabled={isLoading}
                  className="text-xs h-7 px-2 rounded border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-300 transition-all duration-200"
                >
                  Isi Otomatis
                </Button>
              </div>
              <div className="space-y-1 rounded-lg bg-white/70 dark:bg-slate-900/50 p-2">
                <p className="text-blue-700 dark:text-blue-400 font-mono text-xs">Username: 198501012010011001</p>
                <p className="text-blue-700 dark:text-blue-400 font-mono text-xs">Password: mentor123</p>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Klik "Isi Otomatis" untuk mengisi kredensial demo</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
