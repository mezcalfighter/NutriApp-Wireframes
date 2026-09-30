import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { User as UserIcon, Clipboard, Heart } from 'lucide-react';
import { useNavigate } from 'react-router';

interface UserTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserTypeDialog({ open, onOpenChange }: UserTypeDialogProps) {
  const navigate = useNavigate();

  const handleSelection = (type: 'patient' | 'nutritionist') => {
    onOpenChange(false);
    if (type === 'patient') {
      navigate('/buscar-nutriologo');
    } else {
      navigate('/pricing');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            ¿Cómo quieres usar NutriApp?
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-6">
          {/* Patient Option */}
          <button
            onClick={() => handleSelection('patient')}
            className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-8 transition-all hover:shadow-lg"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Soy paciente
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Busco nutriólogo y quiero llevar control de mi alimentación
                </p>
              </div>
              <div className="pt-4 border-t border-blue-200 dark:border-blue-800 w-full">
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  100% gratis para pacientes
                </p>
              </div>
            </div>
          </button>

          {/* Nutritionist Option */}
          <button
            onClick={() => handleSelection('nutritionist')}
            className="group relative bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border-2 border-teal-200 dark:border-teal-800 hover:border-teal-500 dark:hover:border-teal-400 rounded-2xl p-8 transition-all hover:shadow-lg"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clipboard className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Soy nutriólogo
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Quiero digitalizar mi consulta y gestionar expedientes
                </p>
              </div>
              <div className="pt-4 border-t border-teal-200 dark:border-teal-800 w-full">
                <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  Desde $13 USD/mes
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-4">
          <p>
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => {
                onOpenChange(false);
                navigate('/login');
              }}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
