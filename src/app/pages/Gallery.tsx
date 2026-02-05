import { useState } from 'react';
import { mockGalleryPhotos } from '../data/mockData';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { Image as ImageIcon } from 'lucide-react';

export function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-blue-900">
          Galeri Kegiatan
        </h1>
        <p className="text-gray-600">
          Dokumentasi kegiatan magang dan PKL di lingkungan PLN
        </p>
      </div>

      {mockGalleryPhotos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="mx-auto mb-4 size-12 text-gray-400" />
            <p className="text-gray-600">Belum ada foto di galeri</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {mockGalleryPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setSelectedPhoto(photo.photo)}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={photo.photo}
                  alt={photo.caption || 'Gallery photo'}
                  className="size-full object-cover transition duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          {selectedPhoto && (
            <img
              src={selectedPhoto}
              alt="Preview"
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
