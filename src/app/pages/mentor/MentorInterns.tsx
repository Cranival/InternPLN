import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Search, GraduationCap, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Intern } from '../../data/mockData';

export function MentorInterns() {
  const { currentMentor } = useAuth();
  const { interns } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);

  if (!currentMentor) return null;

  const myInterns = interns.filter(
    (i) => i.mentorId === currentMentor.id && i.status === 'approved'
  );

  // Get unique years
  const years = Array.from(
    new Set(
      myInterns.map((i) => new Date(i.periodStart).getFullYear().toString())
    )
  ).sort((a, b) => b.localeCompare(a));

  // Filter interns
  const filteredInterns = myInterns.filter((intern) => {
    const matchesSearch =
      intern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intern.school.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear =
      filterYear === 'all' ||
      new Date(intern.periodStart).getFullYear().toString() === filterYear;

    return matchesSearch && matchesYear;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Data Intern Bimbingan
        </h1>
        <p className="text-gray-600">
          Daftar intern yang pernah Anda bimbing
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari nama atau kampus..."
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
      <div className="text-sm text-gray-600">
        Menampilkan {filteredInterns.length} dari {myInterns.length} intern
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredInterns.map((intern) => (
            <Card
              key={intern.id}
              className="group cursor-pointer overflow-hidden transition hover:shadow-lg"
              onClick={() => setSelectedIntern(intern)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={intern.photo}
                  alt={intern.name}
                  className="size-full object-cover transition group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="mb-1 font-semibold">{intern.name}</h3>
                <p className="mb-2 text-sm text-gray-600 line-clamp-1">
                  {intern.school}
                </p>
                <div className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                  {intern.division}
                </div>
                <div className="mt-3 border-t pt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3" />
                    <span>
                      {new Date(intern.periodStart).toLocaleDateString(
                        'id-ID',
                        { month: 'short', year: 'numeric' }
                      )}{' '}
                      -{' '}
                      {new Date(intern.periodEnd).toLocaleDateString('id-ID', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedIntern}
        onOpenChange={() => setSelectedIntern(null)}
      >
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          {selectedIntern && (
            <>
              <DialogHeader>
                <DialogTitle>Detail Intern</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedIntern.photo}
                    alt={selectedIntern.name}
                    className="size-20 rounded-full object-cover ring-4 ring-blue-100"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{selectedIntern.name}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedIntern.school}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Jurusan</p>
                    <p className="font-medium">{selectedIntern.major}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Divisi</p>
                    <p className="font-medium">{selectedIntern.division}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Lokasi</p>
                    <p className="font-medium">{selectedIntern.location}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Periode</p>
                    <p className="font-medium">
                      {new Date(
                        selectedIntern.periodStart
                      ).toLocaleDateString('id-ID')}{' '}
                      -{' '}
                      {new Date(selectedIntern.periodEnd).toLocaleDateString(
                        'id-ID'
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-sm text-gray-600">Kontak</p>
                  <p className="text-sm">{selectedIntern.phone}</p>
                  <p className="text-sm">{selectedIntern.email}</p>
                  {selectedIntern.socialMedia && (
                    <p className="text-sm">{selectedIntern.socialMedia}</p>
                  )}
                </div>

                <div>
                  <p className="mb-1 text-sm text-gray-600">Alamat</p>
                  <p className="rounded-lg bg-gray-50 p-3 text-sm">
                    {selectedIntern.address}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-sm text-gray-600">Kesan</p>
                  <p className="rounded-lg bg-gray-50 p-3 text-sm">
                    {selectedIntern.impression}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-sm text-gray-600">Pesan</p>
                  <p className="rounded-lg bg-gray-50 p-3 text-sm">
                    {selectedIntern.message}
                  </p>
                </div>

                {selectedIntern.galleryPhotos.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm text-gray-600">
                      Foto Kenangan ({selectedIntern.galleryPhotos.length})
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedIntern.galleryPhotos.map((photo, index) => (
                        <div
                          key={index}
                          className="aspect-square overflow-hidden rounded-lg"
                        >
                          <img
                            src={photo}
                            alt={`Gallery ${index + 1}`}
                            className="size-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
