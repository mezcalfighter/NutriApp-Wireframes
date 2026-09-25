import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, Copy, Mail, Ban, GraduationCap, X } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../shared/Header';

type EstadoCodigo = 'Vigente' | 'Agotado' | 'Vencido' | 'Revocado';

interface Codigo {
  id: string;
  codigo: string;
  cohorte: string;
  usosMax: number;
  usos: number;
  vigencia: string;
  estado: EstadoCodigo;
}

const estadoChipClass: Record<EstadoCodigo, string> = {
  Vigente: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  Agotado: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  Vencido: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  Revocado: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

const codigosMock: Codigo[] = [
  { id: '1', codigo: 'NUTRI-UNAM-2026', cohorte: 'Grupo A', usosMax: 30, usos: 28, vigencia: '2026-06-30', estado: 'Vigente' },
  { id: '2', codigo: 'NUTRI-UA02-2026', cohorte: 'Grupo B', usosMax: 10, usos: 10, vigencia: '2026-06-30', estado: 'Agotado' },
  { id: '3', codigo: 'NUTRI-UA03-2025', cohorte: 'Grupo C', usosMax: 15, usos: 12, vigencia: '2025-12-15', estado: 'Vencido' },
  { id: '4', codigo: 'NUTRI-UA04-2026', cohorte: 'Grupo D', usosMax: 20, usos: 5,  vigencia: '2026-06-30', estado: 'Revocado' },
  { id: '5', codigo: 'NUTRI-UA05-2026', cohorte: 'Grupo E', usosMax: 25, usos: 3,  vigencia: '2026-06-30', estado: 'Vigente' },
];

function formatFecha(fecha: string) {
  const [y, m, d] = fecha.split('-');
  return `${d}/${m}/${y}`;
}

interface ConfirmModalProps {
  codigoCodigo: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ codigoCodigo, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 max-w-sm w-full space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex-shrink-0">
            <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Revocar código</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            ¿Confirmas que deseas revocar este código?
          </p>
          <p className="text-sm font-mono font-medium text-slate-700 dark:text-slate-300 mt-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 inline-block">
            {codigoCodigo}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Esta acción es irreversible. Los estudiantes que aún no hayan usado el código no podrán activar su cuenta con él.
          </p>
        </div>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ActivationCodes() {
  const navigate = useNavigate();
  const [codigos, setCodigos] = useState<Codigo[]>(codigosMock);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarGenerar, setMostrarGenerar] = useState(false);
  const [confirmRevocar, setConfirmRevocar] = useState<Codigo | null>(null);

  // Generate form state
  const [genCantidad, setGenCantidad] = useState('1');
  const [genUsos, setGenUsos] = useState('1');
  const [genVigencia, setGenVigencia] = useState('');

  const filtrados = codigos.filter((c) =>
    c.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.cohorte.toLowerCase().includes(busqueda.toLowerCase())
  );

  function copiarCodigo(codigo: string) {
    navigator.clipboard.writeText(codigo).then(() => {
      toast.success('Código copiado');
    }).catch(() => {
      toast.error('No se pudo copiar el código');
    });
  }

  function enviarAlDocente() {
    toast.success('Código enviado por correo a contacto@unam.mx');
  }

  function solicitarRevocar(codigo: Codigo) {
    setConfirmRevocar(codigo);
  }

  function confirmarRevocar() {
    if (!confirmRevocar) return;
    setCodigos((prev) =>
      prev.map((c) => c.id === confirmRevocar.id ? { ...c, estado: 'Revocado' as EstadoCodigo } : c)
    );
    toast.success(`Código ${confirmRevocar.codigo} revocado correctamente`);
    setConfirmRevocar(null);
  }

  function handleGenerar(e: React.FormEvent) {
    e.preventDefault();
    const cantidad = Math.max(1, parseInt(genCantidad) || 1);
    const nuevos: Codigo[] = Array.from({ length: cantidad }, (_, i) => ({
      id: `gen-${Date.now()}-${i}`,
      codigo: `NUTRI-GEN-${Date.now().toString().slice(-6)}-${i + 1}`,
      cohorte: 'Nuevo grupo',
      usosMax: Math.max(1, parseInt(genUsos) || 1),
      usos: 0,
      vigencia: genVigencia || '2026-12-31',
      estado: 'Vigente',
    }));
    setCodigos((prev) => [...nuevos, ...prev]);
    toast.success(`${cantidad} código${cantidad > 1 ? 's' : ''} generado${cantidad > 1 ? 's' : ''} correctamente`);
    setMostrarGenerar(false);
    setGenCantidad('1');
    setGenUsos('1');
    setGenVigencia('');
  }

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title="Códigos de Activación" showBack />

      {confirmRevocar && (
        <ConfirmModal
          codigoCodigo={confirmRevocar.codigo}
          onConfirm={confirmarRevocar}
          onCancel={() => setConfirmRevocar(null)}
        />
      )}

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* Institution banner */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">UNAM — Nutrición Clínica</p>
            <p className="text-xs text-amber-700 dark:text-amber-400">Gestión de códigos de activación para esta institución</p>
          </div>
        </div>

        {/* Actions row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por código o cohorte..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={() => setMostrarGenerar((v) => !v)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Generar códigos
          </button>
        </div>

        {/* Generate codes panel */}
        {mostrarGenerar && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Generar nuevos códigos</h2>
              <button
                onClick={() => setMostrarGenerar(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleGenerar} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  min={1}
                  value={genCantidad}
                  onChange={(e) => setGenCantidad(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Usos por código
                </label>
                <input
                  type="number"
                  min={1}
                  value={genUsos}
                  onChange={(e) => setGenUsos(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Vigencia
                </label>
                <input
                  type="date"
                  value={genVigencia}
                  onChange={(e) => setGenVigencia(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="sm:col-span-3 flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setMostrarGenerar(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
                >
                  Generar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
          {filtrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500 dark:text-slate-400">
              <Plus className="w-10 h-10 opacity-30" />
              <p className="text-sm text-center px-4">
                {codigos.length === 0
                  ? 'Aún no tienes códigos generados. Usa el botón «Generar códigos» para crear los primeros.'
                  : 'No se encontraron códigos con los criterios de búsqueda.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    {['Código', 'Cohorte/Grupo', 'Usos máx.', 'Usos', 'Vigencia', 'Estado', 'Acciones'].map((col) => (
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
                  {filtrados.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-sm font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {c.codigo}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{c.cohorte}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-center">{c.usosMax}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`font-medium ${c.usos >= c.usosMax ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'}`}
                        >
                          {c.usos}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{formatFecha(c.vigencia)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoChipClass[c.estado]}`}>
                          {c.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => copiarCodigo(c.codigo)}
                            title="Copiar código"
                            className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Copiar
                          </button>
                          <button
                            onClick={enviarAlDocente}
                            title="Enviar al docente"
                            className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            Enviar
                          </button>
                          {(c.estado === 'Vigente' || c.estado === 'Agotado') && (
                            <button
                              onClick={() => solicitarRevocar(c)}
                              title="Revocar código"
                              className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-2 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Revocar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
