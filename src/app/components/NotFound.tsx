import { Link } from 'react-router';
import { Button } from './ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-bold text-blue-600">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
          Halaman Tidak Ditemukan
        </h2>
        <p className="mb-8 text-gray-600">
          Maaf, halaman yang Anda cari tidak dapat ditemukan.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button className="gap-2">
              <Home className="size-4" />
              Kembali ke Beranda
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="size-4" />
            Kembali
          </Button>
        </div>
      </div>
    </div>
  );
}
