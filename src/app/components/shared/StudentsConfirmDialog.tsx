import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface StudentsConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function StudentsConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: StudentsConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Plan Students - Términos y Condiciones</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">Requisitos:</h3>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Correo institucional válido (.edu, .edu.mx, .ipn.mx, .unam.mx, .itesm.mx y similares)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Vigencia de 1 año desde la activación</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">⚠️ Cuenta de Práctica - Datos Ficticios</h3>
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 mb-3">
              <p className="text-sm text-purple-900 dark:text-purple-100">
                Esta cuenta incluye <strong>10 pacientes completamente ficticios</strong> con datos realistas generados automáticamente para practicar. No podrás agregar más pacientes ni modificarlos.
              </p>
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Lo que incluye:</h4>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>10 pacientes ficticios</strong> con datos realistas</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Hasta 15 consultas/mes para practicar</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>10 SMS + 10 WhatsApp mensuales (simulados)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>100 MB almacenamiento temporal</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Expediente clínico digital completo</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Formularios de consentimiento LFPDPPP</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>1 plantilla nutricional</span>
              </li>
            </ul>
          </div>

          <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-900 dark:text-amber-100">
              <p className="font-semibold mb-2">Condiciones importantes:</p>
              <ul className="space-y-1 text-sm">
                <li>• Recibirás aviso por email 24 horas antes del vencimiento</li>
                <li>• Si no migras a un plan de pago, tu cuenta y todos los datos serán eliminados automáticamente conforme a NOM-004</li>
                <li>• Pacientes activos: Un paciente cuenta hacia tu límite al aceptar su primera cita y permanece en tu cuenta aunque canceles citas posteriores</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-400">
            <p className="font-semibold text-slate-900 dark:text-white mb-2">
              Todos los planes incluyen:
            </p>
            <p>
              Cifrado AES-256 · MFA obligatoria · Aviso de privacidad LFPDPPP · Módulo ARCO ·
              Audit log · Eliminación segura NOM-004
            </p>
            <p className="mt-2 text-xs">
              SMS y WhatsApp se contabilizan por separado. Aplican términos y condiciones.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Acepto, continuar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
