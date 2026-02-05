import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { User, Save, Camera } from 'lucide-react';
import { toast } from 'sonner';

export function MentorProfile() {
  const { currentMentor } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!currentMentor) return null;

  const [formData, setFormData] = useState({
    name: currentMentor.name,
    position: currentMentor.position,
    division: currentMentor.division,
    photo: currentMentor.photo,
    password: '',
    confirmPassword: '',
  });

  const handleSave = () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok!');
      return;
    }

    // Mock save function
    toast.success('Profil berhasil diupdate!');
    setIsEditing(false);
    setFormData({ ...formData, password: '', confirmPassword: '' });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData({ ...formData, photo: result });
        toast.success('Foto profil berhasil diubah!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Profil Saya</h1>
        <p className="text-gray-600">Kelola informasi profil Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={formData.photo}
                alt={currentMentor.name}
                className="size-24 rounded-full object-cover ring-4 ring-blue-100"
              />
              {isEditing && (
                <>
                  <label htmlFor="photo-upload" className="absolute -bottom-2 -right-2 cursor-pointer rounded-full bg-blue-600 p-2 hover:bg-blue-700 transition-colors">
                    <Camera className="size-4 text-white" />
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </>
              )}
              {!isEditing && (
                <div className="absolute -bottom-2 -right-2 rounded-full bg-blue-600 p-2">
                  <User className="size-4 text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold">{currentMentor.name}</h3>
              <p className="text-sm text-gray-600">
                NIP: {currentMentor.nip}
              </p>
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">
                  Klik ikon kamera untuk mengganti foto
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="position">Jabatan</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="division">Divisi</Label>
              <Input
                id="division"
                value={formData.division}
                onChange={(e) =>
                  setFormData({ ...formData, division: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label>NIP</Label>
              <Input value={currentMentor.nip} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Ubah Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Password Baru</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Kosongkan jika tidak ingin mengubah"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Ulangi password baru"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button onClick={handleSave} className="gap-2">
              <Save className="size-4" />
              Simpan Perubahan
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: currentMentor.name,
                  position: currentMentor.position,
                  division: currentMentor.division,
                  photo: currentMentor.photo,
                  password: '',
                  confirmPassword: '',
                });
              }}
            >
              Batal
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Profil</Button>
        )}
      </div>
    </div>
  );
}
