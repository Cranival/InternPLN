import { Outlet } from 'react-router';
import { Navbar } from './Navbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="mt-16 border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2026 PT PLN (Persero) - Sistem Manajemen Data Intern & PKL</p>
        </div>
      </footer>
    </div>
  );
}
