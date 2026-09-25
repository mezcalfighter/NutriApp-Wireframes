import { useState } from 'react';
import { Search, ToggleLeft, ToggleRight, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../shared/Header';

type Estado = 'Activo' | 'Vencido' | 'Suspendido';

interface FeaturedNutritionist {
  id: string;
  name: string;
  city: string;
  specialty: string;
  since: string;
  expires: string;
  impressions: number;
  clicks: number;
  estado: Estado;
}

const initialNutritionists: FeaturedNutritionist[] = [
  {
    id: '1',
    name: 'Dra. Carmen Ruiz',
    city: 'Guadalajara',
    specialty: 'Nutrición clínica',
    since: '2026-07-01',
    expires: '2026-09-30',
    impressions: 1240,
    clicks: 89,
    estado: 'Activo',
  },
  {
    id: '2',
    name: 'Lic. Roberto Soto',
    city: 'CDMX',
    specialty: 'Nutrición deportiva',
    since: '2026-08-01',
    expires: '2026-10-31',
    impressions: 980,
    clicks: 67,
    estado: 'Activo',
  },
  {
    id: '3',
    name: 'Lic. Fernanda López',
    city: 'Monterrey',
    specialty: 'Nutriología general',
    since: '2026-05-01',
    expires: '2026-07-31',
    impressions: 450,
    clicks: 31,
    estado: 'Vencido',
  },
];

type FilterEstado = 'Todos' | Estado;
const filterOptions: FilterEstado[] = ['Todos', 'Activo', 'Vencido', 'Suspendido'];

function estadoChip(estado: Estado) {
  const map: Record<Estado, string> = {
    Activo: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    Vencido: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    Suspendido: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
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

export default function AdminFeatured() {
  const [nutritionists, setNutritionists] = useState<FeaturedNutritionist[]>(initialNutritionists);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState<FilterEstado>('Todos');
  const [equitativeRotation, setEquitativeRotation] = useState(true);
  const [currentPage] = useState(1);
  const itemsPerPage = 10;

  function handleToggleEstado(id: string) {
    setNutritionists(prev =>
      prev.map(n => {
        if (n.id !== id) return n;
        if (n.estado === 'Activo') {
          toast.success(`${n.name} ha sido suspendido.`);
          return { ...n, estado: 'Suspendido' };
        } else {
          toast.success(`${n.name} ha sido reactivado.`);
          return { ...n, estado: 'Activo' };
        }
      }),
    );
  }

  const filtered = nutritionists.filter(n => {
    const matchesSearch =
      n.name.toLowerCase().includes(search.toLowerCase()) ||
      n.city.toLowerCase().includes(search.toLowerCase()) ||
      n.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesEstado = filterEstado === 'Todos' || n.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title="Nutriólogos Destacados" showMenu />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Info notice */}
        <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            El orden orgánico usa disponibilidad, cercanía declarada y especialidad. No se usan datos de pacientes.
          </p>
        </div>

        {/* Parameters section */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Parámetros del servicio</h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Máximo de resultados patrocinados entre los primeros cinco
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                  (no editable por encima de 2)
                </p>
              </div>
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-right">2</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Rotación equitativa entre destacados
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                  Distribuye las impresiones de forma equilibrada entre nutriólogos activos
                </p>
              </div>
              <button
                onClick={() => setEquitativeRotation(prev => !prev)}
                className="flex items-center gap-2 self-start sm:self-auto"
                aria-pressed={equitativeRotation}
              >
                {equitativeRotation ? (
                  <ToggleRight className="w-8 h-8 text-emerald-500" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                )}
                <span className={`text-sm font-medium ${equitativeRotation ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {equitativeRotation ? 'Activado' : 'Desactivado'}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Search and filter */}
        <section className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, ciudad o especialidad..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filterOptions.map(opt => (
              <button
                key={opt}
                onClick={() => setFilterEstado(opt)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${
                  filterEstado === opt
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-emerald-400'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* Table */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
              <p className="text-base">No hay nutriólogos con Destacado activo</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    {[
                      'Nutriólogo',
                      'Ciudad',
                      'Especialidad',
                      'Desde',
                      'Vence',
                      'Impresiones (mes)',
                      'Clics (mes)',
                      'Estado',
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
                  {paginated.map((n, idx) => (
                    <tr
                      key={n.id}
                      className={`border-b border-slate-100 dark:border-slate-800 ${
                        idx % 2 === 0 ? '' : 'bg-slate-50/50 dark:bg-slate-950/30'
                      } hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100 whitespace-nowrap">
                        {n.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{n.city}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{n.specialty}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(n.since)}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(n.expires)}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-right whitespace-nowrap">
                        {n.impressions.toLocaleString('es-MX')}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-right whitespace-nowrap">
                        {n.clicks.toLocaleString('es-MX')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{estadoChip(n.estado)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {n.estado === 'Activo' && (
                          <button
                            onClick={() => handleToggleEstado(n.id)}
                            className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors px-2 py-1 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            Suspender
                          </button>
                        )}
                        {(n.estado === 'Suspendido' || n.estado === 'Vencido') && (
                          <button
                            onClick={() => handleToggleEstado(n.id)}
                            className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          >
                            Reactivar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Mostrando {paginated.length} de {filtered.length} nutriólogos
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
      </main>
    </div>
  );
}
