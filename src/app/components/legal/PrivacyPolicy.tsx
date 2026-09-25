import Header from '../shared/Header';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-8">
      <Header title="Aviso de Privacidad" showBack />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Aviso de Privacidad
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Última actualización: 25 de septiembre de 2026
        </p>

        {/* 1. Responsable */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          1. Responsable del tratamiento de datos personales
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          NutriApp, con domicilio en Ciudad de México, México, es el responsable del uso y protección
          de sus datos personales, de conformidad con la Ley Federal de Protección de Datos Personales
          en Posesión de los Particulares (LFPDPPP) y su Reglamento, en su versión vigente de 2025.
          Para ejercer sus derechos o resolver dudas, puede contactarnos a través de
          privacidad@nutriapp.com.
        </p>

        {/* 2. Datos personales */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          2. Datos personales que recabamos
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Para las finalidades señaladas en el presente aviso, podemos recabar los siguientes datos
          personales:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 pl-4 mb-4">
          <li>Datos de identificación: nombre completo, correo electrónico, teléfono, fecha de nacimiento.</li>
          <li>Datos de contacto: dirección, código postal, ciudad.</li>
          <li>
            Datos académicos y profesionales (nutriólogos): institución de formación, número de cédula
            profesional y especialidad. La ficha pública del nutriólogo muestra su institución de
            formación y número de cédula profesional por exigencia de la normativa aplicable a la
            publicidad de servicios de salud en México.
          </li>
          <li>
            Datos de salud (pacientes): peso, talla, índice de masa corporal, alergias, condiciones
            médicas, objetivos nutricionales y registros de progreso. Estos son datos sensibles y
            requieren consentimiento expreso.
          </li>
          <li>Datos financieros: información de pago necesaria para procesar suscripciones.</li>
          <li>Datos de uso: dirección IP, tipo de dispositivo, sistema operativo y registro de actividad.</li>
        </ul>

        {/* 3. Finalidades */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          3. Finalidades del tratamiento
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Los datos personales que recabamos serán utilizados para las siguientes finalidades
          primarias:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 pl-4 mb-4">
          <li>Proveer los servicios y funcionalidades de la plataforma.</li>
          <li>Gestionar expedientes clínicos digitales.</li>
          <li>Procesar pagos y facturación de suscripciones.</li>
          <li>Enviar notificaciones y recordatorios de citas.</li>
          <li>Cumplir con obligaciones legales y normativas (NOM-004-SSA3-2012, LFPDPPP).</li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          El ranking del catálogo de nutriólogos no utiliza datos de salud ni información personal de
          los pacientes. El orden se determina por disponibilidad, especialidad y cercanía declarada
          por el nutriólogo.
        </p>

        {/* 4. Transferencia de datos */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          4. Transferencia de datos
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Sus datos personales pueden ser compartidos únicamente con terceros necesarios para la
          prestación del servicio:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 pl-4 mb-4">
          <li>Proveedores de almacenamiento en la nube (infraestructura segura con cifrado AES-256).</li>
          <li>Procesadores de pago (Mercado Pago), para suscripciones de nutriólogos.</li>
          <li>Servicios de mensajería (SMS/WhatsApp) para notificaciones de citas, con su consentimiento.</li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          No vendemos, cedemos ni compartimos sus datos personales con terceros para fines publicitarios
          o comerciales ajenos a NutriApp. Todos nuestros proveedores cumplen con estándares
          internacionales de protección de datos.
        </p>

        {/* 5. Medidas de seguridad */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          5. Medidas de seguridad
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Implementamos medidas de seguridad administrativas, técnicas y físicas para proteger sus
          datos contra daño, pérdida, alteración, destrucción o uso no autorizado: cifrado AES-256 en
          reposo y en tránsito, autenticación multifactor (MFA), registro de auditoría completo y
          eliminación segura conforme a NOM-004-SSA3-2012.
        </p>

        {/* 6. Derechos ARCO */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          6. Derechos ARCO
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Conforme a la LFPDPPP, usted tiene derecho a:
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 pl-4 mb-4">
          <li>
            <strong>Acceder</strong> a sus datos personales que poseemos y conocer las condiciones del
            tratamiento.
          </li>
          <li>
            <strong>Rectificar</strong> sus datos en caso de ser inexactos o incompletos.
          </li>
          <li>
            <strong>Cancelar</strong> sus datos cuando considere que no se requieren para las
            finalidades del tratamiento.
          </li>
          <li>
            <strong>Oponerse</strong> al tratamiento de sus datos para fines específicos.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Para ejercer sus derechos ARCO puede acceder al módulo correspondiente en su panel de control
          dentro de NutriApp, o contactarnos directamente a privacidad@nutriapp.com. Responderemos en
          un plazo máximo de 20 días hábiles conforme a la ley.
        </p>

        {/* 7. Cambios al aviso */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          7. Cambios al aviso de privacidad
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Nos reservamos el derecho de efectuar modificaciones o actualizaciones al presente aviso en
          cualquier momento, para atender novedades legislativas, políticas internas o nuevas
          funcionalidades. Le notificaremos de cualquier cambio relevante por correo electrónico o a
          través de un aviso visible en la plataforma.
        </p>

        {/* Contacto */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          8. Contacto
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          Para cualquier duda, aclaración o ejercicio de derechos, puede contactarnos en:
        </p>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-700 dark:text-slate-300 space-y-1">
          <p>
            <strong>Correo:</strong> privacidad@nutriapp.com
          </p>
          <p>
            <strong>Teléfono:</strong> +52 (55) 1234-5678
          </p>
          <p>
            <strong>Dirección:</strong> Ciudad de México, México
          </p>
        </div>
      </div>
    </div>
  );
}
