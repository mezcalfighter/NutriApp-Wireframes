import { useState } from 'react';
import { useNavigate } from 'react-router';
import MobileNav from '../shared/MobileNav';
import Header from '../shared/Header';
import { User, Mail, Phone, Calendar, Droplet, Ruler, Weight, Save, Eye, Edit, Trash2, ShieldAlert, FileText, Newspaper, CreditCard } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from 'sonner';

export default function PatientProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@correo.com',
    phone: '+52 55 1234 5678',
    age: '35',
    bloodType: 'O+',
    height: '175',
    weight: '68',
  });

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedArcoType, setSelectedArcoType] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, changes would be logged automatically for LFPDPPP compliance
    toast.success('Perfil actualizado exitosamente. Tus cambios han sido registrados en el sistema de auditoría conforme a la LFPDPPP.');
  };

  const handleArcoRequest = (type: string) => {
    if (type === 'cancelacion') {
      setSelectedArcoType(type);
      setShowCancelDialog(true);
    } else {
      submitArcoRequest(type);
    }
  };

  const submitArcoRequest = (type: string) => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const folio = `ARCO-${year}-${random}`;

    // In a real app, this would save to the backend
    console.log('ARCO request submitted:', { type, folio });

    toast.success(
      `Tu solicitud fue recibida. Folio: ${folio}. Recibirás respuesta en tu correo verificado en un máximo de veinte días conforme a la LFPDPPP.`,
      { duration: 6000 }
    );

    setShowCancelDialog(false);
    setSelectedArcoType('');
  };

  const arcoRights = [
    {
      id: 'acceso',
      icon: Eye,
      title: 'Acceso',
      description: 'Solicitar copia de todos mis datos registrados en el sistema',
      color: 'blue',
    },
    {
      id: 'rectificacion',
      icon: Edit,
      title: 'Rectificación',
      description: 'Solicitar la corrección de mis datos cuando sean inexactos o estén desactualizados',
      color: 'amber',
    },
    {
      id: 'cancelacion',
      icon: Trash2,
      title: 'Cancelación',
      description: 'Solicitar el bloqueo de mis datos personales conforme a la normativa',
      color: 'red',
    },
    {
      id: 'oposicion',
      icon: ShieldAlert,
      title: 'Oposición',
      description: 'Oponerme al uso de mis datos para fines secundarios',
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header title="Mi Perfil" showMenu />

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm text-center">
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-emerald-700 dark:text-emerald-400" />
          </div>
          <h2 className="text-slate-900 dark:text-white mb-1">{formData.name}</h2>
          <p className="text-slate-500 dark:text-slate-400">Paciente</p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Edita tu información directamente
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Puedes actualizar tus datos en cualquier momento. Todos los cambios se registran automáticamente en nuestro sistema de auditoría para cumplir con la LFPDPPP.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-slate-900 dark:text-white">Información personal</h3>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-slate-900 dark:text-white">Información de salud</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2">Edad</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2">Tipo de sangre</label>
              <div className="relative">
                <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2">Altura (cm)</label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-2">Peso (kg)</label>
              <div className="relative">
                <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <h3 className="text-slate-900 dark:text-white mb-3">Mi Nutricionista</h3>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <span className="text-emerald-700 dark:text-emerald-400">S</span>
            </div>
            <div>
              <p className="text-slate-900 dark:text-white">Lic. Andrea Martínez</p>
              <p className="text-slate-500 dark:text-slate-400">Especialista en Nutrición Clínica</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-2">
          <button
            onClick={() => navigate('/patient/community')}
            className="w-full flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 p-3 rounded-lg transition-colors"
          >
            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-slate-900 dark:text-white mb-1">Feed Social</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Contenido de tu nutriólogo
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate('/pricing')}
            className="w-full flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 p-3 rounded-lg transition-colors"
          >
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-slate-900 dark:text-white mb-1">Planes y Precios</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Ver planes disponibles
              </p>
            </div>
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Guardar Cambios
        </button>
      </form>

      {/* ARCO Rights Section */}
      <div className="p-4 space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-slate-900 dark:text-white font-semibold">
              Mis derechos sobre mis datos (Derechos ARCO)
            </h3>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Como titular de datos personales, tienes derecho de Acceso, Rectificación, Cancelación u Oposición (ARCO) conforme a la LFPDPPP. Tu nutriólogo es el responsable de atender estas solicitudes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {arcoRights.map((right) => {
              const Icon = right.icon;
              return (
                <div
                  key={right.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        right.color === 'blue'
                          ? 'bg-blue-100 dark:bg-blue-900/30'
                          : right.color === 'amber'
                          ? 'bg-amber-100 dark:bg-amber-900/30'
                          : right.color === 'red'
                          ? 'bg-red-100 dark:bg-red-900/30'
                          : 'bg-purple-100 dark:bg-purple-900/30'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          right.color === 'blue'
                            ? 'text-blue-600 dark:text-blue-400'
                            : right.color === 'amber'
                            ? 'text-amber-600 dark:text-amber-400'
                            : right.color === 'red'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-purple-600 dark:text-purple-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {right.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {right.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleArcoRequest(right.id)}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      right.color === 'blue'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                        : right.color === 'amber'
                        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                        : right.color === 'red'
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                        : 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                    }`}
                  >
                    Solicitar
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cancelación Warning Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-white dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-white">
              Solicitud de Cancelación de Datos
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 dark:text-slate-400 space-y-2">
              <span className="block">
                Tu solicitud la resolverá tu nutriólogo en un plazo de veinte días. Si procede, tu expediente clínico pasará a estado de bloqueo y se conservará cifrado, sin acceso para la operación diaria, durante los cinco años que la norma exige contar desde tu último acto médico (NOM-004-SSA3-2012, arts. 24 y 25).
              </span>
              <span className="block">
                Tu cuenta, datos de contacto y preferencias se suprimen de inmediato. Al vencer ese plazo, el expediente se elimina de forma definitiva y recibirás el aviso con folio en tu correo verificado.
              </span>
              <span className="block font-medium text-slate-700 dark:text-slate-300">
                ¿Deseas continuar?
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => submitArcoRequest('cancelacion')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Enviar solicitud
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MobileNav role="patient" />
    </div>
  );
}