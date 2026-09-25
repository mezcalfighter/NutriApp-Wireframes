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
