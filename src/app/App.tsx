import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { DataProvider } from './contexts/DataContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <DataProvider>
          <RouterProvider router={router} />
          <Toaster />
        </DataProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
