import { useData } from '../contexts/DataContext';
import { mockMentors, mockGalleryPhotos, getInternsByYear } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, GraduationCap, Image, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';

export function Dashboard() {
  const { interns } = useData();
  const approvedInterns = interns.filter((i) => i.status === 'approved');
  const currentYear = new Date().getFullYear();
  const internsThisYear = approvedInterns.filter(
    (i) => new Date(i.periodStart).getFullYear() === currentYear
  );

  const chartData = getInternsByYear(approvedInterns);
  const recentInterns = approvedInterns
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const stats = [
    {
      title: 'Total Mentor',
      value: mockMentors.length,
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Galeri Kegiatan</CardTitle>
          <Link to="/galeri">
            <Button variant="outline" size="sm">
              Lihat Semua
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {mockGalleryPhotos.slice(0, 8).map((photo) => (
              <div
                key={photo.id}
                className="aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src={photo.photo}
                  alt={photo.caption}
                  className="size-full object-cover transition hover:scale-110"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
