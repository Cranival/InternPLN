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
      label: 'Approval Intern',
      icon: CheckCircle,
    },
    {
      path: '/mentor/interns',
      label: 'Data Intern',
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 border-r bg-white lg:block">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
            <Zap className="size-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-blue-900">PLN Mentor</span>
            <span className="text-xs text-gray-600">Dashboard</span>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-6 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-4 text-white">
            <div className="mb-2 flex items-center gap-3">
              <img
                src={currentMentor.photo}
                alt={currentMentor.name}
                className="size-12 rounded-full object-cover ring-2 ring-white"
              />
              <div>
                <p className="font-semibold">{currentMentor.name}</p>
                <p className="text-xs text-blue-100">{currentMentor.position}</p>
              </div>
            </div>
            <p className="text-xs text-blue-100">NIP: {currentMentor.nip}</p>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? 'default' : 'ghost'}
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <Zap className="size-6 text-white" />
            </div>
            <span className="font-bold text-blue-900">PLN Mentor</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
          <div className="border-b bg-white p-4 lg:hidden">
            <div className="mb-4 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-4 text-white">
              <div className="mb-2 flex items-center gap-3">
                <img
                  src={currentMentor.photo}
                  alt={currentMentor.name}
                  className="size-12 rounded-full object-cover ring-2 ring-white"
                />
                <div>
                  <p className="font-semibold">{currentMentor.name}</p>
                  <p className="text-xs text-blue-100">
                    {currentMentor.position}
                  </p>
                </div>
              </div>
              <p className="text-xs text-blue-100">NIP: {currentMentor.nip}</p>
            </div>

            <nav className="space-y-1">
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
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
