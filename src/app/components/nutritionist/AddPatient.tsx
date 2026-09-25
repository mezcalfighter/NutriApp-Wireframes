import { useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../shared/Header';
import { toast } from 'sonner';
import { useAuth } from '../../App';
import { Info, UserPlus } from 'lucide-react';

export default function AddPatient() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStudentsAccount = user?.planType === 'students';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    referralSource: '',
    referralCode: '',
  });

  const [showReferralCode, setShowReferralCode] = useState(false);
  const [referralValidated, setReferralValidated] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'referralSource') {
      setShowReferralCode(value === 'referido');
      if (value !== 'referido') {
        setFormData((prev) => ({ ...prev, referralCode: '' }));
        setReferralValidated(false);
      }
    }
  };

  const handleValidateCode = () => {
    const code = formData.referralCode.trim().toUpperCase();
    if (code.startsWith('NUTRI-') && code.length >= 9) {
      setReferralValidated(true);
      toast.success('Código de referido válido.');
    } else {
      setReferralValidated(false);
      toast.error('Código de referido no reconocido. Verifica el código e intenta de nuevo.');
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error('El nombre completo es obligatorio.');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('El correo electrónico es obligatorio.');
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error('El correo electrónico no tiene un formato válido.');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('El teléfono es obligatorio.');
      return;
    }

    toast.success(
      `Expediente de ${formData.fullName} creado. Se enviará una invitación a ${formData.email} para completar el proceso de consentimiento.`
    );
    navigate('/nutritionist/patients');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-6">
      <Header title="Agregar Paciente" showBack />

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Info card */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-blue-800 dark:text-blue-300 text-sm leading-relaxed">
            El expediente se crea en estado <strong>Pendiente de consentimiento</strong>. Solo podrás
            capturar datos de salud una vez que el paciente complete el consentimiento.
          </p>
        </div>

        {/* Students note */}
        {isStudentsAccount && (
          <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
            <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
            <p className="text-purple-800 dark:text-purple-300 text-sm leading-relaxed">
              <strong>Paciente ficticio:</strong> el consentimiento se generará automáticamente.
            </p>
          </div>
        )}

        {/* Información de contacto */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">Información de contacto</h3>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Nombre y apellidos"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Correo electrónico <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="paciente@ejemplo.com"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+52 55 0000 0000"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Fuente de referencia — solo para cuentas no Students */}
        {!isStudentsAccount && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">¿Cómo llegó este paciente?</h3>

            <div>
              <label htmlFor="referralSource" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Fuente de referencia
              </label>
              <select
                id="referralSource"
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              >
                <option value="">Selecciona una opción</option>
                <option value="red_social">Red social</option>
                <option value="referido">Referido</option>
                <option value="google">Búsqueda en Google</option>
                <option value="directorio">Directorio NutriApp</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {showReferralCode && (
              <div>
                <label htmlFor="referralCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Código de referido
                </label>
                <div className="flex gap-2">
                  <input
                    id="referralCode"
                    name="referralCode"
                    type="text"
                    value={formData.referralCode}
                    onChange={handleChange}
                    placeholder="NUTRI-XXXX"
                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleValidateCode}
                    className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    Validar código
                  </button>
                </div>
                {referralValidated && (
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-2">
                    Código válido. Se aplicará un descuento al referidor.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/nutritionist/patients')}
            className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-lg transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Crear expediente
          </button>
        </div>
      </form>
    </div>
  );
}
