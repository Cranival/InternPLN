import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useData } from '../contexts/DataContext';
import { mockMentors } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Plus, X, Upload } from 'lucide-react';
import { toast } from 'sonner';

export function AddIntern() {
  const navigate = useNavigate();
  const { addIntern } = useData();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    socialMedia: '',
    school: '',
    major: '',
    location: '',
    division: '',
    mentorId: '',
    periodStart: '',
    periodEnd: '',
    impression: '',
    message: '',
  });

  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.school || !formData.mentorId) {
      toast.error('Mohon lengkapi field yang wajib diisi');
      return;
    }

    // Create new intern with mock photo URLs from Unsplash
    const newIntern = {
      id: Date.now().toString(),
      ...formData,
      photo:
        photoPreview ||
        'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400',
      galleryPhotos: galleryPreviews.length > 0 ? galleryPreviews : [],
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    addIntern(newIntern);
    toast.success(
      'Data intern berhasil dikirim! Menunggu approval dari mentor.'
    );
    navigate('/intern');
  };

  const handlePhotoUpload = () => {
    // Mock photo upload - using Unsplash
    setPhotoPreview('https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400');
    toast.success('Foto profil berhasil diupload');
  };

  const handleGalleryUpload = () => {
    // Mock gallery upload
    const newPhoto = `https://images.unsplash.com/photo-${1552664730 + galleryPreviews.length}?w=600`;
    setGalleryPreviews([...galleryPreviews, newPhoto]);
    toast.success('Foto kenangan berhasil ditambahkan');
  };

  const removeGalleryPhoto = (index: number) => {
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-blue-900">
            Tambah Data Intern
          </h1>
          <p className="text-gray-600">
            Isi formulir di bawah untuk mendaftar sebagai intern PLN
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Data Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">No. HP</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="081234567890"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="socialMedia">Sosial Media</Label>
                <Input
                  id="socialMedia"
                  value={formData.socialMedia}
                  onChange={(e) =>
                    setFormData({ ...formData, socialMedia: e.target.value })
                  }
                  placeholder="@username"
                />
              </div>

              <div>
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Alamat lengkap"
                  rows={3}
                />
              </div>

              <div>
                <Label>Foto Profil</Label>
                <div className="flex items-center gap-4">
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="size-20 rounded-full object-cover"
                    />
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePhotoUpload}
                    className="gap-2"
                  >
                    <Upload className="size-4" />
                    {photoPreview ? 'Ganti Foto' : 'Upload Foto'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Data Akademik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="school">
                  Kampus/Sekolah <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="school"
                  value={formData.school}
                  onChange={(e) =>
                    setFormData({ ...formData, school: e.target.value })
                  }
                  placeholder="Nama kampus atau sekolah"
                  required
                />
              </div>

              <div>
                <Label htmlFor="major">Jurusan</Label>
                <Input
                  id="major"
                  value={formData.major}
                  onChange={(e) =>
                    setFormData({ ...formData, major: e.target.value })
                  }
                  placeholder="Nama jurusan"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Data Magang</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="location">Lokasi PLN</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Contoh: PLN Kantor Pusat"
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
                  placeholder="Contoh: Teknologi Informasi"
                />
              </div>

              <div>
                <Label htmlFor="mentor">
                  Mentor <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.mentorId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, mentorId: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMentors.map((mentor) => (
                      <SelectItem key={mentor.id} value={mentor.id}>
                        {mentor.name} - {mentor.division}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="periodStart">Periode Mulai</Label>
                  <Input
                    id="periodStart"
                    type="date"
                    value={formData.periodStart}
                    onChange={(e) =>
                      setFormData({ ...formData, periodStart: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="periodEnd">Periode Selesai</Label>
                  <Input
                    id="periodEnd"
                    type="date"
                    value={formData.periodEnd}
                    onChange={(e) =>
                      setFormData({ ...formData, periodEnd: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Kesan & Pesan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="impression">Kesan</Label>
                <Textarea
                  id="impression"
                  value={formData.impression}
                  onChange={(e) =>
                    setFormData({ ...formData, impression: e.target.value })
                  }
                  placeholder="Ceritakan kesan Anda selama magang..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="message">Pesan</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Pesan untuk PLN..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Foto Kenangan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGalleryUpload}
                  className="gap-2"
                >
                  <Plus className="size-4" />
                  Tambah Foto Kenangan
                </Button>
              </div>

              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                  {galleryPreviews.map((photo, index) => (
                    <div key={index} className="group relative">
                      <img
                        src={photo}
                        alt={`Gallery ${index + 1}`}
                        className="aspect-square w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryPhoto(index)}
                        className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" size="lg" className="flex-1">
              Submit Data Intern
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate('/intern')}
            >
              Batal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
