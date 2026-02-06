import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Image as ImageIcon, User, Calendar } from 'lucide-react';
import { GalleryPhoto } from '../data/mockData';

export function Gallery() {
  const { gallery, interns } = useData();
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  // Get intern name helper
  const getInternName = (internId: string) => {
    const intern = interns.find(i => i.id === internId);
    return intern?.name || 'Unknown';
  };

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

      {gallery.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="mx-auto mb-4 size-12 text-gray-400" />
            <p className="text-gray-600">Belum ada foto di galeri</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {gallery.map((photo) => (
            <div
              key={photo.id}
              className="group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={photo.photo}
                  alt={photo.caption || 'Gallery photo'}
                  className="size-full object-cover transition duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-2 text-white opacity-0 transition group-hover:opacity-100">
                  <p className="text-xs font-medium line-clamp-1">{photo.internName || getInternName(photo.internId)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detail Foto</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <img
                src={selectedPhoto.photo}
                alt={selectedPhoto.caption || 'Preview'}
                className="w-full rounded-lg"
              />
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="size-4" />
                  <span>{selectedPhoto.internName || getInternName(selectedPhoto.internId)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <span>{new Date(selectedPhoto.uploadedAt).toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</span>
                </div>
              </div>
              {selectedPhoto.caption && (
                <p className="text-gray-700">{selectedPhoto.caption}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
