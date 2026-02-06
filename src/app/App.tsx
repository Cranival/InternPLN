import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <DataProvider>
            <RouterProvider router={router} />
            <Toaster />
          </DataProvider>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
