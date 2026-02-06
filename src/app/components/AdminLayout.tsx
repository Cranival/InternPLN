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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white shadow-xl">
        <div className="flex h-16 items-center gap-3 border-b border-slate-700/50 px-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-md">
            <Shield className="size-6" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Admin Panel</h1>
            <p className="text-sm text-slate-400">PLN Intern System</p>
          </div>
        </div>

        <nav className="mt-6 px-4">
          <p className="mb-3 px-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Menu</p>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link to={item.path}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 py-6 text-base transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-md hover:from-blue-800 hover:to-blue-900 hover:text-white'
                          : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <Icon className="size-5" />
                      {item.label}
                      {isActive(item.path) && (
                        <ChevronRight className="ml-auto size-5" />
                      )}
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700/50 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 py-6 text-base text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200"
            onClick={adminLogout}
          >
            <LogOut className="size-5" />
            Logout Admin
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-6 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}
