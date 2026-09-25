import { useState } from 'react';
import { X, FileText, Download, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';

interface ConsentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notificationConsent: boolean) => void;
  patientName: string;
}

export default function ConsentForm({ isOpen, onClose, onConfirm, patientName }: ConsentFormProps) {
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [notificationsAccepted, setNotificationsAccepted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const generateFolio = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ARCO-${year}-${random}`;
  };

  const handleConfirm = () => {
    const folio = generateFolio();
    setShowSuccess(true);

    setTimeout(() => {
      onConfirm(notificationsAccepted);
      setShowSuccess(false);
      setPrivacyAccepted(false);
      setNotificationsAccepted(false);
    }, 2000);
  };

  const handleDownload = () => {
    alert('En una aplicación real, esto descargaría el Aviso de Privacidad en formato PDF');
  };

  const currentDateTime = new Date().toLocaleString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Consentimiento registrado
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Folio #{generateFolio()}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 bg-white dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Aviso de Privacidad y Consentimiento
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Paciente: {patientName}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                AVISO DE PRIVACIDAD
              </h3>

              <p>
                En cumplimiento con lo establecido por la Ley Federal de Protección de Datos Personales
                en Posesión de los Particulares (LFPDPPP), le informamos lo siguiente:
              </p>

              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Responsable del tratamiento de sus datos personales
              </h4>
              <p>
                NutriApp es responsable del tratamiento de sus datos personales sensibles relacionados
                con su salud, estado físico y nutrición.
              </p>

              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Finalidades del tratamiento
              </h4>
              <p>
                Sus datos personales serán utilizados para las siguientes finalidades necesarias:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Elaboración y seguimiento de su expediente clínico nutricional</li>
                <li>Diseño personalizado de planes dietéticos</li>
                <li>Monitoreo de progreso y ajuste de tratamientos</li>
                <li>Comunicación sobre consultas y seguimiento médico</li>
                <li>Facturación y gestión administrativa</li>
              </ul>

              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Datos personales que se recaban
              </h4>
              <p>
                Para las finalidades mencionadas, requerimos obtener los siguientes datos personales:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Datos de identificación: nombre completo, edad, correo electrónico, teléfono</li>
                <li>Datos personales sensibles de salud: tipo de sangre, alergias, enfermedades, peso, talla, IMC</li>
                <li>Datos de seguimiento: evolución de peso, adherencia a planes dietéticos, progreso</li>
              </ul>

              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Sus Derechos ARCO
              </h4>
              <p>
                Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos
                y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección
                de su información personal en caso de que esté desactualizada, sea inexacta o incompleta
                (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando considere que
                la misma no está siendo utilizada conforme a los principios, deberes y obligaciones previstas
                en la normativa (Cancelación); así como oponerse al uso de sus datos personales para fines
                específicos (Oposición).
              </p>

              <p>
                Para ejercer sus derechos ARCO, puede presentar una solicitud a través de la sección
                correspondiente en su perfil de paciente. Tenemos un plazo máximo de 20 días hábiles para
                atender su solicitud.
              </p>

              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Transferencia de datos
              </h4>
              <p>
                Sus datos personales no serán transferidos a terceros, salvo en los casos previstos en la Ley.
              </p>

              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Modificaciones al aviso de privacidad
              </h4>
              <p>
                Nos reservamos el derecho de efectuar en cualquier momento modificaciones o actualizaciones
                al presente aviso de privacidad. Estas modificaciones estarán disponibles a través de
                nuestra plataforma.
              </p>
            </div>
          </div>
        </div>

        {/* Footer with Checkboxes and Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 space-y-4 bg-white dark:bg-slate-900">
          {/* Mandatory Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer"
              />
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">
              He leído y acepto el Aviso de Privacidad. Autorizo el tratamiento de mis datos personales
              sensibles de salud conforme a la LFPDPPP. <span className="text-red-500">*</span>
            </span>
          </label>

          {/* Optional Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="checkbox"
                checked={notificationsAccepted}
                onChange={(e) => setNotificationsAccepted(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer"
              />
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">
              Acepto recibir notificaciones por SMS y WhatsApp relacionadas con mi expediente
            </span>
          </label>

          {/* Timestamp */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Registro: {currentDateTime}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Descargar aviso de privacidad (PDF)
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!privacyAccepted}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              Confirmar y continuar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
