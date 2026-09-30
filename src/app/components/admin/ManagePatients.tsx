import { useState } from 'react';
import Header from '../shared/Header';
import { Users, Shield, Ban, RefreshCw, Key, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface AnonymizedAccount {
  id: string;
  displayId: string;
  nutritionistCode: string;
  status: 'active' | 'suspended';
  appointments: number;
  lastActive: string;
  joinedDate: string;
}

const MOCK_ACCOUNTS: AnonymizedAccount[] = Array.from({ length: 24 }, (_, i) => ({
  id: `acc-${i}`,
  displayId: `PAC-${String(1001 + i).padStart(4, '0')}`,
  nutritionistCode: `NUT-${String(100 + (i % 8)).padStart(3, '0')}`,
  status: i % 7 === 0 ? 'suspended' : 'active',
  appointments: 2 + (i * 3) % 19,
  lastActive: i < 5 ? 'Hoy' : i < 12 ? 'Esta semana' : 'Este mes',
  joinedDate: `2025-${String(Math.max(1, i % 12 + 1)).padStart(2, '0')}-15`,
}));

type FilterType = 'all' | 'active' | 'suspended';
type ActionType = 'suspend' | 'reactivate' | 'reset-password';

export default function ManagePatients() {
  const [accounts, setAccounts] = useState<AnonymizedAccount[]>(MOCK_ACCOUNTS);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedAccount, setSelectedAccount] = useState<AnonymizedAccount | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = accounts.filter(a =>
    filter === 'all' ? true : filter === 'active' ? a.status === 'active' : a.status === 'suspended'
  );

  const totalActive = accounts.filter(a => a.status === 'active').length;
  const totalSuspended = accounts.filter(a => a.status === 'suspended').length;
  const totalCitas = accounts.reduce((s, a) => s + a.appointments, 0);

  const openAction = (account: AnonymizedAccount, type: ActionType) => {
    setSelectedAccount(account);
    setActionType(type);
    setShowModal(true);
  };

  const confirmAction = () => {
    if (!selectedAccount || !actionType) return;
    if (actionType === 'suspend') {
      setAccounts(prev => prev.map(a => a.id === selectedAccount.id ? { ...a, status: 'suspended' } : a));
      toast.success(`Cuenta ${selectedAccount.displayId} suspendida`);
    } else if (actionType === 'reactivate') {
      setAccounts(prev => prev.map(a => a.id === selectedAccount.id ? { ...a, status: 'active' } : a));
      toast.success(`Cuenta ${selectedAccount.displayId} reactivada`);
    } else {
      toast.success(`Correo de reinicio enviado a la cuenta ${selectedAccount.displayId}`);
    }
    setShowModal(false);
    setSelectedAccount(null);
    setActionType(null);
  };

  const actionLabel = actionType === 'suspend' ? 'Suspender cuenta' : actionType === 'reactivate' ? 'Reactivar cuenta' : 'Reiniciar contraseña';
  const actionDescription = actionType === 'suspend'
    ? `La cuenta ${selectedAccount?.displayId} quedará bloqueada hasta que sea reactivada manualmente.`
    : actionType === 'reactivate'
    ? `La cuenta ${selectedAccount?.displayId} volverá a tener acceso al sistema.`
    : `Se enviará un mensaje de reinicio de contraseña a la dirección verificada de la cuenta ${selectedAccount?.displayId}.`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title="Cuentas de Pacientes" showBack showMenu role="admin" />

      <div className="p-4 space-y-5 max-w-4xl mx-auto">

        {/* Aviso de acceso */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-100 text-sm mb-1">Vista de gestión de cuentas — sin datos personales</p>
            <p className="text-xs text-amber-800 dark:text-amber-200">
              El administrador de NutriApp no accede a nombres, correos ni datos clínicos de pacientes. Esta pantalla muestra únicamente IDs anonimizados (PAC-XXXX) para gestión operativa de cuentas (suspensión, reinicio de credenciales).
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: accounts.length, color: 'text-slate-700 dark:text-slate-300', bg: 'bg-white dark:bg-slate-900' },
            { label: 'Activas', value: totalActive, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            { label: 'Suspendidas', value: totalSuspended, color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
            { label: 'Citas totales', value: totalCitas, color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-4 shadow-sm`}>
              <p className={`text-2xl font-bold ${color} mb-1`}>{value}</p>
              <p className={`text-xs ${color}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(['all', 'active', 'suspended'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'active' ? 'Activas' : 'Suspendidas'}
            </button>
          ))}
        </div>

        {/* Accounts table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
                  <th className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">ID Cuenta</th>
                  <th className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Nutriólogo</th>
                  <th className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Citas</th>
                  <th className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Últ. actividad</th>
                  <th className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Estado</th>
                  <th className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(account => (
                  <tr key={account.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 text-slate-900 dark:text-white font-mono font-medium">
                      {account.displayId}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-mono">
                      {account.nutritionistCode}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {account.appointments}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">
                      {account.lastActive}
                    </td>
                    <td className="px-4 py-3">
                      {account.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs">
                          <CheckCircle className="w-3 h-3" /> Activa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs">
                          <XCircle className="w-3 h-3" /> Suspendida
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openAction(account, 'reset-password')}
                          title="Reiniciar contraseña"
                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        {account.status === 'active' ? (
                          <button
                            onClick={() => openAction(account, 'suspend')}
                            title="Suspender cuenta"
                            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => openAction(account, 'reactivate')}
                            title="Reactivar cuenta"
                            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No hay cuentas en este filtro</p>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          Los datos de salud y la identidad del paciente son accesibles únicamente por el nutriólogo responsable.
        </p>
      </div>

      {/* Action Confirmation Modal */}
      {showModal && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{actionLabel}</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">{actionDescription}</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowModal(false); setSelectedAccount(null); setActionType(null); }}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 rounded-lg text-white text-sm transition-colors ${
                  actionType === 'suspend' ? 'bg-red-500 hover:bg-red-600' :
                  actionType === 'reactivate' ? 'bg-emerald-500 hover:bg-emerald-600' :
                  'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
