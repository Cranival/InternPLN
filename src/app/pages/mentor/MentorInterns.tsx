import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { 
  Search, 
  GraduationCap, 
  Calendar, 
  Pencil, 
  Trash2, 
  X, 
  Save,
  Upload,
  AlertTriangle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Intern } from '../../data/mockData';
import { toast } from 'sonner';

export function MentorInterns() {
  const { currentMentor } = useAuth();
  const { interns, updateIntern, deleteIntern } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [editingIntern, setEditingIntern] = useState<Intern | null>(null);
  const [deleteConfirmIntern, setDeleteConfirmIntern] = useState<Intern | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    socialMedia: '',
    school: '',
    major: '',
    location: '',
    division: '',
    periodStart: '',
    periodEnd: '',
    impression: '',
    message: '',
    photo: '',
  });

  if (!currentMentor) return null;

  const myInterns = interns.filter(
    (i) => i.mentorId === currentMentor.id && (i.status === 'active' || i.status === 'alumni')
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
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Open edit modal
  const handleEdit = (intern: Intern, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditForm({
      name: intern.name,
      phone: intern.phone,
      email: intern.email,
      address: intern.address,
      socialMedia: intern.socialMedia || '',
      school: intern.school,
      major: intern.major,
      location: intern.location,
      division: intern.division,
      periodStart: intern.periodStart,
      periodEnd: intern.periodEnd,
      impression: intern.impression,
      message: intern.message,
      photo: intern.photo,
    });
    setEditingIntern(intern);
  };

  // Handle photo upload for edit
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm(prev => ({ ...prev, photo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editingIntern) return;

    setIsSubmitting(true);
    try {
      const success = await updateIntern(editingIntern.id, {
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        address: editForm.address,
        socialMedia: editForm.socialMedia,
        school: editForm.school,
        major: editForm.major,
        location: editForm.location,
        division: editForm.division,
        periodStart: editForm.periodStart,
        periodEnd: editForm.periodEnd,
        impression: editForm.impression,
        message: editForm.message,
        photo: editForm.photo,
      });

      if (success) {
        toast.success('Data peserta berhasil diperbarui');
        setEditingIntern(null);
      }
    } catch (error) {
      toast.error('Gagal memperbarui data peserta');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete intern
  const handleDelete = async () => {
    if (!deleteConfirmIntern) return;

    setIsSubmitting(true);
    try {
      const success = await deleteIntern(deleteConfirmIntern.id);
      if (success) {
        toast.success(`Data ${deleteConfirmIntern.name} berhasil dihapus`);
        setDeleteConfirmIntern(null);
        setSelectedIntern(null);
      }
    } catch (error) {
      toast.error('Gagal menghapus data peserta');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open delete confirmation
  const handleDeleteClick = (intern: Intern, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmIntern(intern);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Data Peserta Bimbingan
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Daftar peserta magang yang pernah Anda bimbing
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
            <p className="text-gray-600">Tidak ada data peserta ditemukan</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredInterns.map((intern) => (
            <Card
              key={intern.id}
              className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setSelectedIntern(intern)}
            >
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
                    {/* Action Buttons Overlay */}
                    <div className="absolute -top-1 -right-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="size-7 bg-white/90 hover:bg-white shadow-md"
                        onClick={(e) => handleEdit(intern, e)}
                        title="Edit"
                      >
                        <Pencil className="size-3.5 text-blue-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="size-7 bg-white/90 hover:bg-red-50 shadow-md"
                        onClick={(e) => handleDeleteClick(intern, e)}
                        title="Hapus"
                      >
                        <Trash2 className="size-3.5 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="mb-1 font-semibold text-foreground">{intern.name}</h3>
                  <p className="mb-2 text-xs text-muted-foreground line-clamp-1">
                    {intern.school}
                  </p>
                  <div className="mb-3 inline-block rounded-full bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm">
                    {intern.division}
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4 text-blue-500" />
                  <span>
                    {new Date(intern.periodStart).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })} - {new Date(intern.periodEnd).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <Button
                  className="w-full gap-2 shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIntern(intern);
                  }}
                >
                  Lihat Detail
                  <Search className="size-4" />
                </Button>
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
                  <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Alamat</p>
                  <p className="rounded-lg bg-gray-50 dark:bg-slate-800 p-3 text-sm">
                    {selectedIntern.address}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Kesan</p>
                  <p className="rounded-lg bg-gray-50 dark:bg-slate-800 p-3 text-sm">
                    {selectedIntern.impression}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Pesan</p>
                  <p className="rounded-lg bg-gray-50 dark:bg-slate-800 p-3 text-sm">
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

                {/* Action Buttons in Detail Dialog */}
                <div className="flex gap-2 border-t pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-2"
                    onClick={() => {
                      setSelectedIntern(null);
                      handleEdit(selectedIntern, { stopPropagation: () => {} } as React.MouseEvent);
                    }}
                  >
                    <Pencil className="size-4" />
                    Edit Data
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1 gap-2"
                    onClick={() => {
                      setSelectedIntern(null);
                      setDeleteConfirmIntern(selectedIntern);
                    }}
                  >
                    <Trash2 className="size-4" />
                    Hapus
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Intern Dialog */}
      <Dialog open={!!editingIntern} onOpenChange={() => setEditingIntern(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Peserta</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Photo Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={editForm.photo || 'https://via.placeholder.com/150'}
                  alt="Preview"
                  className="size-24 rounded-full object-cover ring-4 ring-blue-100"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 size-8 rounded-full"
                  onClick={() => photoInputRef.current?.click()}
                >
                  <Upload className="size-4" />
                </Button>
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {/* Form Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Lengkap</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Nomor HP</Label>
                <Input
                  id="edit-phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-socialMedia">Media Sosial</Label>
                <Input
                  id="edit-socialMedia"
                  value={editForm.socialMedia}
                  onChange={(e) => setEditForm(prev => ({ ...prev, socialMedia: e.target.value }))}
                  placeholder="@instagram"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-address">Alamat</Label>
                <Textarea
                  id="edit-address"
                  value={editForm.address}
                  onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-school">Kampus/Sekolah</Label>
                <Input
                  id="edit-school"
                  value={editForm.school}
                  onChange={(e) => setEditForm(prev => ({ ...prev, school: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-major">Jurusan</Label>
                <Input
                  id="edit-major"
                  value={editForm.major}
                  onChange={(e) => setEditForm(prev => ({ ...prev, major: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Lokasi Magang</Label>
                <Input
                  id="edit-location"
                  value={editForm.location}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-division">Divisi</Label>
                <Input
                  id="edit-division"
                  value={editForm.division}
                  onChange={(e) => setEditForm(prev => ({ ...prev, division: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-periodStart">Tanggal Mulai</Label>
                <Input
                  id="edit-periodStart"
                  type="date"
                  value={editForm.periodStart}
                  onChange={(e) => setEditForm(prev => ({ ...prev, periodStart: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-periodEnd">Tanggal Selesai</Label>
                <Input
                  id="edit-periodEnd"
                  type="date"
                  value={editForm.periodEnd}
                  onChange={(e) => setEditForm(prev => ({ ...prev, periodEnd: e.target.value }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-impression">Kesan</Label>
                <Textarea
                  id="edit-impression"
                  value={editForm.impression}
                  onChange={(e) => setEditForm(prev => ({ ...prev, impression: e.target.value }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-message">Pesan</Label>
                <Textarea
                  id="edit-message"
                  value={editForm.message}
                  onChange={(e) => setEditForm(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingIntern(null)} disabled={isSubmitting}>
              <X className="mr-2 size-4" />
              Batal
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSubmitting}>
              <Save className="mr-2 size-4" />
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmIntern} onOpenChange={() => setDeleteConfirmIntern(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="size-5" />
              Konfirmasi Hapus
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data <strong>{deleteConfirmIntern?.name}</strong>? 
              Tindakan ini tidak dapat dibatalkan dan semua data termasuk foto galeri akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
