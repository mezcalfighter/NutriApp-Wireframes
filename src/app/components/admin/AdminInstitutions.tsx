import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Eye, Pencil, Building2 } from 'lucide-react';
import Header from '../shared/Header';

type EstadoInstitucion = 'Activa' | 'Vencida' | 'Suspendida';

interface Institucion {
  id: string;
  nombre: string;
  programa: string;
  paquete: string;
  vigenciaInicio: string;
  vigenciaFin: string;
  cupo: number;
  estudiantesActivos: number;
  estado: EstadoInstitucion;
}

const instituciones: Institucion[] = [
  {
    id: '1',
    nombre: 'UNAM',
    programa: 'Nutrición Clínica',
    paquete: 'Integral',
    vigenciaInicio: '2026-01-20',
    vigenciaFin: '2026-06-30',
    cupo: 40,
    estudiantesActivos: 28,
    estado: 'Activa',
  },
  {
    id: '2',
    nombre: 'ITESO',
    programa: 'Ingeniería en Alimentos',
    paquete: 'Formación',
    vigenciaInicio: '2026-01-15',
    vigenciaFin: '2026-06-20',
    cupo: 25,
    estudiantesActivos: 22,
    estado: 'Activa',
  },
  {
    id: '3',
    nombre: 'Universidad del Valle',
    programa: 'Nutriología',
    paquete: 'Aula',
    vigenciaInicio: '2025-08-01',
    vigenciaFin: '2025-12-15',
    cupo: 20,
    estudiantesActivos: 18,
    estado: 'Vencida',
  },
  {
    id: '4',
    nombre: 'ITESM Campus GDL',
    programa: 'Ciencias de la Salud',
    paquete: 'Integral',
    vigenciaInicio: '',
    vigenciaFin: '',
    cupo: 35,
    estudiantesActivos: 0,
    estado: 'Suspendida',
  },
];

const estadoChipClass: Record<EstadoInstitucion, string> = {
  Activa: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  Vencida: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  Suspendida: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

function formatFecha(fecha: string) {
  if (!fecha) return '—';
  const [y, m, d] = fecha.split('-');
  return `${d}/${m}/${y}`;
}

export default function AdminInstitutions() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todas' | EstadoInstitucion>('Todas');
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  const filtradas = instituciones.filter((inst) => {
    const coincideBusqueda =
      inst.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      inst.programa.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === 'Todas' || inst.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / porPagina));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * porPagina;
  const fin = Math.min(inicio + porPagina, filtradas.length);
  const paginadas = filtradas.slice(inicio, fin);

  const totalActivas = instituciones.filter((i) => i.estado === 'Activa').length;
  const totalVencidas = instituciones.filter((i) => i.estado === 'Vencida').length;
  const totalSuspendidas = instituciones.filter((i) => i.estado === 'Suspendida').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title="Instituciones" showMenu />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total instituciones', valor: instituciones.length, color: 'text-slate-700 dark:text-slate-200' },
            { label: 'Activas', valor: totalActivas, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Vencidas', valor: totalVencidas, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Suspendidas', valor: totalSuspendidas, color: 'text-red-600 dark:text-red-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm flex flex-col gap-1"
            >
              <span className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</span>
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.valor}</span>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o programa..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => { setFiltroEstado(e.target.value as typeof filtroEstado); setPagina(1); }}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Todas">Todas</option>
            <option value="Activa">Activa</option>
            <option value="Vencida">Vencida</option>
            <option value="Suspendida">Suspendida</option>
          </select>
          <button
            onClick={() => navigate('/admin/institutions/new')}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Nueva institución
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
          {paginadas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500 dark:text-slate-400">
              <Building2 className="w-10 h-10 opacity-40" />
              <p className="text-sm">No se encontraron instituciones con los filtros seleccionados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    {['Institución', 'Programa', 'Paquete', 'Vigencia', 'Cupo', 'Est. activos', 'Estado', 'Acciones'].map((col) => (
                      <th
                        key={col}
                        className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginadas.map((inst) => (
                    <tr key={inst.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">{inst.nombre}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{inst.programa}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{inst.paquete}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {inst.vigenciaInicio && inst.vigenciaFin
                          ? `${formatFecha(inst.vigenciaInicio)} – ${formatFecha(inst.vigenciaFin)}`
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-center">{inst.cupo}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-center">{inst.estudiantesActivos}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoChipClass[inst.estado]}`}>
                          {inst.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/institutions/${inst.id}/codes`)}
                            className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Ver códigos
                          </button>
                          <span className="text-slate-300 dark:text-slate-700">|</span>
                          <button
                            onClick={() => navigate(`/admin/institutions/${inst.id}/edit`)}
                            className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:underline font-medium"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filtradas.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mostrando {inicio + 1}–{fin} de {filtradas.length} instituciones
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                  disabled={paginaActual === 1}
                  className="px-3 py-1 rounded-lg text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Anterior
                </button>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {paginaActual} / {totalPaginas}
                </span>
                <button
                  onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                  disabled={paginaActual === totalPaginas}
                  className="px-3 py-1 rounded-lg text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
