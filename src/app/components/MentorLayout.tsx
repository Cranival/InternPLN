import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import {
  LayoutDashboard,
  CheckCircle,
  Users,
  User,
  LogOut,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

export function MentorLayout() {
  const { currentMentor, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentMentor) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      path: '/mentor/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/mentor/approval',
      label: 'Verifikasi Peserta',
      icon: CheckCircle,
    },
    {
      path: '/mentor/interns',
      label: 'Data Peserta',
      icon: Users,
    },
    {
      path: '/mentor/profile',
      label: 'Profil Saya',
      icon: User,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar Desktop */}
      <aside className="hidden w-72 border-r border-gray-200 bg-white/95 backdrop-blur-xl shadow-lg dark:bg-slate-900/95 dark:border-slate-700 lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-gray-200 dark:border-slate-700 px-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-800 to-blue-900 shadow-md">
            <Zap className="size-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-blue-900 dark:text-white tracking-tight">PLN Mentor</span>
            <span className="text-sm text-gray-500 dark:text-slate-400">Dashboard</span>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-5 rounded-xl bg-gradient-to-br from-blue-800 via-blue-850 to-blue-900 p-4 text-white shadow-lg">
            <div className="mb-3 flex items-center gap-3">
              <img
                src={currentMentor.photo}
                alt={currentMentor.name}
                className="size-12 rounded-xl object-cover ring-2 ring-white/30 shadow-md"
              />
              <div>
                <p className="text-base font-semibold">{currentMentor.name}</p>
                <p className="text-sm text-blue-200">{currentMentor.position}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm backdrop-blur-sm">
              <span className="text-blue-200">NIP:</span>
              <span className="font-mono">{currentMentor.nip}</span>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? 'default' : 'ghost'}
                    className={`w-full justify-start gap-3 py-6 text-base transition-all duration-200 ${
                      isActive(item.path)
                        ? 'shadow-md'
                        : 'hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-800 dark:hover:text-blue-300'
                    }`}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 py-6 text-base text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 transition-colors duration-200"
              onClick={handleLogout}
            >
              <LogOut className="size-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-5 shadow-sm lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-800 to-blue-900 shadow-md">
              <Zap className="size-6 text-white" />
            </div>
            <span className="text-base font-bold text-blue-900 dark:text-white tracking-tight">PLN Mentor</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="size-11 hover:bg-blue-50 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </Button>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-b border-gray-200 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl p-5 shadow-lg lg:hidden animate-slide-up">
            <div className="mb-5 rounded-xl bg-gradient-to-br from-blue-800 via-blue-850 to-blue-900 p-4 text-white shadow-md">
              <div className="mb-3 flex items-center gap-3">
                <img
                  src={currentMentor.photo}
                  alt={currentMentor.name}
                  className="size-12 rounded-xl object-cover ring-2 ring-white/30 shadow-md"
                />
                <div>
                  <p className="text-base font-semibold">{currentMentor.name}</p>
                  <p className="text-sm text-blue-200">
                    {currentMentor.position}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm backdrop-blur-sm">
                <span className="text-blue-200">NIP:</span>
                <span className="font-mono">{currentMentor.nip}</span>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive(item.path) ? 'default' : 'ghost'}
                      className={`w-full justify-start gap-3 py-6 text-base transition-all duration-200 ${
                        isActive(item.path)
                          ? 'shadow-md'
                          : 'hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-300'
                      }`}
                    >
                      <Icon className="size-5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 py-6 text-base text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 transition-colors duration-200"
                onClick={handleLogout}
              >
                <LogOut className="size-5" />
                Logout
              </Button>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
