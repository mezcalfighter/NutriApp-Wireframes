import { useState } from 'react';
import { FileText, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../shared/Header';

interface DeclarationRecord {
  id: string;
  name: string;
  cedula: string;
  institution: string;
  declarationDate: string;
}

const initialRecords: DeclarationRecord[] = [
  {
    id: '1',
    name: 'Lic. Andrea Martínez',
    cedula: '12345678',
    institution: 'UNAM',
    declarationDate: '2026-09-20',
  },
  {
    id: '2',
    name: 'Dra. Carmen Ruiz',
    cedula: '87654321',
    institution: 'ITESO',
    declarationDate: '2026-09-10',
  },
  {
    id: '3',
    name: 'Lic. Marco Pérez',
    cedula: '11223344',
    institution: 'UdeG',
    declarationDate: '2026-09-22',
  },
  {
    id: '4',
    name: 'Lic. Sofía Torres',
    cedula: '99887766',
    institution: 'IBERO',
    declarationDate: '2026-09-15',
  },
];

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export default function AdminVerification() {
  const [records] = useState<DeclarationRecord[]>(initialRecords);
  const [currentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(records.length / itemsPerPage));
  const paginated = records.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title="Información declarada" showMenu />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Prominent notice */}
        <section className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
            <span className="font-semibold">NutriApp no verifica cédulas profesionales.</span> El
            nutriólogo declara estos datos bajo protesta. Consulta pública disponible en el portal SEP
            (cédulas.sep.gob.mx).
          </p>
        </section>

        {/* Table */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  {[
                    'Nutriólogo',
                    'Cédula declarada',
                    'Institución del título',
                    'Documento',
                    'Fecha declaración',
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
                    <td colSpan={5} className="px-4 py-16 text-center text-slate-400 dark:text-slate-500">
                      No hay registros.
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

                      {/* Fecha declaración */}
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(record.declarationDate)}
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
              Mostrando {paginated.length} de {records.length} nutriólogos
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
