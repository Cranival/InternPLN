import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { mockMentors } from '../data/mockData';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Search, Plus, GraduationCap, Calendar } from 'lucide-react';

export function InternList() {
  const { interns } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState<string>('all');

  const approvedInterns = interns.filter((i) => i.status === 'approved');

  // Get unique years
  const years = Array.from(
    new Set(
      approvedInterns.map((i) =>
        new Date(i.periodStart).getFullYear().toString()
      )
    )
  ).sort((a, b) => b.localeCompare(a));

  // Filter interns
  const filteredInterns = approvedInterns.filter((intern) => {
    const matchesSearch =
      intern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intern.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intern.division.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear =
      filterYear === 'all' ||
      new Date(intern.periodStart).getFullYear().toString() === filterYear;

    return matchesSearch && matchesYear;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-blue-900">
            Data Alumni Intern & PKL
          </h1>
          <p className="text-gray-600">
            Database lengkap mahasiswa magang dan siswa PKL PLN
          </p>
        </div>
        <Link to="/intern/tambah">
          <Button className="gap-2">
            <Plus className="size-4" />
            Tambah Intern
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari nama, kampus, atau divisi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tahun</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Menampilkan {filteredInterns.length} dari {approvedInterns.length} intern
      </div>

      {/* Intern Grid */}
      {filteredInterns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="mx-auto mb-4 size-12 text-gray-400" />
            <p className="text-gray-600">Tidak ada data intern ditemukan</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {filteredInterns.map((intern) => {
            const mentor = mockMentors.find((m) => m.id === intern.mentorId);
            return (
              <Link
                key={intern.id}
                to={`/intern/${intern.id}`}
                className="group"
              >
                <Card className="overflow-hidden transition hover:shadow-lg">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={intern.photo}
                      alt={intern.name}
                      className="size-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="mb-1 text-sm font-semibold text-gray-900 line-clamp-1">
                      {intern.name}
                    </h3>
                    <p className="mb-2 text-xs text-gray-600 line-clamp-1">
                      {intern.school}
                    </p>
                    <div className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {intern.division}
                    </div>
                    <div className="mt-2 space-y-1 border-t pt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        <span className="text-xs">
                          {new Date(intern.periodStart).toLocaleDateString(
                            'id-ID',
                            { month: 'short', year: 'numeric' }
                          )}{' '}
                          -{' '}
                          {new Date(intern.periodEnd).toLocaleDateString(
                            'id-ID',
                            { month: 'short', year: 'numeric' }
                          )}
                        </span>
                      </div>
                      <p className="line-clamp-1 text-xs">Mentor: {mentor?.name}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
