import { useNavigate } from 'react-router';
import Header from '../shared/Header';
import { UserCog, Search, Ban, RefreshCw, Key, Mail, Phone, CheckCircle, XCircle, Clock, FileText, AlertTriangle, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { generateNutritionists, type Nutritionist } from '../../utils/mockData';

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

export default function ManageNutritionists() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [reportSearchQuery, setReportSearchQuery] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showReportDetailModal, setShowReportDetailModal] = useState(false);
  const [showSuspendContentModal, setShowSuspendContentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNutritionist, setSelectedNutritionist] = useState<Nutritionist | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionType, setActionType] = useState<'suspend' | 'reactivate' | 'reset-password' | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
  });

  // Mock reports data - will be linked to generated nutritionist IDs
  const [reports, setReports] = useState<Report[]>([]);

  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);

  useEffect(() => {
    // Generate 15 nutritionists on component mount
    const generated = generateNutritionists(15);
    setNutritionists(generated);

    // Create sample reports for some nutritionists
    if (generated.length > 2) {
      const sampleReports: Report[] = [
        {
          id: '1',
          reportId: 'RPT-2026-0423',
          userId: generated[2].id,
          userName: generated[2].name,
          userRole: 'nutritionist',
          contentType: 'post',
          contentId: 'POST-2026-1234',
          reason: 'informacion_incorrecta',
          description: 'Publicación con información nutricional incorrecta sobre dietas cetogénicas',
          status: 'pending',
          createdAt: '2026-04-20T14:30:00Z',
          contentPreview: '🥑 Las dietas cetogénicas son peligrosas y nunca deben recomendarse...',
        },
        {
          id: '2',
          reportId: 'RPT-2026-0418',
          userId: generated[3].id,
          userName: generated[3].name,
          userRole: 'nutritionist',
          contentType: 'comment',
          contentId: 'CMT-2026-5678',
          reason: 'contenido_inapropiado',
          description: 'Comentario ofensivo hacia otro profesional',
          status: 'reviewed',
          createdAt: '2026-04-18T09:15:00Z',
          adminNotes: 'Se contactó al nutricionista. Advierte sobre conducta profesional.',
          contentPreview: 'Ese consejo es completamente ridículo...',
        },
      ];
      setReports(sampleReports);

      // Update nutritionist reports count
      setNutritionists(prev => prev.map((n, idx) =>
        idx === 2 ? { ...n, reportsCount: 1 } : idx === 3 ? { ...n, reportsCount: 1 } : n
      ));
    }
  }, []);

  const filteredNutritionists = nutritionists.filter(n =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserReports = (userId: string) => {
    return reports.filter(r => r.userId === userId);
  };

  const filteredReports = reportSearchQuery
    ? reports.filter(r => r.reportId.toLowerCase().includes(reportSearchQuery.toLowerCase()))
    : selectedNutritionist
    ? getUserReports(selectedNutritionist.id)
    : [];

  const activeCount = nutritionists.filter(n => n.status === 'active').length;
  const suspendedCount = nutritionists.filter(n => n.status === 'suspended').length;

  const handleAction = (nutritionist: Nutritionist, type: 'suspend' | 'reactivate' | 'reset-password') => {
    setSelectedNutritionist(nutritionist);
    setActionType(type);
    setShowActionModal(true);
  };

  const handleViewReports = (nutritionist: Nutritionist) => {
    setSelectedNutritionist(nutritionist);
    setShowReportsModal(true);
  };

  const handleViewReportDetail = (report: Report) => {
    setSelectedReport(report);
    setAdminNotes(report.adminNotes || '');
    setShowReportDetailModal(true);
  };

  const handleSuspendForContent = (nutritionist: Nutritionist) => {
    setSelectedNutritionist(nutritionist);
    setShowSuspendContentModal(true);
  };

  const handleEdit = (nutritionist: Nutritionist) => {
    setSelectedNutritionist(nutritionist);
    setEditForm({
      name: nutritionist.name,
      email: nutritionist.email,
      phone: nutritionist.phone,
      specialty: nutritionist.specialty,
    });
    setShowEditModal(true);
  };

  const confirmEdit = () => {
    if (!selectedNutritionist) return;

    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.phone.trim() || !editForm.specialty.trim()) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    setNutritionists(nutritionists.map(n =>
      n.id === selectedNutritionist.id
        ? { ...n, ...editForm }
        : n
    ));

    toast.success('Información actualizada correctamente');
    setShowEditModal(false);
    setSelectedNutritionist(null);
  };

  const confirmSuspendForContent = () => {
    if (!selectedNutritionist || !suspendReason.trim()) {
      toast.error('Debes proporcionar un motivo para la suspensión');
      return;
    }

    // Generate admin report for suspension
    const suspensionReport: Report = {
      id: Date.now().toString(),
      reportId: `RPT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      userId: selectedNutritionist.id,
      userName: selectedNutritionist.name,
      userRole: 'nutritionist',
      contentType: 'post',
      contentId: 'ADMIN-SUSPENSION',
      reason: 'suspension_administrativa',
      description: `ADMIN: ${suspendReason}`,
      status: 'resolved',
      createdAt: new Date().toISOString(),
      adminNotes: `Cuenta suspendida por administrador. Motivo: ${suspendReason}`,
    };

    setReports([...reports, suspensionReport]);

    setNutritionists(nutritionists.map(n =>
      n.id === selectedNutritionist.id
        ? { ...n, status: 'suspended' as const, reportsCount: (n.reportsCount || 0) + 1 }
        : n
    ));

    toast.success(`Cuenta suspendida. Reporte ${suspensionReport.reportId} creado.`);
    setShowSuspendContentModal(false);
    setShowReportsModal(false);
    setSelectedNutritionist(null);
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
    if (!selectedNutritionist || !actionType) return;

    if (actionType === 'suspend') {
      setNutritionists(nutritionists.map(n =>
        n.id === selectedNutritionist.id ? { ...n, status: 'suspended' as const } : n
      ));
      toast.success('Cuenta suspendida');
    } else if (actionType === 'reactivate') {
      setNutritionists(nutritionists.map(n =>
        n.id === selectedNutritionist.id ? { ...n, status: 'active' as const } : n
      ));
      toast.success('Cuenta reactivada');
    } else if (actionType === 'reset-password') {
      toast.success(`Correo de reinicio enviado a ${selectedNutritionist.email}`);
    }

    setShowActionModal(false);
    setSelectedNutritionist(null);
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
    if (!selectedNutritionist || !actionType) return '';
    switch (actionType) {
      case 'suspend':
        return `¿Estás seguro de que deseas suspender la cuenta de ${selectedNutritionist.name}? Esta acción impedirá que el nutricionista acceda al sistema hasta que se reactive la cuenta.`;
      case 'reactivate':
        return `¿Estás seguro de que deseas reactivar la cuenta de ${selectedNutritionist.name}? El nutricionista podrá acceder al sistema nuevamente.`;
      case 'reset-password':
        return `Se enviará un correo electrónico a ${selectedNutritionist.email} con instrucciones para restablecer su contraseña.`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header 
        title="Gestionar Nutricionistas" 
        showBack 
        showMenu 
        role="admin" 
      />

      <div className="p-4 space-y-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <p className="text-2xl text-slate-900 dark:text-white mb-1">{nutritionists.length}</p>
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
              {nutritionists.reduce((acc, n) => acc + n.patients, 0)}
            </p>
            <p className="text-blue-700 dark:text-blue-400 text-sm">Pacientes Total</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o especialidad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar reporte por ID (ej: RPT-2026-0423)..."
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

        {/* Nutritionists List */}
        <div className="space-y-4">
          {filteredNutritionists.map((nutritionist) => (
            <div
              key={nutritionist.id}
              className={`bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm ${
                nutritionist.status === 'suspended' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    nutritionist.status === 'active'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    <UserCog className={`w-6 h-6 ${
                      nutritionist.status === 'active'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-1">
                      {nutritionist.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-2">{nutritionist.specialty}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Mail className="w-4 h-4" />
                        {nutritionist.email}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Phone className="w-4 h-4" />
                        {nutritionist.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                  nutritionist.status === 'active'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  {nutritionist.status === 'active' ? (
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
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Pacientes</p>
                  <p className="text-slate-900 dark:text-white font-semibold">{nutritionist.patients}</p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Fecha de Registro</p>
                  <p className="text-slate-900 dark:text-white font-semibold">
                    {new Date(nutritionist.joinedDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">Última Actividad</p>
                  <p className="text-slate-900 dark:text-white font-semibold">{nutritionist.lastActive}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleEdit(nutritionist)}
                  className="flex-1 md:flex-none px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleViewReports(nutritionist)}
                  className="flex-1 md:flex-none px-4 py-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg transition-colors flex items-center justify-center gap-2 relative"
                >
                  <FileText className="w-4 h-4" />
                  Ver Reportes
                  {(nutritionist.reportsCount ?? 0) > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {nutritionist.reportsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleAction(nutritionist, 'reset-password')}
                  className="flex-1 md:flex-none px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Reiniciar Contraseña
                </button>
                {nutritionist.status === 'active' ? (
                  <button
                    onClick={() => handleAction(nutritionist, 'suspend')}
                    className="flex-1 md:flex-none px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Ban className="w-4 h-4" />
                    Suspender
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction(nutritionist, 'reactivate')}
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

        {filteredNutritionists.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-12 shadow-sm text-center">
            <UserCog className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-900 dark:text-white mb-2">No se encontraron nutricionistas</p>
            <p className="text-slate-600 dark:text-slate-400">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        )}
      </div>

      {/* Action Confirmation Modal */}
      {showActionModal && selectedNutritionist && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl text-slate-900 dark:text-white mb-4">{getActionTitle()}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{getActionMessage()}</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedNutritionist(null);
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

      {/* Reports Modal */}
      {showReportsModal && selectedNutritionist && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-3xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl text-slate-900 dark:text-white mb-1">
                  Reportes de {selectedNutritionist.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {getUserReports(selectedNutritionist.id).length} reporte(s) total
                </p>
              </div>
              <button
                onClick={() => {
                  setShowReportsModal(false);
                  setSelectedNutritionist(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {getUserReports(selectedNutritionist.id).length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400">
                    No hay reportes para este nutricionista
                  </p>
                </div>
              ) : (
                getUserReports(selectedNutritionist.id).map(report => (
                  <div
                    key={report.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    onClick={() => handleViewReportDetail(report)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-slate-900 dark:text-white font-medium">
                          {report.reportId}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {report.contentType === 'post' ? 'Publicación' : 'Comentario'}: {report.contentId}
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
                    {report.contentPreview && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 truncate">
                        "{report.contentPreview}"
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {new Date(report.createdAt).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => handleSuspendForContent(selectedNutritionist)}
                className="flex-1 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Suspender por Contenido
              </button>
              <button
                onClick={() => {
                  setShowReportsModal(false);
                  setSelectedNutritionist(null);
                }}
                className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {showReportDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-2xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-slate-900 dark:text-white">
                Detalle del Reporte
              </h3>
              <button
                onClick={() => {
                  setShowReportDetailModal(false);
                  setSelectedReport(null);
                  setAdminNotes('');
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">ID del Reporte</p>
                  <p className="text-slate-900 dark:text-white font-medium">{selectedReport.reportId}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Estado</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    selectedReport.status === 'pending'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      : selectedReport.status === 'reviewed'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  }`}>
                    {selectedReport.status === 'pending' ? 'Pendiente' : selectedReport.status === 'reviewed' ? 'Revisado' : 'Resuelto'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Usuario Reportado</p>
                <p className="text-slate-900 dark:text-white">{selectedReport.userName}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">ID del Contenido</p>
                <p className="text-slate-900 dark:text-white font-mono text-sm">{selectedReport.contentId}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Tipo</p>
                <p className="text-slate-900 dark:text-white">
                  {selectedReport.contentType === 'post' ? 'Publicación' : 'Comentario'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Motivo del Reporte</p>
                <p className="text-slate-900 dark:text-white">{selectedReport.description}</p>
              </div>

              {selectedReport.contentPreview && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Vista Previa del Contenido</p>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{selectedReport.contentPreview}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Notas del Administrador
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  placeholder="Agrega notas sobre las acciones tomadas..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    setShowReportDetailModal(false);
                    setSelectedReport(null);
                    setAdminNotes('');
                  }}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveReportNotes}
                  className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  Guardar Notas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suspend for Content Modal */}
      {showSuspendContentModal && selectedNutritionist && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl text-slate-900 dark:text-white">
                  Suspender por Contenido Inapropiado
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedNutritionist.name}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
                Motivo de la suspensión <span className="text-red-500">*</span>
              </label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                rows={4}
                placeholder="Describe el motivo de la suspensión (ej: publicación de contenido médico peligroso, múltiples reportes por información incorrecta, etc.)"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSuspendContentModal(false);
                  setSelectedNutritionist(null);
                  setSuspendReason('');
                }}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSuspendForContent}
                disabled={!suspendReason.trim()}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Suspender Cuenta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedNutritionist && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-lg w-full my-8">
            <h3 className="text-xl text-slate-900 dark:text-white mb-6">Editar Nutricionista</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
                  Especialidad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.specialty}
                  onChange={(e) => setEditForm({ ...editForm, specialty: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedNutritionist(null);
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
