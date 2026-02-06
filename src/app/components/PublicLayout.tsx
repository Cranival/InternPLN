import { Outlet } from 'react-router';
import { Navbar } from './Navbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      <main className="animate-fade-in">
        <Outlet />
      </main>
      <footer className="mt-8 border-t border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-700 to-blue-800 shadow-sm">
                <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">PLN Intern Portal</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Sistem Manajemen Data Intern & PKL</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-slate-400">
              © {new Date().getFullYear()} PT PLN (Persero). All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
