import { useState } from 'react';
import { Link } from 'react-router';
import { useData } from '../contexts/DataContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, Award, ChevronRight, LogIn } from 'lucide-react';
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
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold tracking-tight text-foreground">Daftar Mentor</h1>
          <p className="text-muted-foreground">
            Pembimbing mahasiswa magang dan siswa PKL di lingkungan PLN
          </p>
        </div>
        <Link to="/login">
          <Button className="gap-3 px-8 py-4 text-lg shadow-md shadow-blue-500/20 hover:shadow-lg transition-all">
            <LogIn className="size-6" />
            Login Mentor
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mentors.map((mentor) => {
          const totalInterns = getMentorInterns(mentor.id).length;
          return (
            <Card
              key={mentor.id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <img
                      src={mentor.photo}
                      alt={mentor.name}
                      className="size-28 rounded-3xl object-cover ring-4 ring-blue-100 shadow-lg transition-transform group-hover:scale-105"
                    />
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-lg ring-4 ring-white dark:ring-slate-900">
                      <Users className="size-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="mb-1 font-semibold text-foreground">
                    {mentor.name}
                  </h3>
                  <p className="mb-2 text-xs text-muted-foreground">NIP: {mentor.nip}</p>
                  <div className="mb-3 inline-block rounded-full bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm">
                    {mentor.division}
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Award className="size-4 text-blue-500" />
                  <span>{totalInterns} Intern Dibimbing</span>
                </div>

                <Button
                  className="w-full gap-2 shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
                  onClick={() => setSelectedMentor(mentor.id)}
                >
                  Detail Mentor
                  <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl">
          {mentor && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="size-5 text-blue-600" />
                  Detail Mentor
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-800 p-4">
                  <img
                    src={mentor.photo}
                    alt={mentor.name}
                    className="size-20 rounded-2xl object-cover ring-4 ring-blue-100 shadow-lg"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{mentor.name}</h3>
                    <p className="text-sm text-muted-foreground">NIP: {mentor.nip}</p>
                    <p className="text-sm text-muted-foreground">{mentor.position}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-100 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800 p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">Divisi</p>
                    <p className="font-semibold text-foreground">{mentor.division}</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800 p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">Total Intern</p>
                    <p className="font-semibold text-foreground">{mentorInterns.length} Orang</p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold text-foreground">Daftar Intern Bimbingan</h4>
                  <div className="max-h-60 space-y-2 overflow-y-auto">
                    {mentorInterns.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        Belum ada intern yang dibimbing
                      </p>
                    ) : (
                      mentorInterns.map((intern) => (
                        <div
                          key={intern.id}
                          className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 transition-all hover:shadow-md hover:border-blue-100 dark:hover:border-blue-800"
                        >
                          <img
                            src={intern.photo}
                            alt={intern.name}
                            className="size-10 rounded-xl object-cover shadow-sm"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{intern.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {intern.school} • {intern.major}
                            </p>
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
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
