import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { toast } from 'sonner';

interface ReportContentProps {
  contentType: 'post' | 'comment';
  contentId: string;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ReportContent({ contentType, contentId, onClose, onSubmit }: ReportContentProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!reason) {
      toast.error('Por favor selecciona un motivo');
      return;
    }

    if (reason === 'otro' && !description.trim()) {
      toast.error('Por favor describe el motivo del reporte');
      return;
    }

    // In a real app, this would submit to backend
    console.log('Report submitted:', {
      contentType,
      contentId,
      reason,
      description,
      timestamp: new Date().toISOString(),
    });

    toast.success('Reporte recibido. Lo revisaremos en un plazo de 48 horas.', {
      duration: 5000,
    });

    onSubmit();
  };

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent className="bg-white dark:bg-slate-900 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-900 dark:text-white">
            Reportar {contentType === 'post' ? 'publicación' : 'comentario'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
            Ayúdanos a mantener la comunidad segura. Selecciona el motivo de tu reporte.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup value={reason} onValueChange={setReason}>
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="informacion_incorrecta" id="r1" className="mt-0.5" />
              <Label htmlFor="r1" className="text-slate-700 dark:text-slate-300 cursor-pointer">
                Información incorrecta o peligrosa
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <RadioGroupItem value="contenido_inapropiado" id="r2" className="mt-0.5" />
              <Label htmlFor="r2" className="text-slate-700 dark:text-slate-300 cursor-pointer">
                Contenido inapropiado u ofensivo
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <RadioGroupItem value="spam" id="r3" className="mt-0.5" />
              <Label htmlFor="r3" className="text-slate-700 dark:text-slate-300 cursor-pointer">
                Spam
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <RadioGroupItem value="otro" id="r4" className="mt-0.5" />
              <Label htmlFor="r4" className="text-slate-700 dark:text-slate-300 cursor-pointer">
                Otro
              </Label>
            </div>
          </RadioGroup>

          {reason === 'otro' && (
            <div>
              <Label htmlFor="description" className="text-slate-700 dark:text-slate-300 mb-2 block">
                Describe el motivo <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe por qué estás reportando este contenido..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
              />
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Enviar reporte
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
