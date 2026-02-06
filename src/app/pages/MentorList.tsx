import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, Award, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

export function MentorList() {
  const { interns, mentors, getMentorById } = useData();
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);

  const getMentorInterns = (mentorId: string) => {
    return interns.filter(
      (i) => i.mentorId === mentorId && i.status === 'approved'
    );
  };

  const mentor = selectedMentor ? getMentorById(selectedMentor) : null;
  const mentorInterns = selectedMentor ? getMentorInterns(selectedMentor) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-blue-900">Daftar Mentor</h1>
        <p className="text-gray-600">
          Pembimbing mahasiswa magang dan siswa PKL di lingkungan PLN
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mentors.map((mentor) => {
          const totalInterns = getMentorInterns(mentor.id).length;
          return (
            <Card
              key={mentor.id}
              className="group overflow-hidden transition hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <img
                      src={mentor.photo}
                      alt={mentor.name}
                      className="size-24 rounded-full object-cover ring-4 ring-blue-100"
                    />
                    <div className="absolute -bottom-2 -right-2 rounded-full bg-blue-600 p-2">
                      <Users className="size-4 text-white" />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="mb-1 font-semibold text-gray-900">
                    {mentor.name}
                  </h3>
                  <p className="mb-2 text-xs text-gray-600">NIP: {mentor.nip}</p>
                  <div className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {mentor.division}
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Award className="size-4" />
                  <span>{totalInterns} Intern Dibimbing</span>
                </div>

                <Button
                  className="w-full gap-2"
                  onClick={() => setSelectedMentor(mentor.id)}
                >
                  Detail Mentor
                  <ChevronRight className="size-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mentor Detail Dialog */}
      <Dialog
        open={!!selectedMentor}
        onOpenChange={() => setSelectedMentor(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {mentor && (
            <>
              <DialogHeader>
                <DialogTitle>Detail Mentor</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={mentor.photo}
                    alt={mentor.name}
                    className="size-20 rounded-full object-cover ring-4 ring-blue-100"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{mentor.name}</h3>
                    <p className="text-sm text-gray-600">NIP: {mentor.nip}</p>
                    <p className="text-sm text-gray-600">{mentor.position}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-gray-600">Divisi</p>
                    <p className="font-semibold">{mentor.division}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-gray-600">Total Intern</p>
                    <p className="font-semibold">{mentorInterns.length} Orang</p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">Daftar Intern Bimbingan</h4>
                  <div className="max-h-60 space-y-2 overflow-y-auto">
                    {mentorInterns.length === 0 ? (
                      <p className="text-center text-sm text-gray-500">
                        Belum ada intern yang dibimbing
                      </p>
                    ) : (
                      mentorInterns.map((intern) => (
                        <div
                          key={intern.id}
                          className="flex items-center gap-3 rounded-lg border p-3"
                        >
                          <img
                            src={intern.photo}
                            alt={intern.name}
                            className="size-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{intern.name}</p>
                            <p className="text-xs text-gray-600">
                              {intern.school} • {intern.major}
                            </p>
                          </div>
                          <div className="text-right text-xs text-gray-500">
                            <p>{new Date(intern.periodStart).getFullYear()}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
