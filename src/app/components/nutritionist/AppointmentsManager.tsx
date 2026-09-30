import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import { useApp } from '../../contexts/AppContext';
import { Calendar, Clock, DollarSign, Check, X, Tag, User, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner';
import { useAuth } from '../../App';

interface PendingRequest {
  id: string;
  patientName: string;
  patientInitials: string;
  requestedSlot: string;
  expiresAt: string;
  isFirstTime: boolean;
}

export default function AppointmentsManager() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStudentsAccount = user?.planType === 'students';
  const { appointments, updateAppointment } = useApp();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null);
  const [rejectForm, setRejectForm] = useState({
    reason: '',
    description: '',
  });
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: number }>({});

  // Mock pending requests
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([
    {
      id: '1',
      patientName: 'Carlos Mendoza',
      patientInitials: 'CM',
      requestedSlot: '2026-04-23T14:00',
      expiresAt: new Date(Date.now() + 47 * 60 * 60 * 1000).toISOString(), // 47 hours from now
      isFirstTime: true,
    },
    {
      id: '2',
      patientName: 'Laura Sánchez',
      patientInitials: 'LS',
      requestedSlot: '2026-04-24T10:00',
      expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
      isFirstTime: true,
    },
  ]);

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining: { [key: string]: number } = {};
      pendingRequests.forEach((request) => {
        const expires = new Date(request.expiresAt).getTime();
        const now = Date.now();
        const hoursLeft = Math.max(0, Math.floor((expires - now) / (1000 * 60 * 60)));
        newTimeRemaining[request.id] = hoursLeft;

        // Auto-expire
        if (hoursLeft === 0) {
          setPendingRequests(prev => prev.filter(r => r.id !== request.id));
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 60000); // Update every minute

    // Initial update
    const initialTimeRemaining: { [key: string]: number } = {};
    pendingRequests.forEach((request) => {
      const expires = new Date(request.expiresAt).getTime();
      const now = Date.now();
      const hoursLeft = Math.max(0, Math.floor((expires - now) / (1000 * 60 * 60)));
      initialTimeRemaining[request.id] = hoursLeft;
    });
    setTimeRemaining(initialTimeRemaining);

    return () => clearInterval(interval);
  }, [pendingRequests]);

  const formatSlot = (slotString: string) => {
    try {
      const [date, time] = slotString.split('T');
      const dateObj = new Date(date);
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return `${days[dateObj.getDay()]} ${dateObj.getDate()} ${months[dateObj.getMonth()]} - ${time} hrs`;
    } catch {
      return slotString;
    }
  };

  const handleConfirmRequest = (request: PendingRequest) => {
    setPendingRequests(prev => prev.filter(r => r.id !== request.id));

    // When confirming a first-time patient, they count towards the plan's patient limit
    // They will continue to count even if appointments are cancelled later
    if (request.isFirstTime) {
      toast.success(
        `Cita confirmada. ${request.patientName} ahora cuenta como 1 de tus pacientes activos en tu plan.`,
        { duration: 5000 }
      );
    } else {
      toast.success(`Cita confirmada. ${request.patientName} será notificado.`);
    }

    // Mock: In real implementation, this would update the active patients count
    // and create the appointment in ACTIVE status
  };

  const handleOpenRejectModal = (request: PendingRequest) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleRejectRequest = () => {
    if (!selectedRequest || !rejectForm.reason) {
      toast.error('Selecciona una razón');
      return;
    }
    setPendingRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
    toast.success('Solicitud rechazada. El paciente será notificado.');
    setShowRejectModal(false);
    setRejectForm({ reason: '', description: '' });
    setSelectedRequest(null);
  };

  const filteredAppointments = filterStatus === 'all'
    ? appointments
    : appointments.filter(apt => apt.status === filterStatus);

  const handleStatusChange = (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    updateAppointment(id, { status });
  };

  const handlePaymentToggle = (id: string, currentPaid: boolean) => {
    updateAppointment(id, { isPaid: !currentPaid });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'confirmed':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'completed':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Gestión de Citas" showBack showMenu />

      <div className="p-4 space-y-6">
        {/* Pending Patient Requests */}
        {pendingRequests.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Solicitudes de nuevos pacientes
            </h2>
            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <AlertDescription className="text-blue-900 dark:text-blue-100 text-sm">
                <span className="font-medium">Nota importante:</span> Al aceptar la primera cita de un paciente nuevo, este contará como 1 de tus pacientes activos en tu plan. Seguirá contando aunque canceles citas futuras.
              </AlertDescription>
            </Alert>
            {pendingRequests.map((request) => {
              const hoursLeft = timeRemaining[request.id] || 0;
              const isUrgent = hoursLeft < 6;

              return (
                <Card key={request.id} className={isUrgent ? 'border-red-300 dark:border-red-800' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-emerald-500 text-white">
                          {request.patientInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {request.patientName}
                          </h3>
                          {request.isFirstTime && (
                            <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                              Paciente nuevo
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          {formatSlot(request.requestedSlot)}
                        </p>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className={`text-sm font-medium ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            Tienes {hoursLeft} horas para responder
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirmRequest(request)}
                        className="flex-1 py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Confirmar cita
                      </button>
                      <button
                        onClick={() => handleOpenRejectModal(request)}
                        className="flex-1 py-2 px-4 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Rechazar
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm flex gap-1 overflow-x-auto">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {status === 'all' ? 'Todas' : getStatusText(status)}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Total Citas</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{appointments.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Ingresos Totales</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ${appointments
                .filter(apt => apt.status === 'completed' && apt.isPaid)
                .reduce((sum, apt) => sum + apt.finalPrice, 0)
                .toLocaleString('es-MX')}
            </p>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-3">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm text-center">
              <Calendar className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">
                No hay citas {filterStatus !== 'all' ? getStatusText(filterStatus).toLowerCase() + 's' : ''}
              </p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-slate-900 dark:text-white font-medium">
                        {appointment.patientName}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {appointment.consultationType.name}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(appointment.date).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{appointment.time}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Precio Base:</span>
                    <span className="text-slate-900 dark:text-white">${appointment.basePrice.toLocaleString('es-MX')} MXN</span>
                  </div>
                  {appointment.discount > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          Descuento {appointment.couponCode && `(${appointment.couponCode})`}:
                        </span>
                        <span className="text-red-600 dark:text-red-400">-${appointment.discount.toLocaleString('es-MX')} MXN</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between font-medium pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-900 dark:text-white">Total:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-lg">
                      ${appointment.finalPrice.toLocaleString('es-MX')} MXN
                    </span>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Estado de Pago:</span>
                  <button
                    onClick={() => handlePaymentToggle(appointment.id, appointment.isPaid)}
                    disabled={appointment.status !== 'completed'}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      appointment.isPaid
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    } ${appointment.status !== 'completed' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {appointment.isPaid ? '✓ Pagado' : 'Sin Pagar'}
                  </button>
                </div>

                {/* Notes */}
                {appointment.notes && (
                  <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <span className="font-medium">Notas: </span>
                      {appointment.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {appointment.status !== 'cancelled' && (
                  <div className="flex gap-2">
                    {appointment.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Confirmar
                      </button>
                    )}
                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(appointment.id, 'completed')}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Completar
                      </button>
                    )}
                    {appointment.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Rechazar solicitud</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Razón <span className="text-red-500">*</span>
              </label>
              <select
                value={rejectForm.reason}
                onChange={(e) => setRejectForm({ ...rejectForm, reason: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Selecciona una razón</option>
                <option value="no-disponibilidad">No tengo disponibilidad en ese horario</option>
                <option value="agenda-llena">Mi agenda está llena</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Descripción adicional
              </label>
              <textarea
                rows={4}
                placeholder="Detalles opcionales..."
                value={rejectForm.description}
                onChange={(e) => setRejectForm({ ...rejectForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowRejectModal(false)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleRejectRequest}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Confirmar rechazo
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MobileNav role="nutritionist" isStudentsAccount={isStudentsAccount} />
    </div>
  );
}
