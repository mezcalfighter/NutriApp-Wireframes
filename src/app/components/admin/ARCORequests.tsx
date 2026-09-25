import { useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../shared/Header';
import { Shield, Mail, Clock, CheckCircle, FileText, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ARCORequest {
  id: string;
  requestId: string;
  patientName: string;
  patientEmail: string;
  requestType: 'access' | 'rectification' | 'cancelation' | 'opposition';
  requestDate: string;
  status: 'pending' | 'processing' | 'completed';
  description: string;
}

export default function ARCORequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ARCORequest[]>([
    {
      id: '1',
      requestId: 'ARCO-2026-001',
      patientName: 'María García López',
      patientEmail: 'maria.garcia@email.com',
      requestType: 'access',
      requestDate: '2026-05-08T10:30:00Z',
      status: 'pending',
      description: 'Solicito acceso a toda mi información almacenada en el sistema',
    },
    {
      id: '2',
      requestId: 'ARCO-2026-002',
      patientName: 'Juan Pérez Sánchez',
      patientEmail: 'juan.perez@email.com',
      requestType: 'cancelation',
      requestDate: '2026-05-07T15:45:00Z',
      status: 'pending',
      description: 'Solicito la eliminación completa de mis datos personales conforme a NOM-004-SSA3-2012',
    },
  ]);

  const getRequestTypeName = (type: string) => {
    const names: Record<string, string> = {
      access: 'Acceso',
      rectification: 'Rectificación',
      cancelation: 'Cancelación',
      opposition: 'Oposición',
    };
    return names[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
      processing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      completed: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    };
    return colors[status] || '';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Pendiente',
      processing: 'Procesando',
      completed: 'Completado',
    };
    return texts[status] || status;
  };

  const handleSendReport = (request: ARCORequest) => {
    // Simulate sending email with report
    toast.success(
      `Reporte ARCO enviado por email a ${request.patientEmail}`,
      {
        description: `Tipo: ${getRequestTypeName(request.requestType)} | ID: ${request.requestId}`,
      }
    );

    // Update status
    setRequests(prev =>
      prev.map(r =>
        r.id === request.id ? { ...r, status: 'completed' as const } : r
      )
    );
  };

  const handleMarkProcessing = (request: ARCORequest) => {
    setRequests(prev =>
      prev.map(r =>
        r.id === request.id ? { ...r, status: 'processing' as const } : r
      )
    );
    toast.info(`Solicitud ${request.requestId} marcada como "En proceso"`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title="Solicitudes ARCO" showBack />

      <div className="p-4 space-y-6">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Derechos ARCO - LFPDPPP
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Todas las solicitudes deben responderse en <strong>20 días hábiles</strong>. Los reportes se envían automáticamente por email al correo registrado del paciente.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {requests.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Pendientes</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {requests.filter(r => r.status === 'processing').length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">En proceso</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {requests.filter(r => r.status === 'completed').length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Completadas</div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Solicitudes Activas
          </h2>

          {requests.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center border border-slate-200 dark:border-slate-700">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">
                No hay solicitudes ARCO pendientes
              </p>
            </div>
          ) : (
            requests.map(request => (
              <div
                key={request.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {request.requestId}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(request.requestDate).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                {/* Patient Info */}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Paciente:</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {request.patientName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {request.patientEmail}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {getRequestTypeName(request.requestType)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  <strong>Descripción:</strong> {request.description}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {request.status === 'pending' && (
                    <button
                      onClick={() => handleMarkProcessing(request)}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Clock className="w-4 h-4" />
                      Marcar en proceso
                    </button>
                  )}
                  {request.status !== 'completed' && (
                    <button
                      onClick={() => handleSendReport(request)}
                      className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Send className="w-4 h-4" />
                      Enviar reporte por email
                    </button>
                  )}
                  {request.status === 'completed' && (
                    <div className="flex-1 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg flex items-center justify-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Reporte enviado
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
