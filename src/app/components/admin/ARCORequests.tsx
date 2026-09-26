import { useState } from 'react';
import Header from '../shared/Header';
import { Shield, Clock, CheckCircle, FileText, BarChart2 } from 'lucide-react';

interface AggregatedStats {
  tipo: string;
  pendientes: number;
  enProceso: number;
  completadas: number;
  proximasVencer: number;
}

export default function ARCORequests() {
  const [stats] = useState<AggregatedStats[]>([
    { tipo: 'Acceso',        pendientes: 4, enProceso: 2, completadas: 18, proximasVencer: 1 },
    { tipo: 'Rectificación', pendientes: 2, enProceso: 1, completadas: 11, proximasVencer: 0 },
    { tipo: 'Cancelación',   pendientes: 1, enProceso: 1, completadas:  7, proximasVencer: 1 },
    { tipo: 'Oposición',     pendientes: 0, enProceso: 0, completadas:  3, proximasVencer: 0 },
  ]);

  const totalPendientes = stats.reduce((a, s) => a + s.pendientes, 0);
  const totalEnProceso  = stats.reduce((a, s) => a + s.enProceso,  0);
  const totalCompletas  = stats.reduce((a, s) => a + s.completadas, 0);
  const totalVencer     = stats.reduce((a, s) => a + s.proximasVencer, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title="Solicitudes ARCO" showBack />

      <div className="p-4 space-y-6 max-w-3xl mx-auto">

        {/* Aviso de acceso */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Vista de métricas agregadas</p>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              El administrador de NutriApp no accede a datos personales de pacientes. Las solicitudes ARCO son resueltas directamente por cada nutriólogo, quien es el responsable del tratamiento conforme al artículo 31 de la LFPDPPP. Esta pantalla muestra únicamente conteos por estado para supervisión operativa.
            </p>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Pendientes', value: totalPendientes, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', icon: Clock },
            { label: 'En proceso', value: totalEnProceso,  color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-900/20',   icon: FileText },
            { label: 'Completadas',value: totalCompletas,  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: CheckCircle },
            { label: 'Próx. a vencer (≤5 días)', value: totalVencer, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', icon: Clock },
          ].map(({ label, value, color, bg, icon: Icon }) => (
            <div key={label} className={`${bg} rounded-xl p-4`}>
              <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
              <div className={`text-xs ${color}`}>{label}</div>
            </div>
          ))}
        </div>

        {/* Breakdown por tipo */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-700">
            <BarChart2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-slate-900 dark:text-white font-semibold">Desglose por tipo de derecho</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
                  <th className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">Derecho</th>
                  <th className="px-4 py-3 text-amber-600 dark:text-amber-400 font-medium">Pendientes</th>
                  <th className="px-4 py-3 text-blue-600 dark:text-blue-400 font-medium">En proceso</th>
                  <th className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-medium">Completadas</th>
                  <th className="px-4 py-3 text-red-600 dark:text-red-400 font-medium">Próx. a vencer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats.map(s => (
                  <tr key={s.tipo} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">{s.tipo}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{s.pendientes}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{s.enProceso}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{s.completadas}</td>
                    <td className="px-4 py-3">
                      {s.proximasVencer > 0
                        ? <span className="text-red-600 dark:text-red-400 font-semibold">{s.proximasVencer}</span>
                        : <span className="text-slate-400">—</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Plazo legal para atender solicitudes: veinte días (art. 31 LFPDPPP). Los nutriólogos gestionan y responden directamente desde su panel.
        </p>
      </div>
    </div>
  );
}
