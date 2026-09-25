Buenas observaciones, antes de escribir confirmo los puntos que tienen implicaciones de diseño:

User selected: "Para cualquier paciente nuevo que nunca ha tenido cita con ese nutriologo", "Se cancela y el paciente ve nueva disponibilidad del mismo nutriologo" and "Pagina de login dedicada con el contexto del nutriologo en la URL como query param"

Perfecto, tengo todo. Aquí va el prompt:

Context: Update FindNutritionist.tsx and add changes to the nutritionist side (nutritionist/Appointments.tsx or AppointmentsManager.tsx). These changes affect the patient discovery and booking flow, MFA login context, slot expiration handling, and first-time patient confirmation on the nutritionist side. Use existing component system exactly. No new dependencies.

1. FindNutritionist.tsx — cambios al flujo
Quitar completamente: el bloque de registro rápido (nombre + email + "Crear cuenta gratis") que aparecía antes del mapa. El separator "o explora nutriólogos disponibles" también se elimina.

El nuevo flujo es estrictamente: ver mapa → seleccionar pin → ver disponibilidad y precio → seleccionar slot → iniciar sesión o crear cuenta para confirmar. El registro o login ocurre al final, no al principio.

Banner hero (mantener):

Background: var(--color-background-info)
Headline: "Busca un experto en nutrición en minutos"
Subheadline: "Selecciona un nutriólogo en el mapa, elige tu horario y agenda tu cita."
Mock map interactivo (primer elemento visible después del banner):

CSS-only, sin librerías externas
4 pins mock con iniciales, posicionados en coordenadas fijas (porcentajes hardcoded)
Badge de disponibilidad encima de cada pin: punto verde = disponible hoy · punto amber = próximos días · punto gray = sin disponibilidad inmediata
Al tocar un pin: se agranda con transform: scale(1.3), la card correspondiente hace scroll into view y resalta con border: 2px solid var(--color-border-info)
Disclaimer muted 11px: "Mapa ilustrativo. Ubicaciones aproximadas."
Altura: 220px mobile / 300px desktop
Search bar de código postal — debajo del mapa como filtro secundario:

Label: "¿No ves tu zona? Filtra por código postal"
Input 5 dígitos + botón "Filtrar" (outline) — actualiza cards mock
Cards de nutriólogos (debajo del mapa):

Cada card contiene:

Avatar + nombre + badge credencial + specialty tags + rating + distancia
Precio: "Consulta desde $[X] MXN" — valor diferente por cada mock
Sección de disponibilidad — se expande al tocar el pin del mapa O al tocar la card directamente:
Título: "Selecciona día y horario"
Fila horizontal scrollable de próximos 5 días como pills — algunos habilitados, otros grayed out (mock). Los días en el pasado nunca aparecen.
Al seleccionar día: grid de horarios disponibles como pills — algunos disponibles, otros grayed out
Solo una card expandida a la vez — al abrir otra se colapsa la anterior
CTAs — aparecen únicamente después de seleccionar día Y horario:

Botón primary full-width: "Crear cuenta para agendar" → redirige a /registro-paciente?nutriologo=[id]&slot=[datetime]
Botón outline full-width: "Iniciar sesión para agendar" → redirige a /login?nutriologo=[id]&slot=[datetime]&redirect=confirmar-cita
Slot expirado: Si el paciente regresa a FindNutritionist después de haber seleccionado un slot y la fecha ya pasó (comparando con fecha actual en local state):

El slot seleccionado previamente se muestra tachado con texto rojo muted: "Este horario ya no está disponible"
Automáticamente se colapsa y reabre la sección de disponibilidad del mismo nutriólogo mostrando los próximos slots actuales
Toast informativo: "El horario que habías seleccionado ya no está disponible. Elige un nuevo horario."
No se sugiere otro nutriólogo — el paciente permanece con el mismo nutriólogo seleccionado
Paciente con sesión activa y nutriólogo ya asignado:

Ocultar ambos CTAs
Mostrar texto muted 12px: "Ya tienes un nutriólogo asignado. Para cambiar, ve a tu Perfil → Configuración."
2. Login.tsx — contexto de nutriólogo vía query params
Cuando Login.tsx recibe query params ?nutriologo=[id]&slot=[datetime]&redirect=confirmar-cita, el comportamiento cambia:

Banner contextual encima del formulario (info Alert, non-dismissable):

Avatar del nutriólogo + nombre + slot seleccionado
Texto: "Inicia sesión para confirmar tu cita con [nombre] el [fecha] a las [hora]."
Flujo MFA completo:

Login normal → si el usuario tiene MFA activo, redirige a MFAVerification.tsx con los mismos query params preservados en la URL
Al completar MFA exitosamente: redirige a /confirmar-cita?nutriologo=[id]&slot=[datetime]
Nueva pantalla: /confirmar-cita (ConfirmAppointment.tsx):

Header: "Confirma tu cita"
Card resumen: avatar nutriólogo + nombre + fecha + hora + precio
Verificación de slot en tiempo real (mock): si el slot sigue disponible → mostrar botón "Confirmar cita" (primary). Si el slot ya no está disponible → mostrar amber Alert: "Este horario ya no está disponible." + botón "Ver nueva disponibilidad" → redirige a /buscar-nutriologo con el nutriólogo pre-seleccionado
Al confirmar: estado PENDING_NUTRITIONIST_APPROVAL en local state → success screen: "¡Solicitud enviada! [Nombre del nutriólogo] tiene 48 horas para confirmar. Te notificaremos por email."
Note muted: "Si no recibe confirmación en 48 horas, verás nuevas opciones disponibles automáticamente."
3. Lado del nutriólogo — confirmación de primeros pacientes
En nutritionist/AppointmentsManager.tsx o nutritionist/Appointments.tsx (el que exista):

Agregar una nueva sección al tope de la pantalla: "Solicitudes de nuevos pacientes" — visible únicamente cuando hay solicitudes pendientes con estado PENDING_NUTRITIONIST_APPROVAL.

Card de solicitud por cada paciente nuevo:

Avatar iniciales + nombre del paciente + "Paciente nuevo" badge (blue)
Slot solicitado: fecha + hora
Tiempo restante para responder: countdown chip — "Tienes [X] horas para responder" — se vuelve rojo cuando quedan menos de 6 horas
Dos botones side by side:
"Confirmar cita" (primary, green) → cambia estado a ACTIVE → toast: "Cita confirmada. [Nombre] será notificado."
"Rechazar" (outline, red) → abre mini modal de razón:
Dropdown: "No tengo disponibilidad en ese horario" · "Mi agenda está llena" · "Otro"
Textarea opcional
CTA: "Confirmar rechazo" → estado REJECTED → paciente ve nuevos nutriólogos sugeridos automáticamente en su app
Comportamiento del countdown:

Al llegar a 0 horas: la solicitud desaparece automáticamente de esta sección
Estado cambia a EXPIRED
El paciente recibe notificación automática y ve nuevos nutriólogos sugeridos
Si no hay solicitudes pendientes: la sección "Solicitudes de nuevos pacientes" no se muestra — no hay empty state, simplemente no aparece.

Sección de citas regulares (la que ya existe en la pantalla) permanece exactamente igual debajo de las solicitudes.

Data model (mock — real backend PostgreSQL):

AppointmentRequest: {
  id,
  patient_id,
  patient_name,
  nutritionist_id,
  requested_slot,        // ISO datetime
  status: 'PENDING_NUTRITIONIST_APPROVAL' |
          'ACTIVE' | 'REJECTED' | 'EXPIRED',
  expires_at,            // requested_at + 48hrs
  rejection_reason?,
  is_first_time_patient: boolean
}
Mock con local state. El countdown se simula con useEffect + setInterval que actualiza cada minuto. expires_at es un valor hardcoded en el mock (ej. 47 horas desde ahora).

Routing actualizado:

/buscar-nutriologo          → FindNutritionist.tsx (sin registro rápido)
/login?nutriologo=[]&slot=[]&redirect=confirmar-cita
                            → Login.tsx con banner contextual
/confirmar-cita?nutriologo=[]&slot=[]
                            → ConfirmAppointment.tsx
/registro-paciente?nutriologo=[]&slot=[]
                            → PatientRegister.tsx (slot pre-guardado)
Design constraints:

Quitar completamente el bloque de registro rápido (nombre + email + "Crear cuenta gratis") de FindNutritionist — el flujo empieza con el mapa
CTAs de cita solo visibles después de seleccionar día Y horario — antes permanecen ocultos con display: none o condicional en state
Query params nutriologo y slot se preservan a través de todo el flujo incluyendo MFA
Slot expirado: comparar fecha del slot con new Date() en useEffect al montar el componente
Countdown del nutriólogo: useEffect con setInterval de 60 segundos, limpiar con clearInterval en cleanup
ConfirmAppointment.tsx verifica slot en mock: si requested_slot < new Date() → mostrar alert de no disponible
Todo en español · mobile-first · sin dependencias nuevas · solo componentes en package.json

