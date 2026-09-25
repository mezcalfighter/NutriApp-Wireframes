import Header from '../shared/Header';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-8">
      <Header title="Términos de Uso" showBack />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Términos de Uso</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Última actualización: 25 de septiembre de 2026
        </p>

        {/* 1. Aceptación */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          1. Aceptación de los términos
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Al acceder y utilizar NutriApp, usted acepta estar sujeto a estos Términos de Uso y a todas
          las leyes y regulaciones aplicables en los Estados Unidos Mexicanos. Si no está de acuerdo
          con alguno de estos términos, no debe utilizar este servicio.
        </p>

        {/* 2. Descripción del servicio */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          2. Descripción del servicio
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          NutriApp es una plataforma digital que facilita la gestión de consultas nutricionales,
          permitiendo a nutriólogos gestionar expedientes clínicos digitales y a pacientes encontrar y
          agendar citas con profesionales de la nutrición. El servicio incluye herramientas de
          seguimiento, asignación de planes alimenticios y comunicación segura entre profesional y
          paciente.
        </p>

        {/* 3. Uso de la plataforma */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          3. Uso de la plataforma
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Para utilizar ciertos servicios de NutriApp, debe crear una cuenta proporcionando información
          veraz y completa. Usted es responsable de mantener la confidencialidad de su contraseña, de
          todas las actividades que ocurran bajo su cuenta y de notificarnos inmediatamente de
          cualquier uso no autorizado. Usted se compromete a no utilizar el servicio para actividades
          ilegales, cargar contenido malicioso, interferir con el funcionamiento del servicio ni
          compartir información falsa o engañosa.
        </p>

        {/* 4. Privacidad */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          4. Privacidad y tratamiento de datos
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          El tratamiento de sus datos personales se rige por nuestro Aviso de Privacidad, conforme a
          la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
          Los datos de salud de los pacientes son datos sensibles y reciben protección reforzada. El
          consentimiento para el tratamiento de datos de salud se recaba mediante un mecanismo
          verificable que genera un folio con fecha, hora e identidad del titular.
        </p>

        {/* 5. Suscripciones y pagos */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          5. Suscripciones y pagos
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Los planes de suscripción para nutriólogos (Students, Basic, Pro) tienen límites específicos
          de pacientes y funciones. Los cargos se realizan mensual o anualmente según el plan elegido,
          a través de Mercado Pago. Los precios incluyen el Impuesto al Valor Agregado (IVA) conforme
          a la legislación mexicana vigente. El plan Students requiere un código de activación
          proporcionado por una institución educativa registrada. El uso de la plataforma para
          pacientes es gratuito; el pago de consultas se realiza directamente con el nutriólogo.
        </p>

        {/* 6. Cuentas Students e instituciones */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          6. Cuentas Students e instituciones
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Las cuentas Students están diseñadas exclusivamente para uso académico con datos ficticios
          generados por el sistema. El uso de una cuenta Students con datos de personas reales está
          expresamente prohibido y constituye una violación a estos Términos y a la LFPDPPP. La
          institución educativa es responsable de la entrega y control de los códigos de activación a
          sus estudiantes. La vigencia de la cuenta Students corresponde al semestre académico acordado
          entre NutriApp y la institución. Al término del semestre, la cuenta puede convertirse a un
          plan de pago con descuento de egresado.
        </p>

        {/* 7. Destacado en el catálogo */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          7. Destacado en el catálogo
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          El servicio Destacado es un complemento de exposición que el nutriólogo contrata de forma
          voluntaria. Los resultados marcados como Patrocinado en el catálogo de NutriApp son
          nutriólogos que han contratado este complemento. Nunca aparecerán más de dos resultados
          patrocinados entre los primeros cinco resultados de búsqueda. La rotación entre nutriólogos
          destacados es equitativa; pagar más no otorga un lugar fijo. La activación del Destacado
          requiere contar con la insignia Perfil verificado (cédula profesional acreditada). NutriApp
          no garantiza resultados específicos de consultas o ingresos derivados del Destacado.
        </p>

        {/* 8. Propiedad intelectual */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          8. Propiedad intelectual
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Todo el contenido, características y funcionalidad de NutriApp, incluyendo pero no limitado
          a texto, gráficos, logotipos, iconos y software, son propiedad exclusiva de NutriApp y están
          protegidos por las leyes de derechos de autor internacionales y la Ley Federal del Derecho de
          Autor de México. Queda prohibida su reproducción total o parcial sin autorización expresa y
          por escrito.
        </p>

        {/* 9. Limitación de responsabilidad */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          9. Limitación de responsabilidad
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          NutriApp se proporciona "tal cual" sin garantías de ningún tipo. No seremos responsables de
          daños indirectos, incidentales, especiales o consecuentes que resulten del uso o imposibilidad
          de usar el servicio. Los nutriólogos mantienen total responsabilidad profesional sobre las
          decisiones clínicas y tratamientos proporcionados a sus pacientes. NutriApp es una herramienta
          de gestión y no sustituye el juicio profesional ni constituye consejo médico.
        </p>

        {/* 10. Modificaciones */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          10. Modificaciones a los términos
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Le notificaremos
          de cambios significativos por correo electrónico o mediante un aviso en la plataforma. El uso
          continuado del servicio después de tales modificaciones constituye su aceptación de los nuevos
          términos.
        </p>

        {/* Contacto */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
          11. Contacto
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          Si tiene preguntas sobre estos Términos de Uso, puede contactarnos en:
        </p>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-700 dark:text-slate-300 space-y-1">
          <p>
            <strong>Correo:</strong> legal@nutriapp.com
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
