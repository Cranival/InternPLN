import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export function MentorStatistics() {
  const { currentMentor } = useAuth();
  const { interns } = useData();

  if (!currentMentor) return null;

  const myInterns = interns.filter(
    (i) => i.mentorId === currentMentor.id && i.status === 'approved'
  );

  // Stats by year
  const internsByYear: { [year: string]: number } = {};
  myInterns.forEach((intern) => {
    const year = new Date(intern.periodStart).getFullYear().toString();
    internsByYear[year] = (internsByYear[year] || 0) + 1;
  });
  const yearData = Object.entries(internsByYear)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year.localeCompare(b.year));

  // Stats by school
  const internsBySchool: { [school: string]: number } = {};
  myInterns.forEach((intern) => {
    internsBySchool[intern.school] = (internsBySchool[intern.school] || 0) + 1;
  });
  const schoolData = Object.entries(internsBySchool)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Stats by major
  const internsByMajor: { [major: string]: number } = {};
  myInterns.forEach((intern) => {
    internsByMajor[intern.major] = (internsByMajor[intern.major] || 0) + 1;
  });
  const majorData = Object.entries(internsByMajor)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const COLORS = [
    '#2563eb',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
  ];

  const handleExport = () => {
    if (myInterns.length === 0) {
      toast.error('Tidak ada data untuk diexport');
      return;
    }

    // Create CSV content
    const headers = ['No', 'Nama', 'Sekolah/Kampus', 'Jurusan', 'Divisi', 'Lokasi', 'Periode Mulai', 'Periode Selesai', 'Email', 'No HP'];
    const rows = myInterns.map((intern, index) => [
      index + 1,
      intern.name,
      intern.school,
      intern.major,
      intern.division,
      intern.location,
      new Date(intern.periodStart).toLocaleDateString('id-ID'),
      new Date(intern.periodEnd).toLocaleDateString('id-ID'),
      intern.email,
      intern.phone,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `data-intern-${currentMentor?.name.replace(/[^a-zA-Z0-9]/g, '_')}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success('Data berhasil diexport ke CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Statistik Bimbingan
          </h1>
          <p className="text-gray-600">
            Analisis data intern yang Anda bimbing
          </p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="size-4" />
          Export Data
        </Button>
      </div>

      {myInterns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Belum ada data untuk ditampilkan</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Trend Intern per Tahun */}
          <Card>
            <CardHeader>
              <CardTitle>Trend Intern per Tahun</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yearData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: '#2563eb', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Distribusi Kampus */}
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Kampus</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={schoolData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribusi Jurusan */}
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Jurusan</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={majorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {majorData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-semibold">
                        Kategori
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Jumlah
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-3">Total Intern Dibimbing</td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {myInterns.length}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3">Jumlah Kampus Berbeda</td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {Object.keys(internsBySchool).length}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3">Jumlah Jurusan Berbeda</td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {Object.keys(internsByMajor).length}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Periode Bimbingan</td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {yearData.length > 0
                          ? `${yearData[0].year} - ${yearData[yearData.length - 1].year}`
                          : '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
