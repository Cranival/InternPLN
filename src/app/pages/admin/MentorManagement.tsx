import { useState, useRef } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Upload,
  X,
  Save,
  AlertTriangle,
  Users,
  Copy,
  Check,
  Key,
  RefreshCw
} from 'lucide-react';
import { Mentor } from '../../data/mockData';
import { MentorDB } from '../../lib/database';
import { toast } from 'sonner';

export function MentorManagement() {
  const { mentors, interns, refreshData } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [deleteMentor, setDeleteMentor] = useState<Mentor | null>(null);
  const [resetPasswordMentor, setResetPasswordMentor] = useState<Mentor | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [credentialsMentor, setCredentialsMentor] = useState<{name: string; nip: string; password: string} | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    division: '',
    position: '',
    photo: 'https://i.pravatar.cc/400?img=1',
    password: '',
  });

  // Filter mentors
  const filteredMentors = mentors.filter((mentor) =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.nip.includes(searchQuery) ||
    mentor.division.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get intern count for mentor
  const getInternCount = (mentorId: string) => {
    return interns.filter((i) => i.mentorId === mentorId).length;
  };

  // Copy to clipboard
  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success('Berhasil disalin!');
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error('Gagal menyalin');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      nip: '',
      division: '',
      position: '',
      photo: 'https://i.pravatar.cc/400?img=1',
      password: '',
    });
  };

  // Open add modal
  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (mentor: Mentor) => {
    setFormData({
      name: mentor.name,
      nip: mentor.nip,
      division: mentor.division,
      position: mentor.position,
      photo: mentor.photo,
      password: '',
    });
    setEditingMentor(mentor);
  };

  // Handle photo upload
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
      setFormData((prev) => ({ ...prev, photo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Create mentor
  const handleCreate = async () => {
    if (!formData.name || !formData.nip || !formData.division || !formData.password) {
      toast.error('Semua field wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = MentorDB.create({
        name: formData.name,
        nip: formData.nip,
        division: formData.division,
        position: formData.position || formData.division,
        photo: formData.photo,
        password: formData.password,
        totalInterns: 0,
      });

      if (result.success) {
        toast.success('Mentor berhasil ditambahkan');
        setIsAddModalOpen(false);
        // Show credentials dialog
        setCredentialsMentor({
          name: formData.name,
          nip: formData.nip,
          password: formData.password,
        });
        resetForm();
        refreshData();
      } else {
        toast.error(result.error || 'Gagal menambahkan mentor');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update mentor
  const handleUpdate = async () => {
    if (!editingMentor) return;

    if (!formData.name || !formData.nip || !formData.division) {
      toast.error('Nama, NIP, dan Divisi wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const updates: Partial<Mentor> = {
        name: formData.name,
        nip: formData.nip,
        division: formData.division,
        position: formData.position,
        photo: formData.photo,
      };

      // Only update password if provided
      if (formData.password) {
        updates.password = formData.password;
      }

      const result = MentorDB.update(editingMentor.id, updates);

      if (result.success) {
        toast.success('Data mentor berhasil diperbarui');
        setEditingMentor(null);
        resetForm();
        refreshData();
      } else {
        toast.error(result.error || 'Gagal memperbarui mentor');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete mentor
  const handleDelete = async () => {
    if (!deleteMentor) return;

    setIsSubmitting(true);
    try {
      const result = MentorDB.delete(deleteMentor.id);

      if (result.success) {
        toast.success('Mentor berhasil dihapus');
        setDeleteMentor(null);
        refreshData();
      } else {
        toast.error(result.error || 'Gagal menghapus mentor');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset password
  const handleResetPassword = async () => {
    if (!resetPasswordMentor || !newPassword) {
      toast.error('Password baru wajib diisi');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = MentorDB.update(resetPasswordMentor.id, { password: newPassword });

      if (result.success) {
        toast.success('Password berhasil direset');
        // Show credentials
        setCredentialsMentor({
          name: resetPasswordMentor.name,
          nip: resetPasswordMentor.nip,
          password: newPassword,
        });
        setResetPasswordMentor(null);
        setNewPassword('');
        refreshData();
      } else {
        toast.error(result.error || 'Gagal mereset password');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate random password
  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Mentor</h1>
          <p className="text-gray-600">Tambah, edit, dan hapus data mentor</p>
        </div>
        <Button onClick={handleOpenAddModal} className="gap-2">
          <Plus className="size-4" />
          Tambah Mentor
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari nama, NIP, atau divisi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Mentor Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            Daftar Mentor ({filteredMentors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMentors.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-4 size-12 text-gray-400" />
              <p className="text-gray-600">Tidak ada data mentor</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Divisi</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead className="text-center">Intern</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMentors.map((mentor) => (
                  <TableRow key={mentor.id}>
                    <TableCell>
                      <img
                        src={mentor.photo}
                        alt={mentor.name}
                        className="size-10 rounded-full object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{mentor.name}</TableCell>
                    <TableCell>{mentor.nip}</TableCell>
                    <TableCell>{mentor.division}</TableCell>
                    <TableCell>{mentor.position}</TableCell>
                    <TableCell className="text-center">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        {getInternCount(mentor.id)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleOpenEditModal(mentor)}
                          title="Edit"
                        >
                          <Pencil className="size-4 text-blue-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setResetPasswordMentor(mentor)}
                          title="Reset Password"
                        >
                          <RefreshCw className="size-4 text-orange-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteMentor(mentor)}
                          title="Hapus"
                          disabled={getInternCount(mentor.id) > 0}
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog 
        open={isAddModalOpen || !!editingMentor} 
        onOpenChange={() => {
          setIsAddModalOpen(false);
          setEditingMentor(null);
          resetForm();
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMentor ? 'Edit Mentor' : 'Tambah Mentor Baru'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Photo Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={formData.photo}
                  alt="Preview"
                  className="size-20 rounded-full object-cover ring-4 ring-gray-100"
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

            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Nama lengkap mentor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nip">NIP *</Label>
              <Input
                id="nip"
                value={formData.nip}
                onChange={(e) => setFormData((prev) => ({ ...prev, nip: e.target.value }))}
                placeholder="Nomor Induk Pegawai"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="division">Divisi *</Label>
              <Input
                id="division"
                value={formData.division}
                onChange={(e) => setFormData((prev) => ({ ...prev, division: e.target.value }))}
                placeholder="Contoh: Distribusi, IT, SDM"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Jabatan</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                placeholder="Contoh: Manager, Supervisor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password {editingMentor ? '(kosongkan jika tidak diubah)' : '*'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Password untuk login"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingMentor(null);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              <X className="mr-2 size-4" />
              Batal
            </Button>
            <Button 
              onClick={editingMentor ? handleUpdate : handleCreate}
              disabled={isSubmitting}
            >
              <Save className="mr-2 size-4" />
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteMentor} onOpenChange={() => setDeleteMentor(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="size-5" />
              Konfirmasi Hapus
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus mentor <strong>{deleteMentor?.name}</strong>?
              Tindakan ini tidak dapat dibatalkan.
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

      {/* Reset Password Dialog */}
      <Dialog open={!!resetPasswordMentor} onOpenChange={(open) => {
        if (!open) {
          setResetPasswordMentor(null);
          setNewPassword('');
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600">
              <RefreshCw className="size-5" />
              Reset Password
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Reset password untuk mentor <strong>{resetPasswordMentor?.name}</strong>?
            </p>

            <div className="space-y-2">
              <Label htmlFor="new-password">Password Baru</Label>
              <div className="flex gap-2">
                <Input
                  id="new-password"
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru..."
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={generatePassword}
                  title="Generate Password"
                >
                  <RefreshCw className="size-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">Minimal 6 karakter</p>
            </div>

            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs text-amber-800">
                ⚠️ Password lama akan dihapus dan diganti dengan password baru.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setResetPasswordMentor(null);
                setNewPassword('');
              }}
            >
              Batal
            </Button>
            <Button 
              onClick={handleResetPassword}
              disabled={isSubmitting || !newPassword}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? 'Menyimpan...' : 'Reset Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Credentials Dialog - Show after creating mentor */}
      <Dialog open={!!credentialsMentor} onOpenChange={() => setCredentialsMentor(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Key className="size-5" />
              Mentor Berhasil Ditambahkan!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Berikut adalah kredensial login untuk <strong>{credentialsMentor?.name}</strong>. 
              Silakan informasikan ke mentor yang bersangkutan.
            </p>

            <div className="rounded-lg bg-gray-50 p-4 space-y-3">
              {/* NIP/Username */}
              <div>
                <label className="text-xs font-medium text-gray-500">NIP (Username)</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 rounded bg-white px-3 py-2 font-mono text-sm border">
                    {credentialsMentor?.nip}
                  </code>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleCopy(credentialsMentor?.nip || '', 'nip')}
                    title="Salin NIP"
                  >
                    {copiedField === 'nip' ? (
                      <Check className="size-4 text-green-600" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-medium text-gray-500">Password</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 rounded bg-white px-3 py-2 font-mono text-sm border">
                    {credentialsMentor?.password}
                  </code>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleCopy(credentialsMentor?.password || '', 'password')}
                    title="Salin Password"
                  >
                    {copiedField === 'password' ? (
                      <Check className="size-4 text-green-600" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs text-amber-800">
                ⚠️ <strong>Penting:</strong> Password ini hanya ditampilkan sekali. 
                Pastikan mentor mencatat atau langsung mengubah password setelah login pertama.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setCredentialsMentor(null)} className="w-full">
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
