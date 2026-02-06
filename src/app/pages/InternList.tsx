import { useState } from 'react';
import { useData } from '../contexts/DataContext';
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
import { Search, Plus, GraduationCap, Calendar, Filter, X, ChevronRight } from 'lucide-react';

export function InternList() {
  const { interns, getMentorById, mentors } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterDivision, setFilterDivision] = useState<string>('all');
  const [filterMentor, setFilterMentor] = useState<string>('all');

  const approvedInterns = interns.filter((i) => i.status === 'approved');

  // Get unique years
  const years = Array.from(
    new Set(
      approvedInterns.map((i) =>
        new Date(i.periodStart).getFullYear().toString()
      )
    )
  ).sort((a, b) => b.localeCompare(a));

  // Get unique divisions
  const divisions = Array.from(
    new Set(approvedInterns.map((i) => i.division))
  ).sort();

  // Check if any filter is active
  const hasActiveFilters = filterYear !== 'all' || filterDivision !== 'all' || filterMentor !== 'all' || searchQuery !== '';

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilterYear('all');
    setFilterDivision('all');
    setFilterMentor('all');
  };

  // Filter interns
  const filteredInterns = approvedInterns
    .filter((intern) => {
      const matchesSearch =
        intern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intern.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intern.division.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesYear =
        filterYear === 'all' ||
        new Date(intern.periodStart).getFullYear().toString() === filterYear;

      const matchesDivision =
        filterDivision === 'all' ||
        intern.division === filterDivision;

      const matchesMentor =
        filterMentor === 'all' ||
        intern.mentorId === filterMentor;

      return matchesSearch && matchesYear && matchesDivision && matchesMentor;
    })
    // Sort by createdAt descending (newest first)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold tracking-tight text-foreground">
            Data Alumni Intern & PKL
          </h1>
          <p className="text-muted-foreground">
            Database lengkap mahasiswa magang dan siswa PKL PLN
          </p>
        </div>
        <Link to="/intern/tambah">
          <Button className="gap-3 px-8 py-4 text-lg shadow-md shadow-blue-500/20 hover:shadow-lg transition-all">
            <Plus className="size-6" />
            Tambah Intern
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6 border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardContent className="p-5">
          <div className="flex flex-col gap-5">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama, kampus, atau divisi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-gray-200 bg-gray-50/50 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {/* Filter Row */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-base text-muted-foreground">
                <Filter className="size-5" />
                <span>Filter:</span>
              </div>
              
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-[160px] h-11 text-base">
                  <SelectValue placeholder="Tahun" />
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

              <Select value={filterDivision} onValueChange={setFilterDivision}>
                <SelectTrigger className="w-[180px] h-11 text-base">
                  <SelectValue placeholder="Divisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Divisi</SelectItem>
                  {divisions.map((division) => (
                    <SelectItem key={division} value={division}>
                      {division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterMentor} onValueChange={setFilterMentor}>
                <SelectTrigger className="w-[200px] h-11 text-base">
                  <SelectValue placeholder="Mentor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Mentor</SelectItem>
                  {mentors.map((mentor) => (
                    <SelectItem key={mentor.id} value={mentor.id}>
                      {mentor.name.split(',')[0]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="size-4" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Menampilkan {filteredInterns.length} dari {approvedInterns.length} intern
      </div>

      {/* Intern Grid */}
      {filteredInterns.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="py-16 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
              <GraduationCap className="size-8 text-gray-400" />
            </div>
            <p className="text-muted-foreground">Tidak ada data intern ditemukan</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredInterns.map((intern) => {
            const mentor = getMentorById(intern.mentorId);
            return (
              <Link
                key={intern.id}
                to={`/intern/${intern.id}`}
                className="group"
              >
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="mb-4 flex justify-center">
                      <div className="relative">
                        <img
                          src={intern.photo}
                          alt={intern.name}
                          className="size-28 rounded-3xl object-cover ring-4 ring-blue-100 shadow-lg transition-transform group-hover:scale-105"
                        />
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg ring-4 ring-white dark:ring-slate-900">
                          <GraduationCap className="size-5 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="mb-1 font-semibold text-foreground line-clamp-1">
                        {intern.name}
                      </h3>
                      <p className="mb-2 text-xs text-muted-foreground line-clamp-1">
                        {intern.school}
                      </p>
                      <div className="mb-3 inline-block rounded-full bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm">
                        {intern.division}
                      </div>
                    </div>

                    <div className="mb-4 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="size-4 text-blue-500" />
                      <span>
                        {new Date(intern.periodStart).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })} - {new Date(intern.periodEnd).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <Button className="w-full gap-2 shadow-md shadow-blue-500/20 hover:shadow-lg transition-all">
                      Detail Intern
                      <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Button>
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
