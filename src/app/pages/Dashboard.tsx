import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { getInternsByYear } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, GraduationCap, Image as ImageIcon, ChevronDown, ChevronUp, User, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

export function Dashboard() {
  const { interns, mentors, gallery } = useData();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{
    photo: string;
    internName: string;
    caption?: string;
  } | null>(null);

  const verifiedInterns = interns.filter((i) => i.status === 'active' || i.status === 'alumni');
  const alumniInterns = interns.filter((i) => i.status === 'alumni');
  const activeInterns = interns.filter((i) => i.status === 'active');
  const currentYear = new Date().getFullYear();
  const internsThisYear = verifiedInterns.filter(
    (i) => new Date(i.periodStart).getFullYear() === currentYear
  );

  const chartData = getInternsByYear(verifiedInterns);
  const recentInterns = verifiedInterns
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Collect all photos from interns' galleryPhotos and gallery data
  const allPhotos: { photo: string; internName: string; internId: string }[] = [];
  
  // Add from intern galleryPhotos
  verifiedInterns.forEach((intern) => {
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
    const intern = verifiedInterns.find((i) => i.id === g.internId);
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
      title: 'Total Peserta',
      value: verifiedInterns.length,
      icon: GraduationCap,
      color: 'from-green-500 to-green-600',
    },

  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <div className="mb-6 rounded-xl bg-gradient-to-br from-blue-900 via-blue-850 to-blue-900 p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)', backgroundSize: '100px 100px' }}></div>
        </div>
        <div className="relative">
          <h1 className="mb-2 text-2xl font-bold tracking-tight">Database Peserta Magang PLN</h1>
          <p className="text-blue-200 max-w-2xl text-sm">
            Dokumentasi peserta dan alumni program magang serta PKL di lingkungan PT PLN (Persero)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="overflow-hidden group hover:shadow-lg transition-all duration-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-5">
                  <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-4 shadow-md transition-transform duration-200 group-hover:scale-105`}>
                    <Icon className="size-7 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-800 py-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="size-2 rounded-full bg-blue-700"></div>
              Statistik Peserta per Tahun
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 pb-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="year" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} fontWeight={500} />
                <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} fontWeight={500} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 20px -4px rgba(0,0,0,0.3)',
                    padding: '8px 12px',
                    fontSize: '13px',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    color: isDark ? '#f1f5f9' : '#1e293b'
                  }}
                  cursor={{ fill: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#colorGradient)" 
                  radius={[4, 4, 0, 0]} 
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Testimonials */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-800 py-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="size-2 rounded-full bg-green-500"></div>
              Kesan & Pesan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {recentInterns.map((intern) => (
              <div key={intern.id} className="rounded-lg border border-gray-100 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800 p-3 transition-all duration-200 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800">
                <div className="mb-2 flex items-center gap-2">
                  <img
                    src={intern.photo}
                    alt={intern.name}
                    className="size-10 rounded-lg object-cover ring-1 ring-blue-100 dark:ring-blue-900 shadow-sm"
                  />
                  <div>
                    <p className="font-medium text-base text-foreground">{intern.name}</p>
                    <p className="text-sm text-muted-foreground">{intern.school}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic line-clamp-2">
                  "{intern.message}"
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Mini Gallery */}
      <Card className="mt-6 overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-800 py-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ImageIcon className="size-4 text-blue-600" />
            Foto Kegiatan
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {allPhotos.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600">
                <ImageIcon className="size-6 text-gray-400" />
              </div>
              <p className="text-sm text-muted-foreground">Belum ada foto kegiatan</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {displayPhotos.map((item, index) => (
                  <div
                    key={`${item.internId}-${index}`}
                    className="group cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={() => setSelectedPhoto({
                      photo: item.photo,
                      internName: item.internName,
                    })}
                  >
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600">
                      <img
                        src={item.photo}
                        alt={`Foto kegiatan ${item.internName}`}
                        className="size-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-all duration-200 group-hover:opacity-100" />
                      <div className="absolute inset-x-0 bottom-0 p-2 text-white opacity-0 transition-all duration-200 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0">
                        <p className="text-xs font-medium line-clamp-1">{item.internName}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Show More / Less Button */}
              {allPhotos.length > 8 && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllPhotos(!showAllPhotos)}
                    className="gap-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200"
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
        <DialogContent className="max-w-3xl border-0 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <ImageIcon className="size-4 text-blue-600" />
              Detail Foto
            </DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-lg shadow-md">
                <img
                  src={selectedPhoto.photo}
                  alt="Preview"
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-800 p-2">
                <User className="size-4 text-blue-600" />
                <span className="font-medium text-sm text-foreground">{selectedPhoto.internName}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
