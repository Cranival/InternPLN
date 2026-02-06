import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { 
  Search, 
  Download, 
  GraduationCap, 
  Filter, 
  X, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Intern } from '../../data/mockData';
import { toast } from 'sonner';

export function InternManagement() {
  const { interns, mentors, getMentorById, approveIntern, rejectIntern, refreshData } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMentor, setFilterMentor] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [approveConfirm, setApproveConfirm] = useState<Intern | null>(null);
  const [rejectConfirm, setRejectConfirm] = useState<Intern | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get unique years
  const years = Array.from(
    new Set(interns.map((i) => new Date(i.periodStart).getFullYear().toString()))
  ).sort((a, b) => b.localeCompare(a));

  // Check if any filter is active
  const hasActiveFilters = 
    filterStatus !== 'all' || 
    filterMentor !== 'all' || 
    filterYear !== 'all' || 
    searchQuery !== '';

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterMentor('all');
    setFilterYear('all');
  };

  // Filter interns
  const filteredInterns = interns.filter((intern) => {
    const matchesSearch =
      intern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intern.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intern.division.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || intern.status === filterStatus;

    const matchesMentor =
      filterMentor === 'all' || intern.mentorId === filterMentor;

    const matchesYear =
      filterYear === 'all' ||
      new Date(intern.periodStart).getFullYear().toString() === filterYear;

    return matchesSearch && matchesStatus && matchesMentor && matchesYear;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Export to CSV
  const handleExport = () => {
    if (filteredInterns.length === 0) {
      toast.error('Tidak ada data untuk diexport');
      return;
    }

    const headers = [
      'No',
      'Nama',
      'Sekolah/Kampus',
      'Jurusan',
      'Divisi',
      'Lokasi',
      'Mentor',
      'Periode Mulai',
      'Periode Selesai',
      'Status',
      'Email',
      'No HP',
      'Alamat',
      'Kesan',
      'Pesan'
    ];

    const rows = filteredInterns.map((intern, index) => {
      const mentor = getMentorById(intern.mentorId);
      return [
        index + 1,
        intern.name,
        intern.school,
        intern.major,
        intern.division,
        intern.location,
        mentor?.name || '-',
        new Date(intern.periodStart).toLocaleDateString('id-ID'),
        new Date(intern.periodEnd).toLocaleDateString('id-ID'),
        intern.status === 'approved' ? 'Disetujui' : 'Pending',
        intern.email,
        intern.phone,
        intern.address.replace(/,/g, ';'),
        intern.impression.replace(/,/g, ';'),
        intern.message.replace(/,/g, ';'),
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `data-semua-intern-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success(`${filteredInterns.length} data berhasil diexport ke CSV`);
  };

  // Approve intern (admin override)
  const handleApprove = async () => {
    if (!approveConfirm) return;

    setIsSubmitting(true);
    try {
      const success = await approveIntern(approveConfirm.id);
      if (success) {
        toast.success(`${approveConfirm.name} berhasil disetujui`);
        setApproveConfirm(null);
        refreshData();
      }
    } catch (error) {
      toast.error('Gagal menyetujui intern');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reject intern (admin override)
  const handleReject = async () => {
    if (!rejectConfirm) return;

    setIsSubmitting(true);
    try {
      const success = await rejectIntern(rejectConfirm.id);
      if (success) {
        toast.success(`${rejectConfirm.name} berhasil ditolak`);
        setRejectConfirm(null);
        refreshData();
      }
    } catch (error) {
      toast.error('Gagal menolak intern');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingCount = interns.filter(i => i.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Semua Intern</h1>
          <p className="text-gray-600">
            Lihat dan kelola data semua intern dari semua mentor
          </p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      {/* Pending Alert */}
      {pendingCount > 0 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-center gap-3">
          <Clock className="size-5 text-amber-600" />
          <div>
            <p className="font-medium text-amber-800">
              {pendingCount} intern menunggu approval
            </p>
            <p className="text-sm text-amber-600">
              Filter status "Pending" untuk melihat dan melakukan approval
            </p>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari nama, kampus, atau divisi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="size-4" />
                <span>Filter:</span>
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterMentor} onValueChange={setFilterMentor}>
                <SelectTrigger className="w-[180px]">
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

              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-[130px]">
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
      <div className="text-sm text-gray-600">
        Menampilkan {filteredInterns.length} dari {interns.length} intern
      </div>

      {/* Intern Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="size-5" />
            Daftar Intern
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInterns.length === 0 ? (
            <div className="py-12 text-center">
              <GraduationCap className="mx-auto mb-4 size-12 text-gray-400" />
              <p className="text-gray-600">Tidak ada data intern</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Foto</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Sekolah</TableHead>
                    <TableHead>Divisi</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterns.map((intern) => {
                    const mentor = getMentorById(intern.mentorId);
                    return (
                      <TableRow key={intern.id}>
                        <TableCell>
                          <img
                            src={intern.photo}
                            alt={intern.name}
                            className="size-10 rounded-full object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{intern.name}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{intern.school}</TableCell>
                        <TableCell>{intern.division}</TableCell>
                        <TableCell className="max-w-[120px] truncate">
                          {mentor?.name.split(',')[0] || '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(intern.periodStart).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                        </TableCell>
                        <TableCell>
                          {intern.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                              <CheckCircle className="size-3" />
                              Disetujui
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                              <Clock className="size-3" />
                              Pending
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setSelectedIntern(intern)}
                              title="Lihat Detail"
                            >
                              <Eye className="size-4 text-blue-600" />
                            </Button>
                            {intern.status === 'pending' && (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setApproveConfirm(intern)}
                                  title="Setujui"
                                >
                                  <CheckCircle className="size-4 text-green-600" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setRejectConfirm(intern)}
                                  title="Tolak"
                                >
                                  <XCircle className="size-4 text-red-600" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedIntern} onOpenChange={() => setSelectedIntern(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
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
                    <p className="text-sm text-gray-600">{selectedIntern.school}</p>
                    <div className="mt-2">
                      {selectedIntern.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          <CheckCircle className="size-3" />
                          Disetujui
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                          <Clock className="size-3" />
                          Pending
                        </span>
                      )}
                    </div>
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
                    <p className="mb-1 text-sm text-gray-600">Mentor</p>
                    <p className="font-medium">
                      {getMentorById(selectedIntern.mentorId)?.name || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Periode</p>
                    <p className="font-medium">
                      {new Date(selectedIntern.periodStart).toLocaleDateString('id-ID')} - {new Date(selectedIntern.periodEnd).toLocaleDateString('id-ID')}
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
                  <p className="rounded-lg bg-gray-50 p-3 text-sm">{selectedIntern.address}</p>
                </div>

                <div>
                  <p className="mb-1 text-sm text-gray-600">Kesan</p>
                  <p className="rounded-lg bg-gray-50 p-3 text-sm">{selectedIntern.impression}</p>
                </div>

                <div>
                  <p className="mb-1 text-sm text-gray-600">Pesan</p>
                  <p className="rounded-lg bg-gray-50 p-3 text-sm">{selectedIntern.message}</p>
                </div>

                {/* Action Buttons for Pending */}
                {selectedIntern.status === 'pending' && (
                  <div className="flex gap-2 border-t pt-4">
                    <Button
                      className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setSelectedIntern(null);
                        setApproveConfirm(selectedIntern);
                      }}
                    >
                      <CheckCircle className="size-4" />
                      Setujui
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 gap-2"
                      onClick={() => {
                        setSelectedIntern(null);
                        setRejectConfirm(selectedIntern);
                      }}
                    >
                      <XCircle className="size-4" />
                      Tolak
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation */}
      <AlertDialog open={!!approveConfirm} onOpenChange={() => setApproveConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="size-5" />
              Konfirmasi Approval
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menyetujui <strong>{approveConfirm?.name}</strong>?
              Data intern akan tampil di halaman publik.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Memproses...' : 'Ya, Setujui'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation */}
      <AlertDialog open={!!rejectConfirm} onOpenChange={() => setRejectConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="size-5" />
              Konfirmasi Penolakan
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menolak <strong>{rejectConfirm?.name}</strong>?
              Data intern akan dihapus dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Memproses...' : 'Ya, Tolak'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
