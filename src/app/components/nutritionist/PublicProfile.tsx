import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertTriangle, ExternalLink, Star, Clock, MapPin, Video, Users } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../shared/Header';
import MobileNav from '../shared/MobileNav';
import { useAuth } from '../../App';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

type Modalidad = 'Presencial' | 'En línea' | 'Ambas';

export default function PublicProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [especialidad, setEspecialidad] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [modalidad, setModalidad] = useState<Modalidad>('Presencial');
  const [institucion, setInstitucion] = useState('');
  const [cedula, setCedula] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [featured] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [publishConfirmed, setPublishConfirmed] = useState(false);

  const modalidades: Modalidad[] = ['Presencial', 'En línea', 'Ambas'];

  const modalidadIcon = (m: Modalidad) => {
    if (m === 'Presencial') return <MapPin className="w-3.5 h-3.5" />;
    if (m === 'En línea') return <Video className="w-3.5 h-3.5" />;
    return <Users className="w-3.5 h-3.5" />;
  };

  const displayName = user?.email ? `Lic. ${user.email.split('@')[0]}` : 'Lic. [Tu nombre]';
  const displayEspecialidad = especialidad || 'Especialidad';
  const displayCiudad = ciudad || 'Ciudad';

  const handleSave = () => {
    toast.success('Perfil público actualizado');
  };

  const handlePublishConfirm = () => {
    toast.success('Perfil publicado.');
    setPublishDialogOpen(false);
    setPublishConfirmed(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Perfil Público" showBack />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Foto de perfil */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Foto de perfil
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {user?.email ? user.email.slice(0, 2).toUpperCase() : 'NU'}
              </span>
            </div>
            <button
              onClick={() => toast('Función de carga disponible próximamente')}
              className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              Cambiar foto
            </button>
          </div>
        </section>

        {/* Datos profesionales */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Datos profesionales
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5 space-y-5">

            {/* Especialidad */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Especialidad
              </label>
              <input
                type="text"
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                placeholder="Ej. Nutrición clínica"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            {/* Ciudad */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Ciudad
              </label>
              <input
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder="Ej. Ciudad de México"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            {/* Modalidad */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Modalidad de atención
              </label>
              <div className="flex gap-2 flex-wrap">
                {modalidades.map((m) => (
                  <button
                    key={m}
                    onClick={() => setModalidad(m)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                      modalidad === m
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-400'
                    }`}
                  >
                    {modalidadIcon(m)}
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Institución */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Institución que expidió el título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={institucion}
                onChange={(e) => setInstitucion(e.target.value)}
                placeholder="Ej. Universidad Nacional Autónoma de México"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Visible en tu ficha pública</p>
            </div>

            {/* Cédula profesional */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Número de cédula profesional <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Ej. 12345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Visible en tu ficha pública</p>
            </div>
          </div>
        </section>

        {/* Descripción corta */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Descripción corta
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5 space-y-3">
            <div>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value.slice(0, 300))}
                maxLength={300}
                rows={4}
                placeholder="Cuéntale a tus pacientes sobre tu enfoque de trabajo, formación y servicios que ofreces..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
              />
              <p className="text-xs text-right text-slate-400 dark:text-slate-500 mt-1">
                {descripcion.length}/300 caracteres
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3.5 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-300">
                La ficha no puede prometer resultados ni describir tratamientos. Solo informa el tipo, características y finalidades de tu servicio.
              </p>
            </div>
          </div>
        </section>

        {/* Disponibilidad */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Disponibilidad
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5 flex items-center gap-3">
            <Clock className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <p className="text-sm text-slate-600 dark:text-slate-400 flex-1">
              El horario de disponibilidad se toma de tu configuración en Agenda.
            </p>
            <button
              onClick={() => navigate('/nutritionist/availability')}
              className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 whitespace-nowrap transition-colors"
            >
              Ir a Agenda
            </button>
          </div>
        </section>

        {/* Datos declarados */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Credenciales profesionales declaradas
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5 space-y-3">
            {cedula && (
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Cédula profesional (declarada)</p>
                <p className="text-sm text-slate-800 dark:text-slate-100 mt-0.5">{cedula}</p>
              </div>
            )}
            {institucion && (
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Institución del título (declarada)</p>
                <p className="text-sm text-slate-800 dark:text-slate-100 mt-0.5">{institucion}</p>
              </div>
            )}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Datos declarados bajo protesta de decir verdad. Verifica en{' '}
                <a
                  href="https://cedulas.sep.gob.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  cédulas.sep.gob.mx
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Vista previa */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Vista previa en el catálogo
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5 space-y-3">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {user?.email ? user.email.slice(0, 2).toUpperCase() : 'NU'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-slate-900 dark:text-slate-100">{displayName}</p>
                  {featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-600 text-xs text-slate-500 dark:text-slate-400">
                      <Star className="w-3 h-3" />
                      Patrocinado
                    </span>
                  )}
                </div>
                {(cedula || institucion) && (
                  <div className="mt-1 space-y-0.5">
                    {cedula && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Cédula profesional (declarada): <span className="text-slate-700 dark:text-slate-300">{cedula}</span>
                      </p>
                    )}
                    {institucion && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Institución del título (declarada): <span className="text-slate-700 dark:text-slate-300">{institucion}</span>
                      </p>
                    )}
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                      Datos declarados bajo protesta de decir verdad. Verifica en cédulas.sep.gob.mx
                    </p>
                  </div>
                )}
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{displayEspecialidad}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">{displayCiudad}</p>
                  <span className="text-slate-300 dark:text-slate-600 mx-1">·</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{modalidad}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guardar / Publicar */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSave}
            className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-xl transition-colors text-sm border border-slate-200 dark:border-slate-700"
          >
            Guardar borrador
          </button>
          <button
            onClick={() => setPublishDialogOpen(true)}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            Publicar ficha
          </button>
        </div>

      </main>

      {/* Publish confirmation dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={(open) => { setPublishDialogOpen(open); if (!open) setPublishConfirmed(false); }}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>Publicar perfil profesional</DialogTitle>
            <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
              Al publicar, declares bajo protesta de decir verdad que los datos de cédula profesional e institución del título son correctos. Estos datos son de acceso público conforme a la normativa. NutriApp no verifica ni acredita credenciales.
            </DialogDescription>
          </DialogHeader>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={publishConfirmed}
              onChange={(e) => setPublishConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Confirmo que los datos son correctos y me hago responsable de su veracidad
            </span>
          </label>
          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={handlePublishConfirm}
              disabled={!publishConfirmed}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 dark:disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              Publicar perfil
            </button>
            <button
              onClick={() => { setPublishDialogOpen(false); setPublishConfirmed(false); }}
              className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              Cancelar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <MobileNav role="nutritionist" />
    </div>
  );
}
