import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { getInternsByYear } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, GraduationCap, Image as ImageIcon, ChevronDown, ChevronUp, User, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

export function Dashboard() {
  const { interns, mentors, gallery } = useData();
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{
    photo: string;
    internName: string;
    caption?: string;
  } | null>(null);

  const approvedInterns = interns.filter((i) => i.status === 'approved');
  const currentYear = new Date().getFullYear();
  const internsThisYear = approvedInterns.filter(
    (i) => new Date(i.periodStart).getFullYear() === currentYear
  );

  const chartData = getInternsByYear(approvedInterns);
  const recentInterns = approvedInterns
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Collect all photos from interns' galleryPhotos and gallery data
  const allPhotos: { photo: string; internName: string; internId: string }[] = [];
  
  // Add from intern galleryPhotos
  approvedInterns.forEach((intern) => {
    if (intern.galleryPhotos && intern.galleryPhotos.length > 0) {
      intern.galleryPhotos.forEach((photo) => {
        allPhotos.push({
          photo,
          internName: intern.name,
          internId: intern.id,
        });
      });
    }
  });

  // Add from gallery data
  gallery.forEach((g) => {
    const intern = approvedInterns.find((i) => i.id === g.internId);
    allPhotos.push({
      photo: g.photo,
      internName: g.internName || intern?.name || 'Unknown',
      internId: g.internId,
    });
  });

  // Remove duplicates and limit display
  const displayPhotos = showAllPhotos ? allPhotos : allPhotos.slice(0, 8);

  const stats = [
    {
      title: 'Total Mentor',
      value: mentors.length,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Alumni Intern',
      value: approvedInterns.length,
      icon: GraduationCap,
      color: 'from-green-500 to-green-600',
    },

  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white shadow-xl">
        <h1 className="mb-2 text-3xl font-bold">Sistem Data Intern & PKL PLN</h1>
        <p className="text-blue-100">
          Database terpusat untuk dokumentasi dan histori mahasiswa magang serta siswa PKL
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 grid-cols-1 sm:grid-cols-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-3`}>
                    <Icon className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Statistik Intern per Tahun</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Testimonials */}
        <Card>
          <CardHeader>
            <CardTitle>Kesan & Pesan Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInterns.map((intern) => (
              <div key={intern.id} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-3">
                  <img
                    src={intern.photo}
                    alt={intern.name}
                    className="size-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{intern.name}</p>
                    <p className="text-xs text-gray-600">{intern.school}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  "{intern.message}"
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Mini Gallery */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="size-5" />
            Foto Kegiatan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allPhotos.length === 0 ? (
            <div className="py-12 text-center">
              <ImageIcon className="mx-auto mb-4 size-12 text-gray-400" />
              <p className="text-gray-600">Belum ada foto kegiatan</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {displayPhotos.map((item, index) => (
                  <div
                    key={`${item.internId}-${index}`}
                    className="group cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => setSelectedPhoto({
                      photo: item.photo,
                      internName: item.internName,
                    })}
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={item.photo}
                        alt={`Foto kegiatan ${item.internName}`}
                        className="size-full object-cover transition duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                      <div className="absolute inset-x-0 bottom-0 p-2 text-white opacity-0 transition group-hover:opacity-100">
                        <p className="text-xs font-medium line-clamp-1">{item.internName}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Show More / Less Button */}
              {allPhotos.length > 8 && (
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllPhotos(!showAllPhotos)}
                    className="gap-2"
                  >
                    {showAllPhotos ? (
                      <>
                        <ChevronUp className="size-4" />
                        Tampilkan Lebih Sedikit
                      </>
                    ) : (
                      <>
                        <ChevronDown className="size-4" />
                        Lihat Semua ({allPhotos.length} foto)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Photo Preview Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detail Foto</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <img
                src={selectedPhoto.photo}
                alt="Preview"
                className="w-full rounded-lg"
              />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="size-4" />
                <span>{selectedPhoto.internName}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
