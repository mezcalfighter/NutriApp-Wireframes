import { useNavigate } from 'react-router';
import Header from '../shared/Header';
import { Users, Search, Ban, RefreshCw, Key, Mail, Phone, CheckCircle, XCircle, UserCog, FileText, AlertTriangle, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { generateNutritionists, generatePatients, type Patient, type Nutritionist } from '../../utils/mockData';

interface Report {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  userRole: 'nutritionist' | 'patient';
  contentType: 'post' | 'comment';
  contentId: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
  adminNotes?: string;
  contentPreview?: string;
}

export default function ManagePatients() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [reportSearchQuery, setReportSearchQuery] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showReportDetailModal, setShowReportDetailModal] = useState(false);
  const [showSuspendContentModal, setShowSuspendContentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionType, setActionType] = useState<'suspend' | 'reactivate' | 'reset-password' | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [editNutritionistId, setEditNutritionistId] = useState('');

  // Mock reports data - will be linked to generated patient IDs
  const [reports, setReports] = useState<Report[]>([]);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);

  useEffect(() => {
    // Generate nutritionists first, then patients
    const generatedNutritionists = generateNutritionists(15);
    const generatedPatients = generatePatients(120, generatedNutritionists);
    setNutritionists(generatedNutritionists);
    setPatients(generatedPatients);

    // Create sample reports for some patients
    if (generatedPatients.length > 0) {
      const sampleReports: Report[] = [
        {
          id: '1',
          reportId: 'RPT-2026-0419',
          userId: generatedPatients[5]?.id || 'patient-1',
          userName: generatedPatients[5]?.name || 'Paciente',
          userRole: 'patient',
          contentType: 'comment',
          contentId: 'CMT-2026-3344',
          reason: 'contenido_inapropiado',
          description: 'Comentario ofensivo hacia un nutricionista',
          status: 'pending',
          createdAt: '2026-04-19T16:00:00Z',
          contentPreview: 'Este consejo es terrible y peligroso...',
        },
      ];
      setReports(sampleReports);

      // Update patient reports count
      setPatients(prev => prev.map((p, idx) =>
        idx === 5 ? { ...p, reportsCount: 1 } : p
      ));
    }
  }, []);

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nutritionist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserReports = (userId: string) => {
    return reports.filter(r => r.userId === userId);
  };

  const filteredReports = reportSearchQuery
    ? reports.filter(r => r.reportId.toLowerCase().includes(reportSearchQuery.toLowerCase()))
    : selectedPatient
    ? getUserReports(selectedPatient.id)
    : [];

  const activeCount = patients.filter(p => p.status === 'active').length;
  const suspendedCount = patients.filter(p => p.status === 'suspended').length;

  const handleAction = (patient: Patient, type: 'suspend' | 'reactivate' | 'reset-password') => {
    setSelectedPatient(patient);
    setActionType(type);
    setShowActionModal(true);
  };

  const handleViewReports = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowReportsModal(true);
  };

  const handleViewReportDetail = (report: Report) => {
    setSelectedReport(report);
    setAdminNotes(report.adminNotes || '');
    setShowReportDetailModal(true);
  };

  const handleSuspendForContent = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowSuspendContentModal(true);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditNutritionistId(patient.nutritionistId);
    setShowEditModal(true);
  };

  const confirmEdit = () => {
    if (!selectedPatient) return;

    const selectedNutritionist = nutritionists.find(n => n.id === editNutritionistId);
    if (!selectedNutritionist) {
      toast.error('Debe seleccionar un nutricionista válido');
      return;
    }

    setPatients(patients.map(p =>
      p.id === selectedPatient.id
        ? {
            ...p,
            nutritionistId: editNutritionistId,
            nutritionist: selectedNutritionist.name,
          }
        : p
    ));

    toast.success('Nutricionista asignado actualizado correctamente');
    setShowEditModal(false);
    setSelectedPatient(null);
  };

  const confirmSuspendForContent = () => {
    if (!selectedPatient || !suspendReason.trim()) {
      toast.error('Debes proporcionar un motivo para la suspensión');
      return;
    }

    // Generate admin report for suspension
    const suspensionReport: Report = {
      id: Date.now().toString(),
      reportId: `RPT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      userId: selectedPatient.id,
      userName: selectedPatient.name,
      userRole: 'patient',
      contentType: 'comment',
      contentId: 'ADMIN-SUSPENSION',
      reason: 'suspension_administrativa',
      description: `ADMIN: ${suspendReason}`,
      status: 'resolved',
      createdAt: new Date().toISOString(),
      adminNotes: `Cuenta suspendida por administrador. Motivo: ${suspendReason}`,
    };

    setReports([...reports, suspensionReport]);

    setPatients(patients.map(p =>
      p.id === selectedPatient.id
        ? { ...p, status: 'suspended' as const, reportsCount: (p.reportsCount || 0) + 1 }
        : p
    ));

    toast.success(`Cuenta suspendida. Reporte ${suspensionReport.reportId} creado.`);
    setShowSuspendContentModal(false);
    setShowReportsModal(false);
    setSelectedPatient(null);
    setSuspendReason('');
  };

  const handleSaveReportNotes = () => {
    if (!selectedReport) return;

    setReports(reports.map(r =>
      r.id === selectedReport.id
        ? { ...r, adminNotes: adminNotes, status: 'reviewed' as const }
        : r
    ));

    toast.success('Notas guardadas correctamente');
    setShowReportDetailModal(false);
    setSelectedReport(null);
    setAdminNotes('');
  };

  const confirmAction = () => {
    if (!selectedPatient || !actionType) return;

    if (actionType === 'suspend') {
      setPatients(patients.map(p =>
        p.id === selectedPatient.id ? { ...p, status: 'suspended' as const } : p
      ));
      toast.success('Cuenta suspendida');
    } else if (actionType === 'reactivate') {
      setPatients(patients.map(p =>
        p.id === selectedPatient.id ? { ...p, status: 'active' as const } : p
      ));
      toast.success('Cuenta reactivada');
    } else if (actionType === 'reset-password') {
      toast.success(`Correo de reinicio enviado a ${selectedPatient.email}`);
    }

    setShowActionModal(false);
    setSelectedPatient(null);
    setActionType(null);
  };

  const getActionTitle = () => {
    if (!actionType) return '';
    switch (actionType) {
      case 'suspend':
        return 'Suspender Cuenta';
      case 'reactivate':
        return 'Reactivar Cuenta';
      case 'reset-password':
        return 'Reiniciar Contraseña';
    }
  };

  const getActionMessage = () => {
    if (!selectedPatient || !actionType) return '';
    switch (actionType) {
      case 'suspend':
        return `¿Estás seguro de que deseas suspender la cuenta de ${selectedPatient.name}? Esta acción impedirá que el paciente acceda al sistema hasta que se reactive la cuenta.`;
      case 'reactivate':
        return `¿Estás seguro de que deseas reactivar la cuenta de ${selectedPatient.name}? El paciente podrá acceder al sistema nuevamente.`;
      case 'reset-password':
        return `Se enviará un correo electrónico a ${selectedPatient.email} con instrucciones para restablecer su contraseña.`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header 
        title="Gestionar Pacientes" 
        showBack 
        showMenu 
        role="admin" 
      />

      <div className="p-4 space-y-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <p className="text-2xl text-slate-900 dark:text-white mb-1">{patients.length}</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Total</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
            <p className="text-2xl text-emerald-700 dark:text-emerald-400 mb-1">{activeCount}</p>
            <p className="text-emerald-700 dark:text-emerald-400 text-sm">Activos</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
            <p className="text-2xl text-red-700 dark:text-red-400 mb-1">{suspendedCount}</p>
            <p className="text-red-700 dark:text-red-400 text-sm">Suspendidos</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <p className="text-2xl text-blue-700 dark:text-blue-400 mb-1">
              {patients.reduce((acc, p) => acc + p.appointments, 0)}
            </p>
            <p className="text-blue-700 dark:text-blue-400 text-sm">Citas Total</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o nutricionista..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar reporte por ID (ej: RPT-2026-0419)..."
              value={reportSearchQuery}
              onChange={(e) => setReportSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
          {reportSearchQuery && filteredReports.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Resultados de búsqueda ({filteredReports.length})
              </p>
              <div className="space-y-2">
                {filteredReports.map(report => (
                  <button
                    key={report.id}
                    onClick={() => handleViewReportDetail(report)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-900 dark:text-white font-medium">{report.reportId}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {report.userName} · {report.contentId}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        report.status === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          : report.status === 'reviewed'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      }`}>
                        {report.status === 'pending' ? 'Pendiente' : report.status === 'reviewed' ? 'Revisado' : 'Resuelto'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Patients List */}
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className={`bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm ${
                patient.status === 'suspended' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    patient.status === 'active'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <Users className={`w-6 h-6 ${
                      patient.status === 'active'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-1">
                      {patient.name}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                      <UserCog className="w-4 h-4" />
                      <span>Nutricionista: {patient.nutritionist}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Mail className="w-4 h-4" />
                        {patient.email}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Phone className="w-4 h-4" />
                        {patient.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                  patient.status === 'active'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  {patient.status === 'active' ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Activo
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Suspendido
                    </>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Citas</p>
                  <p className="text-slate-900 dark:text-white font-semibold">{patient.appointments}</p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Fecha de Registro</p>
                  <p className="text-slate-900 dark:text-white font-semibold">
                    {new Date(patient.joinedDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Última Actividad</p>
                  <p className="text-slate-900 dark:text-white font-semibold">{patient.lastActive}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleEdit(patient)}
                  className="flex-1 md:flex-none px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Reasignar Nutricionista
                </button>
                <button
                  onClick={() => handleViewReports(patient)}
                  className="flex-1 md:flex-none px-4 py-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg transition-colors flex items-center justify-center gap-2 relative"
                >
                  <FileText className="w-4 h-4" />
                  Ver Reportes
                  {(patient.reportsCount ?? 0) > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {patient.reportsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleAction(patient, 'reset-password')}
                  className="flex-1 md:flex-none px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Reiniciar Contraseña
                </button>
                {patient.status === 'active' ? (
                  <button
                    onClick={() => handleAction(patient, 'suspend')}
                    className="flex-1 md:flex-none px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Ban className="w-4 h-4" />
                    Suspender
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction(patient, 'reactivate')}
                    className="flex-1 md:flex-none px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reactivar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-12 shadow-sm text-center">
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-900 dark:text-white mb-2">No se encontraron pacientes</p>
            <p className="text-slate-600 dark:text-slate-400">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        )}
      </div>

      {/* Action Confirmation Modal */}
      {showActionModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl text-slate-900 dark:text-white mb-4">{getActionTitle()}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{getActionMessage()}</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedPatient(null);
                  setActionType(null);
                }}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  actionType === 'suspend'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : actionType === 'reactivate'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Only allows changing assigned nutritionist, not personal info */}
      {showEditModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-lg w-full my-8">
            <h3 className="text-xl text-slate-900 dark:text-white mb-2">
              Reasignar Nutricionista
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              La información personal del paciente solo puede ser modificada por el paciente mismo.
            </p>

            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Paciente</p>
              <p className="text-slate-900 dark:text-white font-medium">{selectedPatient.name}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
                Nutricionista Asignado <span className="text-red-500">*</span>
              </label>
              <select
                value={editNutritionistId}
                onChange={(e) => setEditNutritionistId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              >
                <option value="">Seleccionar nutricionista...</option>
                {nutritionists
                  .filter(n => n.status === 'active')
                  .map(n => (
                    <option key={n.id} value={n.id}>
                      {n.name} - {n.specialty}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                Solo se muestran nutricionistas activos
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedPatient(null);
                }}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmEdit}
                className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
