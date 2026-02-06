import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { CheckCircle, XCircle, Eye, Clock, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export function ApprovalPage() {
  const { currentMentor } = useAuth();
  const { interns, approveIntern, rejectIntern } = useData();
  const [selectedIntern, setSelectedIntern] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!currentMentor) return null;

  const pendingInterns = interns.filter(
    (i) => i.mentorId === currentMentor.id && i.status === 'pending'
  );

  const intern = interns.find((i) => i.id === selectedIntern);

  const handleApprove = async () => {
    if (selectedIntern) {
      setIsProcessing(true);
      try {
        await approveIntern(selectedIntern);
        if (comment.trim()) {
          toast.success(
            <div>
              <p className="font-semibold">Intern berhasil disetujui!</p>
              <p className="text-sm text-gray-600">Komentar: {comment}</p>
            </div>
          );
        } else {
          toast.success('Intern berhasil disetujui!');
        }
        setSelectedIntern(null);
        setComment('');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleReject = async () => {
    if (selectedIntern) {
      setIsProcessing(true);
      try {
        await rejectIntern(selectedIntern);
        if (comment.trim()) {
          toast.error(
            <div>
              <p className="font-semibold">Intern ditolak</p>
              <p className="text-sm">Alasan: {comment}</p>
            </div>
          );
        } else {
          toast.error('Intern ditolak dan dihapus dari sistem');
        }
        setSelectedIntern(null);
        setComment('');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCloseDialog = () => {
    setSelectedIntern(null);
    setComment('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Approval Intern
        </h1>
        <p className="text-gray-600">
          Review dan approve data intern yang masuk
        </p>
      </div>

      {pendingInterns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="mx-auto mb-4 size-12 text-gray-400" />
            <p className="text-gray-600">
              Tidak ada intern yang menunggu approval
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pendingInterns.map((intern) => (
            <Card key={intern.id} className="overflow-hidden">
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={intern.photo}
                    alt={intern.name}
                    className="size-full object-cover"
                  />
                </div>
                <div className="absolute right-2 top-2 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                  <Clock className="mr-1 inline size-3" />
                  Pending
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="mb-1 font-semibold">{intern.name}</h3>
                <p className="mb-2 text-sm text-gray-600">{intern.school}</p>
                <p className="mb-3 text-xs text-gray-500">
                  {intern.major} • {intern.division}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => setSelectedIntern(intern.id)}
                >
                  <Eye className="size-4" />
                  Review Detail
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedIntern}
        onOpenChange={handleCloseDialog}
      >
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          {intern && (
            <>
              <DialogHeader>
                <DialogTitle>Review Data Intern</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={intern.photo}
                    alt={intern.name}
                    className="size-20 rounded-full object-cover ring-4 ring-blue-100"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{intern.name}</h3>
                    <p className="text-sm text-gray-600">{intern.school}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Jurusan</p>
                    <p className="font-medium">{intern.major}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Divisi</p>
                    <p className="font-medium">{intern.division}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Lokasi</p>
                    <p className="font-medium">{intern.location}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-600">Periode</p>
                    <p className="font-medium">
                      {new Date(intern.periodStart).toLocaleDateString('id-ID')}{' '}
                      - {new Date(intern.periodEnd).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-sm text-gray-600">Kontak</p>
                  <p className="text-sm">{intern.phone}</p>
                  <p className="text-sm">{intern.email}</p>
                  {intern.socialMedia && (
                    <p className="text-sm">{intern.socialMedia}</p>
                  )}
                </div>

                <div>
                  <p className="mb-1 text-sm text-gray-600">Alamat</p>
                  <p className="rounded-lg bg-gray-50 p-3 text-sm">
                    {intern.address}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-sm text-gray-600">Kesan</p>
                  <p className="rounded-lg bg-gray-50 p-3 text-sm">
                    {intern.impression}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-sm text-gray-600">Pesan</p>
                  <p className="rounded-lg bg-gray-50 p-3 text-sm">
                    {intern.message}
                  </p>
                </div>

                {intern.galleryPhotos.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm text-gray-600">
                      Foto Kenangan ({intern.galleryPhotos.length})
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {intern.galleryPhotos.map((photo, index) => (
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

                {/* Comment Section */}
                <div className="border-t pt-4">
                  <Label htmlFor="comment" className="flex items-center gap-2 mb-2">
                    <MessageSquare className="size-4 text-gray-500" />
                    Komentar <span className="text-gray-400 font-normal">(opsional)</span>
                  </Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tambahkan komentar atau catatan untuk intern ini..."
                    rows={3}
                    disabled={isProcessing}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Komentar akan ditampilkan saat menyetujui atau menolak intern
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                <Button
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={isProcessing}
                >
                  Batal
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  className="gap-2"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <XCircle className="size-4" />
                  )}
                  Tolak
                </Button>
                <Button 
                  onClick={handleApprove} 
                  className="gap-2"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <CheckCircle className="size-4" />
                  )}
                  Setujui
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
