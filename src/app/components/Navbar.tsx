import { Link, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Users, GraduationCap, LogIn, Zap } from 'lucide-react';

export function Navbar() {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: Zap },
    { path: '/mentor', label: 'Mentor', icon: Users },
    { path: '/intern', label: 'Intern', icon: GraduationCap },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <Zap className="size-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-blue-900">PLN Intern</span>
              <span className="text-xs text-gray-600">Management System</span>
            </div>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant={isActive(link.path) ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="size-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          <Link to="/login">
            <Button size="sm" className="gap-2">
              <LogIn className="size-4" />
              <span className="hidden sm:inline">Login Mentor</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
