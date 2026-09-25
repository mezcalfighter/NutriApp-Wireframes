import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';
import { Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ConfirmAppointment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [slotAvailable, setSlotAvailable] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const nutriologoId = searchParams.get('nutriologo');
  const slot = searchParams.get('slot');

  // Mock nutritionist data
  const mockNutritionists: { [key: string]: { name: string; initials: string; price: number } } = {
    '1': { name: 'Lic. Ana García', initials: 'AG', price: 350 },
    '2': { name: 'Dr. Carlos López', initials: 'CL', price: 500 },
    '3': { name: 'Lic. María González', initials: 'MG', price: 450 },
    '4': { name: 'Dra. Patricia Ruiz', initials: 'PR', price: 600 },
  };

  const selectedNutritionist = nutriologoId ? mockNutritionists[nutriologoId] : null;

  const formatSlot = (slotString: string) => {
    try {
      const [date, time] = slotString.split('T');
      const dateObj = new Date(date);
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      return {
        date: `${days[dateObj.getDay()]}, ${dateObj.getDate()} de ${months[dateObj.getMonth()]} de ${dateObj.getFullYear()}`,
        time: time,
      };
    } catch {
      return { date: slotString, time: '' };
    }
  };

  const formattedSlot = slot ? formatSlot(slot) : null;

  useEffect(() => {
    // Mock: Check if slot is still available (compare with current date)
    if (slot) {
      try {
        const slotDate = new Date(slot.split('T')[0]);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (slotDate < today) {
          setSlotAvailable(false);
        }
      } catch {
        setSlotAvailable(false);
      }
    }
  }, [slot]);

  const handleConfirm = () => {
    // Mock: Create appointment request with PENDING_NUTRITIONIST_APPROVAL status
    setShowSuccess(true);
    toast.success('Solicitud enviada exitosamente');
  };

  const handleViewNewAvailability = () => {
    navigate(`/buscar-nutriologo?preselect=${nutriologoId}`);
  };

  if (!nutriologoId || !slot || !selectedNutritionist) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              No se encontró información de la cita.
            </p>
            <button
              onClick={() => navigate('/buscar-nutriologo')}
              className="mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Buscar nutriólogo
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              ¡Solicitud enviada!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              <span className="font-medium">{selectedNutritionist.name}</span> tiene 48 horas para confirmar tu cita. Te notificaremos por email.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Si no recibe confirmación en 48 horas, verás nuevas opciones disponibles automáticamente.
            </p>
            <button
              onClick={() => navigate('/patient/dashboard')}
              className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
            >
              Ir a mi panel
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Confirma tu cita</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nutritionist Info */}
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-emerald-500 text-white text-lg font-semibold">
                  {selectedNutritionist.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-1">
                  {selectedNutritionist.name}
                </h3>
                {formattedSlot && (
                  <>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {formattedSlot.date}
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {formattedSlot.time} hrs
                    </p>
                  </>
                )}
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                  ${selectedNutritionist.price} MXN
                </p>
              </div>
            </div>

            {/* Slot Availability Check */}
            {!slotAvailable ? (
              <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-900 dark:text-amber-100 text-sm">
                  Este horario ya no está disponible.
                </AlertDescription>
              </Alert>
            ) : null}

            {/* Actions */}
            {slotAvailable ? (
              <button
                onClick={handleConfirm}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                Confirmar cita
              </button>
            ) : (
              <button
                onClick={handleViewNewAvailability}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                Ver nueva disponibilidad
              </button>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <button
            onClick={() => navigate('/buscar-nutriologo')}
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            ← Volver a buscar nutriólogos
          </button>
        </div>
      </div>
    </div>
  );
}
