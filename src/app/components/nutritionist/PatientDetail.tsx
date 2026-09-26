import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import Header from '../shared/Header';
import {
  Edit,
  FileText,
  TrendingUp,
  Calendar,
  Eye,
  ShieldCheck,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '../../App';
import { generateConsistentDemoPatients } from '../../utils/generateDemoPatients';

interface ArcoRequest {
  id: string;
  folio: string;
  type: 'Acceso' | 'Rectificación' | 'Cancelación' | 'Oposición';
  requestDate: string;
  status: 'Pendiente' | 'En proceso' | 'Resuelto' | 'Vencido';
  daysRemaining: number;
  details: string;
}

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStudentsAccount = user?.planType === 'students';
  const userEmail = user?.email || 'nutritionist@nutriapp.com';

  const [selectedRequest, setSelectedRequest] = useState<ArcoRequest | null>(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentEmail, setConsentEmail] = useState('');
  const [consentCode, setConsentCode] = useState('');

  // Determine consent status based on last char of id
  const lastChar = id ? id.charAt(id.length - 1) : '0';
  const lastDigit = parseInt(lastChar, 10);
  const initialConsentStatus: 'pending' | 'active' =
    !isNaN(lastDigit) && lastDigit % 2 !== 0 ? 'pending' : 'active';

  const [consentStatus, setConsentStatus] = useState<'pending' | 'active'>(initialConsentStatus);

  const [patient, setPatient] = useState<any>(null);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (isStudentsAccount) {
      const demoPatients = generateConsistentDemoPatients(userEmail, 10);
      const foundPatient = demoPatients.find((p) => p.id === id);

      if (foundPatient) {
        const bmi = (foundPatient.weight / Math.pow(foundPatient.height / 100, 2)).toFixed(1);
        setPatient({
          name: foundPatient.fullName,
          age: foundPatient.age,
          bloodType: foundPatient.bloodType,
          email: foundPatient.email,
          phone: foundPatient.phone,
          height: foundPatient.height,
          weight: foundPatient.weight,
          bmi: parseFloat(bmi),
          allergies: foundPatient.allergies || 'Ninguna',
          illnesses: foundPatient.illnesses || 'Ninguna',
          goals: foundPatient.goals,
        });

        setProgressData([
          { date: '2026-04-01', weight: foundPatient.weight + 2.5 },
          { date: '2026-04-08', weight: foundPatient.weight + 1.8 },
          { date: '2026-04-15', weight: foundPatient.weight + 1.2 },
          { date: '2026-04-22', weight: foundPatient.weight + 0.5 },
          { date: '2026-05-01', weight: foundPatient.weight },
        ]);

        setAppointments([]);
      }
    } else {
      setPatient({
        name: 'María Rodríguez',
        age: 32,
        bloodType: 'A+',
        email: 'maria.rodriguez@example.com',
        phone: '+52 555 123 4567',
        height: 165,
        weight: 68,
        bmi: 25.0,
        allergies: 'Intolerancia a la lactosa',
        illnesses: 'Pre-diabetes',
        goals: 'Pérdida de peso y control de glucosa',
      });

      setProgressData([
        { date: '2023-12-01', weight: 70.5 },
        { date: '2023-12-08', weight: 70.0 },
        { date: '2023-12-15', weight: 69.2 },
        { date: '2023-12-22', weight: 68.5 },
        { date: '2023-12-29', weight: 68.0 },
      ]);

      setAppointments([
        { id: '1', date: '2024-01-08', time: '10:00 AM', type: 'Seguimiento', status: 'Scheduled' },
        { id: '2', date: '2023-12-18', time: '2:00 PM', type: 'Consulta inicial', status: 'Completed' },
      ]);
    }
  }, [id, isStudentsAccount, userEmail]);

  const arcoRequests: ArcoRequest[] = [
    {
      id: '1',
      folio: 'ARCO-2026-1234',
      type: 'Acceso',
      requestDate: '2026-04-10',
      status: 'En proceso',
      daysRemaining: 12,
      details: 'Paciente solicitó copia completa de su expediente clínico para consulta con otro especialista.',
    },
    {
      id: '2',
      folio: 'ARCO-2026-0895',
      requestDate: '2026-03-28',
      type: 'Rectificación',
      status: 'Pendiente',
      daysRemaining: 4,
      details: 'Solicitud de corrección de alergias registradas. Indica que la alergia a lactosa fue superada.',
    },
  ];

  const handleViewRequest = (request: ArcoRequest) => {
    setSelectedRequest(request);
    setShowRequestDialog(true);
  };

  const handleResolveRequest = (_requestId: string) => {
    toast.success('Solicitud marcada como resuelta');
    setShowRequestDialog(false);
  };

  const handleConsentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentEmail.trim() || consentCode.trim().length !== 6) {
      toast.error('Ingresa el correo del paciente y el código de 6 dígitos.');
      return;
    }
    toast.success('Consentimiento registrado. El expediente ahora está Activo.');
    setShowConsentModal(false);
    setConsentStatus('active');
    toast.success('Expediente activado. Ya puedes capturar datos de salud.');
  };

  const getStatusBadge = (status: ArcoRequest['status']) => {
    const variants: Record<ArcoRequest['status'], string> = {
      Pendiente: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      'En proceso': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      Resuelto: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
      Vencido: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[status]}`}
      >
        {status}
      </span>
    );
  };

  const getDaysRemainingColor = (days: number) => {
    if (days <= 5) return 'text-red-600 dark:text-red-400 font-semibold';
    if (days <= 10) return 'text-amber-600 dark:text-amber-400';
    return 'text-slate-600 dark:text-slate-400';
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-6">
        <Header title="Detalles del Paciente" showBack />
        <div className="p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-6">
      <Header title="Detalles del Paciente" showBack />

      {/* Consent pending banner */}
      {consentStatus === 'pending' && (
        <div className="mx-4 mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-amber-800 dark:text-amber-400 font-medium">
              Pendiente de consentimiento
            </p>
            <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
              No puedes capturar datos de salud hasta que el paciente complete el proceso de
              consentimiento.
            </p>
          </div>
        </div>
      )}

      {/* Consent in this device button */}
      {consentStatus === 'pending' && (
        <div className="mx-4 mt-3">
          <button
            onClick={() => setShowConsentModal(true)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            Consentimiento en este dispositivo
          </button>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Patient Header */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">{patient.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-white mb-1">{patient.name}</h2>
              <p className="text-emerald-100">
                {patient.age} años • {patient.bloodType}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-emerald-100 mb-1">Altura</p>
              <p className="text-white">{patient.height} cm</p>
            </div>
            <div>
              <p className="text-emerald-100 mb-1">Peso</p>
              <p className="text-white">{patient.weight} kg</p>
            </div>
            <div>
              <p className="text-emerald-100 mb-1">IMC</p>
              <p className="text-white">{patient.bmi}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate(`/nutritionist/patients/${id}/edit`)}
            className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-3 transition-colors"
          >
            <Edit className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Editar Info</span>
          </button>
          <button
            onClick={() => {
              if (consentStatus === 'pending') {
                toast.error('El paciente debe completar el consentimiento antes de asignar una dieta.');
                return;
              }
              navigate(`/nutritionist/patients/${id}/assign-diet`);
            }}
            disabled={consentStatus === 'pending'}
            className={`rounded-xl p-4 flex items-center gap-3 transition-colors ${
              consentStatus === 'pending'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Asignar Dieta</span>
          </button>
        </div>

        {/* Medical Information */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-3 font-semibold">Información Médica</h3>

          <div className="space-y-3">
            <div>
              <p className="text-slate-500 dark:text-slate-400 mb-1 text-sm">Alergias</p>
              <p className="text-slate-900 dark:text-white">{patient.allergies || 'Ninguna'}</p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              <p className="text-slate-500 dark:text-slate-400 mb-1 text-sm">Condiciones Actuales</p>
              <p className="text-slate-900 dark:text-white">{patient.illnesses || 'Ninguna'}</p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              <p className="text-slate-500 dark:text-slate-400 mb-1 text-sm">Objetivos</p>
              <p className="text-slate-900 dark:text-white">{patient.goals}</p>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 dark:text-white font-semibold">Progreso de Peso</h3>
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="space-y-2">
            {progressData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 text-sm">
                  {new Date(entry.date).toLocaleDateString('es-MX')}
                </span>
                <span className="text-slate-900 dark:text-white">{entry.weight} kg</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate(`/nutritionist/patients/${id}/diet`)}
            className="w-full mt-4 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Ver Historial Completo
          </button>
        </div>

        {/* Appointments - Only for regular nutritionists */}
        {!isStudentsAccount && appointments.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 dark:text-white font-semibold">Citas</h3>
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-start justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div>
                    <p className="text-slate-900 dark:text-white mb-1">{appointment.type}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      {new Date(appointment.date).toLocaleDateString('es-MX')} • {appointment.time}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      appointment.status === 'Scheduled'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {appointment.status === 'Scheduled' ? 'Programada' : 'Completada'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-3 font-semibold">Información de Contacto</h3>

          <div className="space-y-3">
            <div>
              <p className="text-slate-500 dark:text-slate-400 mb-1 text-sm">Correo</p>
              <a href={`mailto:${patient.email}`} className="text-emerald-600 dark:text-emerald-400">
                {patient.email}
              </a>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              <p className="text-slate-500 dark:text-slate-400 mb-1 text-sm">Teléfono</p>
              <a href={`tel:${patient.phone}`} className="text-emerald-600 dark:text-emerald-400">
                {patient.phone}
              </a>
            </div>
          </div>
        </div>

        {/* ARCO Requests Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-slate-900 dark:text-white font-semibold">Solicitudes ARCO</h3>
            </div>
          </div>

          {arcoRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                No hay solicitudes ARCO activas para este paciente
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 px-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-slate-700">
                    <TableHead className="text-slate-700 dark:text-slate-300">Folio</TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">Tipo</TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">Fecha solicitud</TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">Días restantes</TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">Estado</TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {arcoRequests.map((request) => (
                    <TableRow key={request.id} className="border-slate-200 dark:border-slate-700">
                      <TableCell className="font-medium text-slate-900 dark:text-white">
                        {request.folio}
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">
                        {request.type}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {new Date(request.requestDate).toLocaleDateString('es-MX', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className={getDaysRemainingColor(request.daysRemaining)}>
                        {request.daysRemaining} días
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleViewRequest(request)}
                          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Ver detalle
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* ARCO Request Detail Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-lg bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">
              Detalle de Solicitud ARCO
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Folio</p>
                  <p className="text-slate-900 dark:text-white font-medium">{selectedRequest.folio}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Tipo de solicitud</p>
                  <p className="text-slate-900 dark:text-white font-medium">{selectedRequest.type}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Fecha de solicitud</p>
                  <p className="text-slate-900 dark:text-white">
                    {new Date(selectedRequest.requestDate).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Estado</p>
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Detalles de la solicitud</p>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                  <p className="text-sm text-slate-700 dark:text-slate-300">{selectedRequest.details}</p>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg ${
                  selectedRequest.daysRemaining <= 5
                    ? 'bg-red-50 dark:bg-red-900/20'
                    : 'bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <p className="text-sm">
                  <span
                    className={
                      selectedRequest.daysRemaining <= 5
                        ? 'text-red-700 dark:text-red-400'
                        : 'text-blue-700 dark:text-blue-400'
                    }
                  >
                    {selectedRequest.daysRemaining} días restantes
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {' '}
                    para responder (plazo legal: veinte días)
                  </span>
                </p>
              </div>

              {selectedRequest.status !== 'Resuelto' && (
                <button
                  onClick={() => handleResolveRequest(selectedRequest.id)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  Marcar como resuelto
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Consentimiento en consultorio
              </h2>
              <button
                onClick={() => setShowConsentModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            <p className="text-slate-700 dark:text-slate-300 text-sm mb-3">
              El paciente debe iniciar sesión con su propio usuario para completar el consentimiento.
            </p>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-4">
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                <strong className="text-slate-700 dark:text-slate-300">Se registrará:</strong>{' '}
                identidad del titular, mecanismo (dispositivo del nutriólogo), versión del aviso,
                fecha, hora y folio.
              </p>
            </div>

            <form onSubmit={handleConsentSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="consentEmail"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Correo del paciente
                </label>
                <input
                  id="consentEmail"
                  type="email"
                  value={consentEmail}
                  onChange={(e) => setConsentEmail(e.target.value)}
                  placeholder="paciente@ejemplo.com"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label
                  htmlFor="consentCode"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Código de verificación <span className="text-slate-500 dark:text-slate-400">(6 dígitos)</span>
                </label>
                <input
                  id="consentCode"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={consentCode}
                  onChange={(e) => setConsentCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 tracking-widest text-center text-lg"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConsentModal(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  Completar consentimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
