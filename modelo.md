# NutriApp — Modelo de datos

## institution

| Campo | Tipo | Descripción |
|---|---|---|
| id | string (UUID) | Identificador único |
| nombre | string | Nombre de la institución educativa |
| programa | string | Nombre del programa académico |
| ciudad | string | Ciudad sede |
| contacto_nombre | string | Nombre del docente responsable |
| contacto_correo | string | Correo del docente responsable |
| dominios_permitidos | string[] | Dominios de correo autorizados (ej. unam.mx, dgae.unam.mx) |
| paquete | 'Aula' \| 'Formación' \| 'Integral' | Paquete universidad contratado |
| inicio | date | Fecha de inicio del semestre |
| fin | date | Fecha de fin del semestre |
| cupo | number | Número máximo de estudiantes |
| cuentas_docentes | number | Número de cuentas docentes incluidas (default 3) |
| estado | 'Activa' \| 'Vencida' \| 'Suspendida' | Estado actual |
| created_at | timestamp | Fecha de registro |

## activation_code

| Campo | Tipo | Descripción |
|---|---|---|
| codigo | string | Código en formato NUTRI-XXXX-XXXX |
| institution_id | string (UUID) | Referencia a institution.id |
| cohorte | string | Nombre del grupo o cohorte (ej. "Grupo A", "2026-1") |
| usos_max | number | Número máximo de activaciones permitidas |
| usos | number | Activaciones consumidas |
| vence | date | Fecha de vencimiento |
| estado | 'Vigente' \| 'Agotado' \| 'Vencido' \| 'Revocado' | Estado calculado o explícito |
| revocado_en | timestamp \| null | Fecha de revocación manual |
| created_at | timestamp | Fecha de creación |

## student_account

| Campo | Tipo | Descripción |
|---|---|---|
| id | string (UUID) | Identificador único |
| user_id | string (UUID) | Referencia al usuario autenticado |
| institution_id | string (UUID) | Institución de procedencia |
| activation_code | string | Código usado para activar la cuenta |
| correo_institucional | string | Correo con dominio autorizado |
| vigencia_fin | date | Igual que institution.fin |
| demo_data_generated | boolean | Si ya se generaron los 10 pacientes ficticios |
| created_at | timestamp | Fecha de activación |

## teacher

| Campo | Tipo | Descripción |
|---|---|---|
| id | string (UUID) | Identificador único |
| user_id | string (UUID) | Referencia al usuario autenticado |
| institution_id | string (UUID) | Institución a la que pertenece |
| nombre | string | Nombre completo del docente |
| correo | string | Correo del docente (dominio institucional) |
| created_at | timestamp | Fecha de alta |

## featured_listing

| Campo | Tipo | Descripción |
|---|---|---|
| id | string (UUID) | Identificador único |
| nutriologo_id | string (UUID) | Referencia al nutriólogo |
| ciudad | string | Ciudad donde aparece el Destacado |
| especialidad | string | Especialidad en que aparece |
| desde | date | Inicio del periodo de Destacado |
| vence | date | Fin del periodo de Destacado |
| estado | 'Activo' \| 'Vencido' \| 'Suspendido' | Estado actual |
| impresiones_mes | number | Impresiones en el mes en curso |
| clics_mes | number | Clics en el mes en curso |
| solicitudes_mes | number | Solicitudes de cita en el mes en curso |
| created_at | timestamp | Fecha de alta |

## verification

| Campo | Tipo | Descripción |
|---|---|---|
| id | string (UUID) | Identificador único |
| nutriologo_id | string (UUID) | Referencia al nutriólogo |
| cedula | string | Número de cédula profesional |
| institucion_titulo | string | Institución que expidió el título |
| documento_url | string | URL del documento subido (PDF o imagen) |
| estado | 'Pendiente' \| 'Verificado' \| 'Rechazado' | Estado de la revisión |
| fecha_solicitud | timestamp | Fecha en que se subió el documento |
| fecha_resolucion | timestamp \| null | Fecha en que se resolvió |
| motivo_rechazo | string \| null | Motivo en caso de rechazo |
| verificado_por | string \| null | ID del administrador que aprobó |

## consent_record (declaration_log)

| Campo | Tipo | Descripción |
|---|---|---|
| id | string (UUID) | Folio único |
| patient_id | string (UUID) | Titular del consentimiento |
| nutriologo_id | string (UUID) | Nutriólogo que administra el expediente |
| mecanismo | 'sesión_propia' \| 'dispositivo_nutriologo' | Cómo se firmó el consentimiento |
| aviso_version | string | Versión del aviso de privacidad aceptado |
| fecha | date | Fecha del consentimiento |
| hora | time | Hora del consentimiento |
| created_at | timestamp | Registro en sistema |

## access_log

| Campo | Tipo | Descripción |
|---|---|---|
| id | string (UUID) | Identificador único |
| patient_id | string (UUID) | Expediente accedido |
| actor_id | string (UUID) | Usuario que realizó la acción |
| actor_role | 'nutriologo' \| 'admin' \| 'teacher' | Rol del actor |
| accion | 'Consulta' \| 'Modificación' \| 'Descarga' | Tipo de acceso |
| created_at | timestamp | Fecha y hora del acceso |

## public_profile

| Campo | Tipo | Descripción |
|---|---|---|
| nutriologo_id | string (UUID) | Referencia al nutriólogo (1:1) |
| especialidad | string | Especialidad declarada |
| ciudad | string | Ciudad de atención |
| modalidad | 'Presencial' \| 'En línea' \| 'Ambas' | Modalidad de consulta |
| institucion_titulo | string | Institución que expidió el título (visible en ficha) |
| cedula | string | Número de cédula profesional (visible en ficha) |
| descripcion | string | Descripción corta (máx. 300 caracteres) |
| foto_url | string \| null | URL de foto de perfil |
| verified | boolean | Si tiene la insignia Perfil verificado |
| updated_at | timestamp | Última actualización |

---

## expediente (clinical record)

Registro clínico del paciente administrado por el nutriólogo. Conforme a NOM-004-SSA3-2012, debe conservarse mínimo 5 años tras el último contacto.

| Campo | Tipo | Descripción |
|---|---|---|
| id | string (UUID) | Identificador único |
| patient_id | string (UUID) | Referencia al paciente titular |
| nutriologo_id | string (UUID) | Nutriólogo responsable |
| fecha_apertura | date | Fecha de creación del expediente |
| peso_inicial | number | Peso en kg al inicio del tratamiento |
| talla | number | Estatura en cm |
| objetivo | string | Objetivo nutricional principal |
| alergias | string[] | Lista de alergias declaradas |
| condiciones | string[] | Condiciones médicas relevantes |
| estado | 'Activo' \| 'Cerrado' \| 'Bloqueado' | Estado del expediente |
| cierre_motivo | string \| null | Motivo de cierre o cancelación |
| bloqueo_en | timestamp \| null | Fecha de bloqueo por cancelación ARCO |
| supresion_programada | date \| null | Fecha de eliminación criptográfica (5 años tras cierre) |
| updated_at | timestamp | Última modificación |

## arco_request

Solicitud de ejercicio de derechos ARCO presentada por el paciente. El nutriólogo es el responsable de atenderla en plazo de veinte días (art. 31 LFPDPPP).

| Campo | Tipo | Descripción |
|---|---|---|
| id | string (UUID) | Folio de la solicitud |
| patient_id | string (UUID) | Titular de los datos |
| nutriologo_id | string (UUID) | Responsable del tratamiento |
| derecho | 'Acceso' \| 'Rectificación' \| 'Cancelación' \| 'Oposición' | Tipo de derecho ejercido |
| descripcion | string | Descripción de la solicitud |
| estado | 'Pendiente' \| 'En proceso' \| 'Completada' \| 'Rechazada' | Estado actual |
| fecha_solicitud | timestamp | Fecha en que se presentó |
| fecha_limite | date | Fecha límite para responder (20 días hábiles) |
| fecha_resolucion | timestamp \| null | Fecha de respuesta |
| respuesta | string \| null | Respuesta del nutriólogo |
| created_at | timestamp | Registro en sistema |

## appointment_request

Solicitud de cita enviada por un paciente prospecto a un nutriólogo desde el catálogo público.

| Campo | Tipo | Descripción |
|---|---|---|
| id | string (UUID) | Identificador único |
| nutriologo_id | string (UUID) | Nutriólogo receptor |
| patient_id | string (UUID) \| null | Paciente solicitante (null si es prospecto no registrado) |
| nombre_prospecto | string \| null | Nombre del prospecto si no es usuario registrado |
| correo_prospecto | string \| null | Correo del prospecto |
| modalidad | 'Presencial' \| 'En línea' | Modalidad solicitada |
| mensaje | string \| null | Mensaje opcional |
| estado | 'Pendiente' \| 'Aceptada' \| 'Rechazada' \| 'Cancelada' | Estado |
| created_at | timestamp | Fecha de solicitud |

## post

Publicación del nutriólogo en el módulo de contenido/comunidad.

| Campo | Tipo | Descripción |
|---|---|---|
| id | string (UUID) | Identificador único |
| nutriologo_id | string (UUID) | Autor de la publicación |
| titulo | string | Título del post |
| cuerpo | string | Contenido en texto plano o Markdown |
| visibilidad | 'Privado' \| 'Pacientes' \| 'Público' | Audiencia |
| estado | 'Publicado' \| 'Borrador' \| 'Moderado' \| 'Eliminado' | Estado |
| created_at | timestamp | Fecha de publicación |
| updated_at | timestamp | Última edición |

## moderation_event

Evento de moderación de contenido generado por reportes de usuarios o acción administrativa.

| Campo | Tipo | Descripción |
|---|---|---|
| id | string (UUID) | Identificador único |
| content_type | 'post' \| 'comment' | Tipo de contenido reportado |
| content_id | string (UUID) | ID del post o comentario |
| reportado_por | string (UUID) | Usuario que envió el reporte |
| motivo | string | Categoría de la infracción |
| descripcion | string | Descripción libre |
| estado | 'Pendiente' \| 'Revisado' \| 'Resuelto' | Estado del proceso |
| accion_tomada | string \| null | Acción aplicada (ocultar, eliminar, advertir) |
| admin_id | string (UUID) \| null | Admin que procesó el reporte |
| created_at | timestamp | Fecha del reporte |
| resolved_at | timestamp \| null | Fecha de resolución |

## plan_subscription

Suscripción activa de un nutriólogo a un plan de NutriApp. Pagos procesados vía Mercado Pago.

| Campo | Tipo | Descripción |
|---|---|---|
| id | string (UUID) | Identificador único |
| nutriologo_id | string (UUID) | Nutriólogo suscrito |
| plan | 'basic' \| 'students' | Plan contratado |
| periodicidad | 'mensual' \| 'anual' | Ciclo de facturación |
| monto_mxn | number | Monto en MXN (IVA incluido) |
| estado | 'Activa' \| 'Vencida' \| 'Cancelada' \| 'Suspendida' | Estado del pago |
| inicio | date | Inicio del periodo actual |
| renovacion | date | Próxima fecha de renovación o vencimiento |
| mp_subscription_id | string \| null | ID de suscripción en Mercado Pago |
| cancelada_en | timestamp \| null | Fecha de cancelación |
| created_at | timestamp | Fecha de alta |
