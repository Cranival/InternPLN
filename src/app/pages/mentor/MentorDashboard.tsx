import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, TrendingUp, Clock, Award } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';

export function MentorDashboard() {
  const { currentMentor } = useAuth();
  const { interns } = useData();

  if (!currentMentor) return null;

  const myInterns = interns.filter((i) => i.mentorId === currentMentor.id);
  const verifiedInterns = myInterns.filter((i) => i.status === 'active' || i.status === 'alumni');
  const activeInterns = myInterns.filter((i) => i.status === 'active');
  const alumniInterns = myInterns.filter((i) => i.status === 'alumni');
  const pendingInterns = myInterns.filter((i) => i.status === 'pending');

  const currentYear = new Date().getFullYear();
  const internsThisYear = verifiedInterns.filter(
    (i) => new Date(i.periodStart).getFullYear() === currentYear
  );

  // Interns by year
  const internsByYear: { [year: string]: number } = {};
  verifiedInterns.forEach((intern) => {
    const year = new Date(intern.periodStart).getFullYear().toString();
    internsByYear[year] = (internsByYear[year] || 0) + 1;
  });
  const yearChartData = Object.entries(internsByYear)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year.localeCompare(b.year));

  // Interns by school
  const internsBySchool: { [school: string]: number } = {};
  verifiedInterns.forEach((intern) => {
    internsBySchool[intern.school] = (internsBySchool[intern.school] || 0) + 1;
  });
  const topSchools = Object.entries(internsBySchool)
    .map(([school, count]) => ({ school, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const stats = [
    {
      title: 'Total Dibimbing',
      value: verifiedInterns.length,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Peserta Tahun Ini',
      value: internsThisYear.length,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Menunggu Verifikasi',
      value: pendingInterns.length,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'Total Kampus',
      value: Object.keys(internsBySchool).length,
      icon: Award,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Mentor
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Selamat datang, {currentMentor.name}
        </p>
      </div>

      {/* Pending Approval Alert */}
      {pendingInterns.length > 0 && (
        <Alert>
          <Clock className="size-4" />
          <AlertDescription>
            Ada {pendingInterns.length} peserta baru menunggu verifikasi.{' '}
            <Link to="/mentor/approval" className="font-semibold text-blue-600 hover:underline">
              Lihat sekarang
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-lg bg-gradient-to-br ${stat.color} p-3`}
                  >
                    <Icon className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Intern per Tahun */}
        <Card>
          <CardHeader>
            <CardTitle>Peserta per Tahun</CardTitle>
          </CardHeader>
          <CardContent>
            {yearChartData.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Belum ada data
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
                  <XAxis dataKey="year" className="dark:fill-gray-300" tick={{ fill: 'currentColor' }} />
                  <YAxis className="dark:fill-gray-300" tick={{ fill: 'currentColor' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)', 
                      borderColor: 'var(--border)',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: 'var(--foreground)' }}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.15)' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Kampus Terbanyak */}
        <Card>
          <CardHeader>
            <CardTitle>Kampus Terbanyak</CardTitle>
          </CardHeader>
          <CardContent>
            {topSchools.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Belum ada data
              </p>
            ) : (
              <div className="space-y-3">
                {topSchools.map((school, index) => (
                  <div key={school.school} className="flex items-center gap-4">
                    <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 font-semibold text-blue-700 dark:text-blue-300">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium dark:text-white">{school.school}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {school.count} intern
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{
                            width: `${(school.count / topSchools[0].count) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
