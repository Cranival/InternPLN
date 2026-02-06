import { Navigate, Outlet, Link, useLocation } from 'react-router';
import { useAdmin } from '../contexts/AdminContext';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  Users,
  GraduationCap,
  LogOut, 
  Shield,
  ChevronRight
} from 'lucide-react';

export function AdminLayout() {
  const { isAdminAuthenticated, adminLogout } = useAdmin();
  const location = useLocation();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/mentors', label: 'Kelola Mentor', icon: Users },
    { path: '/admin/interns', label: 'Kelola Intern', icon: GraduationCap },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white">
        <div className="flex h-16 items-center gap-3 border-b border-gray-800 px-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-red-600">
            <Shield className="size-6" />
          </div>
          <div>
            <h1 className="font-bold">Admin Panel</h1>
            <p className="text-xs text-gray-400">PLN Intern System</p>
          </div>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link to={item.path}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 ${
                        isActive(item.path)
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className="size-5" />
                      {item.label}
                      {isActive(item.path) && (
                        <ChevronRight className="ml-auto size-4" />
                      )}
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-800 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-400 hover:bg-gray-800 hover:text-white"
            onClick={adminLogout}
          >
            <LogOut className="size-5" />
            Logout Admin
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
