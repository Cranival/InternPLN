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
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700">
            <Zap className="size-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Login Mentor</CardTitle>
          <p className="text-sm text-gray-600">
            Masuk ke dashboard mentor PLN
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username (NIP)</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan NIP atau Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pr-10 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
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

            <div className="rounded-lg bg-blue-50 p-4 text-sm border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-blue-900">Demo Credentials:</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillDemoCredentials}
                  disabled={isLoading}
                  className="text-xs h-7 px-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Isi Otomatis
                </Button>
              </div>
              <div className="space-y-1">
                <p className="text-blue-700 font-mono">Username: 198501012010011001</p>
                <p className="text-blue-700 font-mono">Password: mentor123</p>
              </div>
              <p className="text-xs text-blue-600 mt-2">Klik "Isi Otomatis" untuk mengisi kredensial demo</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
