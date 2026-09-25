import { useState } from 'react';
import { FileText, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../shared/Header';

type Estado = 'Pendiente' | 'Verificado' | 'Rechazado';

interface VerificationRecord {
  id: string;
  name: string;
  cedula: string;
  institution: string;
  estado: Estado;
  requestDate: string;
  verificationDate?: string;
  rejectionReason?: string;
}

const initialRecords: VerificationRecord[] = [
  {
    id: '1',
    name: 'Lic. Andrea Martínez',
    cedula: '12345678',
    institution: 'UNAM',
    estado: 'Pendiente',
    requestDate: '2026-09-20',
  },
  {
    id: '2',
    name: 'Dra. Carmen Ruiz',
    cedula: '87654321',
    institution: 'ITESO',
    estado: 'Verificado',
    requestDate: '2026-09-10',
    verificationDate: '2026-09-12',
  },
  {
    id: '3',
    name: 'Lic. Marco Pérez',
    cedula: '11223344',
    institution: 'UdeG',
    estado: 'Pendiente',
    requestDate: '2026-09-22',
  },
  {
    id: '4',
    name: 'Lic. Sofía Torres',
    cedula: '99887766',
    institution: 'IBERO',
    estado: 'Rechazado',
    requestDate: '2026-09-15',
    rejectionReason: 'Documento ilegible, favor de subir una imagen clara',
  },
];

type FilterTab = 'Todos' | Estado;
const filterTabs: FilterTab[] = ['Todos', 'Pendiente', 'Verificado', 'Rechazado'];

function estadoChip(estado: Estado) {
  const map: Record<Estado, string> = {
    Pendiente: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    Verificado: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    Rechazado: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[estado]}`}>
      {estado}
    </span>
  );
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export default function AdminVerification() {
  const [records, setRecords] = useState<VerificationRecord[]>(initialRecords);
  const [activeTab, setActiveTab] = useState<FilterTab>('Todos');
  const [currentPage] = useState(1);
  const itemsPerPage = 10;

  // Confirm verify modal
  const [confirmVerifyId, setConfirmVerifyId] = useState<string | null>(null);

  // Reject modal
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const stats = [
    {
      label: 'Pendientes',
      value: records.filter(r => r.estado === 'Pendiente').length,
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Verificados',
      value: records.filter(r => r.estado === 'Verificado').length,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Rechazados',
      value: records.filter(r => r.estado === 'Rechazado').length,
      color: 'text-red-600 dark:text-red-400',
    },
  ];

  const filtered = records.filter(r => activeTab === 'Todos' || r.estado === activeTab);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  function handleVerify(id: string) {
    const today = new Date().toISOString().split('T')[0];
    setRecords(prev =>
      prev.map(r =>
        r.id === id ? { ...r, estado: 'Verificado', verificationDate: today } : r,
      ),
    );
    setConfirmVerifyId(null);
    toast.success('Cédula verificada. Se ha activado la insignia Perfil verificado.');
  }

  function handleReject(id: string) {
    if (!rejectReason.trim()) {
      toast.error('Por favor ingrese el motivo del rechazo.');
      return;
    }
    setRecords(prev =>
      prev.map(r =>
        r.id === id ? { ...r, estado: 'Rechazado', rejectionReason: rejectReason.trim() } : r,
      ),
    );
    setRejectModalId(null);
    setRejectReason('');
    toast.success('La solicitud ha sido rechazada y se notificó al nutriólogo.');
  }

  const confirmRecord = records.find(r => r.id === confirmVerifyId);
  const rejectRecord = records.find(r => r.id === rejectModalId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title="Verificación de Cédulas" showMenu />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats row */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map(stat => (
              <div
                key={stat.label}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-1"
              >
                <span className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</span>
                <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Filter tabs */}
        <section className="flex gap-2 flex-wrap">
          {filterTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                activeTab === tab
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-emerald-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </section>

        {/* Table */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  {[
                    'Nutriólogo',
                    'Cédula',
                    'Institución que expidió el título',
                    'Documento',
                    'Estado',
                    'Fecha solicitud',
                    'Acciones',
                  ].map(col => (
                    <th
                      key={col}
                      className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-slate-400 dark:text-slate-500">
                      No hay registros para este filtro.
                    </td>
                  </tr>
                ) : (
                  paginated.map((record, idx) => (
                    <tr
                      key={record.id}
                      className={`border-b border-slate-100 dark:border-slate-800 ${
                        idx % 2 === 0 ? '' : 'bg-slate-50/50 dark:bg-slate-950/30'
                      } hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors align-top`}
                    >
                      {/* Nutriólogo */}
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100 whitespace-nowrap">
                        {record.name}
                      </td>

                      {/* Cédula */}
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono whitespace-nowrap">
                        {record.cedula}
                      </td>

                      {/* Institución */}
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {record.institution}
                      </td>

                      {/* Documento */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => toast.info('Abriendo documento...')}
                          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Ver PDF
                        </button>
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3 whitespace-nowrap">{estadoChip(record.estado)}</td>

                      {/* Fecha solicitud */}
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(record.requestDate)}
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {record.estado === 'Pendiente' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setConfirmVerifyId(record.id)}
                              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              Verificar
                            </button>
                            <button
                              onClick={() => {
                                setRejectModalId(record.id);
                                setRejectReason('');
                              }}
                              className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30 px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              Rechazar
                            </button>
                          </div>
                        )}
                        {record.estado === 'Verificado' && record.verificationDate && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Verificado el {formatDate(record.verificationDate)}
                          </span>
                        )}
                        {record.estado === 'Rechazado' && record.rejectionReason && (
                          <span
                            className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] block truncate"
                            title={record.rejectionReason}
                          >
                            Motivo: {record.rejectionReason}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Mostrando {paginated.length} de {filtered.length} solicitudes
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Página {currentPage} de {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <p className="text-xs text-slate-500 dark:text-slate-500 text-center pb-4">
          El servicio Destacado en el catálogo solo puede activarse con cédula verificada.
        </p>
      </main>

      {/* Confirm verify modal */}
      {confirmVerifyId && confirmRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setConfirmVerifyId(null)}
          />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Confirmar verificación</h2>
              <button
                onClick={() => setConfirmVerifyId(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              ¿Desea verificar la cédula <span className="font-semibold text-slate-800 dark:text-slate-100">{confirmRecord.cedula}</span> de{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-100">{confirmRecord.name}</span>? Se activará
              la insignia <span className="text-emerald-600 dark:text-emerald-400 font-medium">Perfil verificado</span>.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmVerifyId(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleVerify(confirmVerifyId)}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
              >
                Verificar cédula
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectModalId && rejectRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setRejectModalId(null)}
          />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Rechazar solicitud</h2>
              <button
                onClick={() => setRejectModalId(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ingrese el motivo del rechazo para{' '}
              <span className="font-semibold text-slate-800 dark:text-slate-100">{rejectRecord.name}</span>. Este mensaje
              será enviado al nutriólogo.
            </p>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Motivo del rechazo
              </label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={4}
                placeholder="Describa el motivo por el cual se rechaza la cédula..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setRejectModalId(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleReject(rejectModalId)}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
