import { useState } from 'react';
import { useNavigate } from 'react-router';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../shared/Header';

interface FormFields {
  nombre: string;
  programa: string;
  ciudad: string;
  docenteNombre: string;
  docenteCorreo: string;
  paquete: string;
  fechaInicio: string;
  fechaFin: string;
  cupo: string;
  cuentasDocentes: string;
}

interface FormErrors {
  nombre?: string;
  programa?: string;
  ciudad?: string;
  docenteNombre?: string;
  docenteCorreo?: string;
  dominios?: string;
  paquete?: string;
  fechaInicio?: string;
  fechaFin?: string;
  cupo?: string;
  cuentasDocentes?: string;
}

const paquetes = [
  { valor: 'Aula', etiqueta: 'Aula – $15,000 (IVA incluido)' },
  { valor: 'Formación', etiqueta: 'Formación – $50,000 (IVA incluido)' },
  { valor: 'Integral', etiqueta: 'Integral – $75,000 (IVA incluido)' },
];

function validarDominio(dominio: string): string | null {
  if (dominio.includes('@')) return 'El dominio no debe incluir @.';
  if (dominio.includes(' ')) return 'El dominio no debe contener espacios.';
  if (!dominio.includes('.')) return 'El dominio debe contener al menos un punto.';
  return null;
}

export default function InstitutionForm() {
  const navigate = useNavigate();

  const [fields, setFields] = useState<FormFields>({
    nombre: '',
    programa: '',
    ciudad: '',
    docenteNombre: '',
    docenteCorreo: '',
    paquete: '',
    fechaInicio: '',
    fechaFin: '',
    cupo: '',
    cuentasDocentes: '3',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [dominios, setDominios] = useState<string[]>([]);
  const [dominioInput, setDominioInput] = useState('');
  const [dominioError, setDominioError] = useState('');

  function setField(key: keyof FormFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function agregarDominio() {
    const trimmed = dominioInput.trim().toLowerCase();
    if (!trimmed) return;
    const error = validarDominio(trimmed);
    if (error) {
      setDominioError(error);
      return;
    }
    if (dominios.includes(trimmed)) {
      setDominioError('Este dominio ya fue agregado.');
      return;
    }
    setDominios((prev) => [...prev, trimmed]);
    setDominioInput('');
    setDominioError('');
    setErrors((prev) => ({ ...prev, dominios: undefined }));
  }

  function eliminarDominio(dominio: string) {
    setDominios((prev) => prev.filter((d) => d !== dominio));
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!fields.nombre.trim()) newErrors.nombre = 'El nombre de la institución es requerido.';
    if (!fields.programa.trim()) newErrors.programa = 'El programa académico es requerido.';
    if (!fields.ciudad.trim()) newErrors.ciudad = 'La ciudad es requerida.';
    if (!fields.docenteNombre.trim()) newErrors.docenteNombre = 'El nombre del docente es requerido.';
    if (!fields.docenteCorreo.trim()) {
      newErrors.docenteCorreo = 'El correo del docente es requerido.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.docenteCorreo)) {
      newErrors.docenteCorreo = 'Ingrese un correo electrónico válido.';
    }
    if (dominios.length === 0) newErrors.dominios = 'Debe agregar al menos un dominio de correo.';
    if (!fields.paquete) newErrors.paquete = 'Seleccione un paquete.';
    if (!fields.fechaInicio) newErrors.fechaInicio = 'La fecha de inicio es requerida.';
    if (!fields.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es requerida.';
    } else if (fields.fechaInicio && fields.fechaFin <= fields.fechaInicio) {
      newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio.';
    }
    if (!fields.cupo || Number(fields.cupo) < 1) newErrors.cupo = 'El cupo debe ser al menos 1.';
    if (!fields.cuentasDocentes || Number(fields.cuentasDocentes) < 1)
      newErrors.cuentasDocentes = 'Debe haber al menos 1 cuenta docente.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    toast.success('Institución registrada correctamente');
    navigate('/admin/institutions');
  }

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500';
  const errorClass = 'text-xs text-red-500 dark:text-red-400 mt-1';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1';
  const sectionClass = 'bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-4';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header title="Nueva Institución" showBack />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Datos generales */}
          <div className={sectionClass}>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Datos generales
            </h2>

            <div>
              <label className={labelClass}>Nombre de la institución <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={fields.nombre}
                onChange={(e) => setField('nombre', e.target.value)}
                className={inputClass}
                placeholder="Ej. Universidad Nacional Autónoma de México"
              />
              {errors.nombre && <p className={errorClass}>{errors.nombre}</p>}
            </div>

            <div>
              <label className={labelClass}>Programa académico <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={fields.programa}
                onChange={(e) => setField('programa', e.target.value)}
                className={inputClass}
                placeholder="Ej. Licenciatura en Nutrición Clínica"
              />
              {errors.programa && <p className={errorClass}>{errors.programa}</p>}
            </div>

            <div>
              <label className={labelClass}>Ciudad <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={fields.ciudad}
                onChange={(e) => setField('ciudad', e.target.value)}
                className={inputClass}
                placeholder="Ej. Ciudad de México"
              />
              {errors.ciudad && <p className={errorClass}>{errors.ciudad}</p>}
            </div>
          </div>

          {/* Contacto docente */}
          <div className={sectionClass}>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Contacto docente responsable
            </h2>

            <div>
              <label className={labelClass}>Nombre del docente <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={fields.docenteNombre}
                onChange={(e) => setField('docenteNombre', e.target.value)}
                className={inputClass}
                placeholder="Ej. Dra. María López García"
              />
              {errors.docenteNombre && <p className={errorClass}>{errors.docenteNombre}</p>}
            </div>

            <div>
              <label className={labelClass}>Correo del docente <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={fields.docenteCorreo}
                onChange={(e) => setField('docenteCorreo', e.target.value)}
                className={inputClass}
                placeholder="Ej. mlopez@unam.mx"
              />
              {errors.docenteCorreo && <p className={errorClass}>{errors.docenteCorreo}</p>}
            </div>
          </div>

          {/* Dominios */}
          <div className={sectionClass}>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Dominios de correo permitidos
            </h2>

            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={dominioInput}
                  onChange={(e) => { setDominioInput(e.target.value); setDominioError(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); agregarDominio(); } }}
                  className={`${inputClass} flex-1`}
                  placeholder="Ej. unam.mx"
                />
                <button
                  type="button"
                  onClick={agregarDominio}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Agregar
                </button>
              </div>
              {dominioError && <p className={errorClass}>{dominioError}</p>}
              {errors.dominios && !dominioError && <p className={errorClass}>{errors.dominios}</p>}
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                Mínimo un dominio requerido. Ejemplo: unam.mx, alumnos.iteso.mx
              </p>

              {dominios.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {dominios.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                    >
                      {d}
                      <button
                        type="button"
                        onClick={() => eliminarDominio(d)}
                        className="ml-0.5 hover:text-emerald-900 dark:hover:text-emerald-200 transition-colors"
                        aria-label={`Eliminar ${d}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Paquete y vigencia */}
          <div className={sectionClass}>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Paquete y vigencia
            </h2>

            <div>
              <label className={labelClass}>Paquete <span className="text-red-500">*</span></label>
              <select
                value={fields.paquete}
                onChange={(e) => setField('paquete', e.target.value)}
                className={inputClass}
              >
                <option value="">Seleccione un paquete...</option>
                {paquetes.map((p) => (
                  <option key={p.valor} value={p.valor}>{p.etiqueta}</option>
                ))}
              </select>
              {errors.paquete && <p className={errorClass}>{errors.paquete}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Fecha de inicio del semestre <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={fields.fechaInicio}
                  onChange={(e) => setField('fechaInicio', e.target.value)}
                  className={inputClass}
                />
                {errors.fechaInicio && <p className={errorClass}>{errors.fechaInicio}</p>}
              </div>
              <div>
                <label className={labelClass}>Fecha de fin del semestre <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={fields.fechaFin}
                  onChange={(e) => setField('fechaFin', e.target.value)}
                  min={fields.fechaInicio || undefined}
                  className={inputClass}
                />
                {errors.fechaFin && <p className={errorClass}>{errors.fechaFin}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Cupo de estudiantes <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min={1}
                  value={fields.cupo}
                  onChange={(e) => setField('cupo', e.target.value)}
                  className={inputClass}
                  placeholder="Ej. 30"
                />
                {errors.cupo && <p className={errorClass}>{errors.cupo}</p>}
              </div>
              <div>
                <label className={labelClass}>Número de cuentas docentes <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min={1}
                  value={fields.cuentasDocentes}
                  onChange={(e) => setField('cuentasDocentes', e.target.value)}
                  className={inputClass}
                />
                {errors.cuentasDocentes && <p className={errorClass}>{errors.cuentasDocentes}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
            >
              Guardar institución
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
