import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, GraduationCap, Clock, CheckCircle } from 'lucide-react';

export function AdminDashboard() {
  const { interns, mentors } = useData();

  const verifiedInterns = interns.filter((i) => i.status === 'active' || i.status === 'alumni');
  const activeInterns = interns.filter((i) => i.status === 'active');
  const alumniInterns = interns.filter((i) => i.status === 'alumni');
  const pendingInterns = interns.filter((i) => i.status === 'pending');

  const stats = [
    {
      title: 'Total Mentor',
      value: mentors.length,
      icon: Users,
      color: 'bg-blue-500',
      description: 'Mentor terdaftar',
    },
    {
      title: 'Total Peserta',
      value: interns.length,
      icon: GraduationCap,
      color: 'bg-green-500',
      description: 'Semua peserta',
    },
    {
      title: 'Peserta Terverifikasi',
      value: verifiedInterns.length,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      description: `${activeInterns.length} aktif, ${alumniInterns.length} alumni`,
    },
    {
      title: 'Menunggu Verifikasi',
      value: pendingInterns.length,
      icon: Clock,
      color: 'bg-amber-500',
      description: 'Status pending',
    },
  ];

  // Mentor with most interns
  const mentorStats = mentors.map((mentor) => ({
    ...mentor,
    internCount: interns.filter((i) => i.mentorId === mentor.id && (i.status === 'active' || i.status === 'alumni')).length,
  })).sort((a, b) => b.internCount - a.internCount);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Overview sistem PLN Magang</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg ${stat.color} p-3`}>
                    <Icon className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{stat.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mentor Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik Mentor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mentorStats.slice(0, 5).map((mentor, index) => (
              <div key={mentor.id} className="flex items-center gap-4">
                <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-bold">
                  {index + 1}
                </div>
                <img
                  src={mentor.photo}
                  alt={mentor.name}
                  className="size-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium dark:text-white">{mentor.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{mentor.division}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600 dark:text-blue-400">{mentor.internCount}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">peserta</p>
                </div>
              </div>
            ))}

            {mentors.length === 0 && (
              <p className="py-4 text-center text-gray-500">Belum ada data mentor</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
