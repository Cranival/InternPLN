import { useParams, Link } from 'react-router';
import { useData } from '../contexts/DataContext';
import { mockMentors } from '../data/mockData';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  ArrowLeft,
  Calendar,
  Mail,
  User,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

export function InternDetail() {
  const { id } = useParams<{ id: string }>();
  const { interns } = useData();

  const intern = interns.find((i) => i.id === id && i.status === 'approved');

  if (!intern) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Data intern tidak ditemukan</p>
            <Link to="/intern" className="mt-4 inline-block">
              <Button>Kembali ke Daftar Intern</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mentor = mockMentors.find((m) => m.id === intern.mentorId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link to="/intern">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="size-4" />
            Kembali
          </Button>
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="mb-6 text-center">
                  <img
                    src={intern.photo}
                    alt={intern.name}
                    className="mx-auto mb-4 size-32 rounded-full object-cover ring-4 ring-blue-100"
                  />
                  <h2 className="mb-1 text-xl font-bold">{intern.name}</h2>
                  <p className="text-sm text-gray-600">{intern.school}</p>
                  <div className="mt-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {intern.division}
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-start gap-3 text-sm">
                    <GraduationCap className="mt-0.5 size-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Jurusan</p>
                      <p className="font-medium">{intern.major}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <Calendar className="mt-0.5 size-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Periode</p>
                      <p className="font-medium">
                        {new Date(intern.periodStart).toLocaleDateString(
                          'id-ID',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }
                        )}{' '}
                        -{' '}
                        {new Date(intern.periodEnd).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {mentor && (
                    <div className="flex items-start gap-3 text-sm">
                      <User className="mt-0.5 size-4 text-gray-400" />
                      <div>
                        <p className="text-gray-600">Mentor</p>
                        <p className="font-medium">{mentor.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Contact Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <Briefcase className="size-5" />
                  Informasi Kontak
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {intern.email && (
                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                      <Mail className="size-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-600">Email</p>
                        <p className="font-medium">{intern.email}</p>
                      </div>
                    </div>
                  )}
                  {intern.socialMedia && (
                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 sm:col-span-2">
                      <User className="size-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-600">Sosial Media</p>
                        <p className="font-medium">{intern.socialMedia}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Kesan */}
            {intern.impression && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 font-semibold">Kesan</h3>
                  <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {intern.impression}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pesan */}
            {intern.message && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 font-semibold">Pesan</h3>
                  <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {intern.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {intern.galleryPhotos.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 font-semibold">
                    Foto Kenangan ({intern.galleryPhotos.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {intern.galleryPhotos.map((photo, index) => (
                      <div
                        key={index}
                        className="group relative aspect-square overflow-hidden rounded-lg"
                      >
                        <img
                          src={photo}
                          alt={`Gallery ${index + 1}`}
                          className="size-full object-cover transition group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
