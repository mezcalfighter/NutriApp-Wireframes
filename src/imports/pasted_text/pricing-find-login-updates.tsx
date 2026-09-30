Varias cosas que confirmar antes de escribir:User selected: "Al crear cuenta desde buscar-nutriologo, el nutriologo queda pre-asignado automaticamente", "Solo puede tener 1 nutriologo asignado a la vez" and "Solo via ticket al soporte (como mencionaste)"User selected: "El nutriologo recibe notificacion y tiene X horas para aceptar o rechazar", "Primero ve disponibilidad y precio, despues se registra" and "Modal encima de FindNutritionist sin salir de la pagina"

Una última ronda, ya casi tengo todo:User selected: "48 horas" and "Si rechaza, se le sugieren automaticamente otros nutriologos cercanos"

Ahora sí tengo todo lo que necesito. Aquí va el prompt único:

---

> **Context:** Update `PricingPage.tsx`, `FindNutritionist.tsx`, and `Login.tsx` with the changes described below. All screens use the existing component system, design tokens, and coding patterns. No new dependencies.
>
> ---
>
> ## 1. `PricingPage.tsx` — precios actualizados
>
> Sin cambios estructurales vs. la versión anterior. Solo actualizar precios:
>
> **Basic:**
> - Mensual: $13 USD/mes
> - Anual: $11 USD/mes (cobrado $132/año)
> - Savings anual: *"Ahorras $24 USD al año"*
> - MXN equiv: ~$234 MXN/mes mensual · ~$198 MXN/mes anual
>
> **Pro:**
> - Mensual: $17 USD/mes
> - Anual: $15 USD/mes (cobrado $180/año)
> - Savings anual: *"Ahorras $24 USD al año"*
> - MXN equiv: ~$306 MXN/mes mensual · ~$270 MXN/mes anual
>
> Todo lo demás de `PricingPage.tsx` permanece exactamente igual — caps, features, Students, bloque ¿Necesitas más?, footer note, toggle, progress bars.
>
> ---
>
> ## 2. `FindNutritionist.tsx` — rediseño completo del flujo
>
> **El flujo cambia completamente.** El paciente primero ve nutriólogos disponibles, luego elige, luego se registra o inicia sesión. El search bar de código postal desaparece del tope — los nutriólogos aparecen directamente como cards dinámicas (hardcoded mock) con un mock map interactivo.
>
> ---
>
> **Banner hero (mantener del prompt anterior):**
> - Background: `var(--color-background-info)`
> - Headline: *"Busca un experto en nutrición en minutos"*
> - Subheadline: *"Encuentra nutriólogos cerca de ti, ve su disponibilidad y agenda tu primera cita."*
>
> **Registro rápido inline (mantener del prompt anterior):**
> - Nombre + email en fila → "Crear cuenta gratis" → `/registro-paciente?nombre=[]&email=[]`
> - Link: "¿Ya tienes cuenta? Inicia sesión →" abre `LoginModal` (ver más abajo)
> - Separator: *"o explora nutriólogos disponibles"*
>
> ---
>
> **Mock map interactivo:**
> - CSS-only div, sin librerías externas, fondo `var(--color-background-secondary)` con patrón de grid CSS
> - Texto centrado: *"Tu zona"*
> - 4 pins mock como círculos de color con iniciales del nutriólogo, posicionados en coordenadas fijas (porcentajes hardcoded dentro del div)
> - Cada pin tiene un pequeño badge de disponibilidad encima: punto verde = disponible hoy · punto amber = próximos días · punto gray = sin disponibilidad inmediata
> - Al tocar un pin: ese pin se agranda levemente (CSS transform scale) y la card del nutriólogo correspondiente en la lista de abajo hace scroll into view y resalta con `border: 2px solid var(--color-border-info)`
> - Disclaimer muted 11px: *"Mapa ilustrativo. Ubicaciones aproximadas."*
> - Altura: 220px mobile / 300px desktop
>
> **Search bar de código postal** — mover debajo del mapa como filtro secundario:
> - Texto encima: *"¿No ves tu zona? Filtra por código postal"*
> - Input numérico 5 dígitos + botón "Filtrar" (outline, no primary) — actualiza las cards mock hardcodeadas
>
> ---
>
> **Lista de nutriólogos disponibles (4 cards mock hardcodeadas):**
>
> Cada card contiene:
> - Avatar foto placeholder o círculo de iniciales (Avatar component)
> - Nombre + badge de credencial (*"Lic. Nutrición"*)
> - Specialty tags 1–2 pills
> - Rating ★ + número de reseñas
> - Distancia chip: *"~X km"*
> - **Precio de consulta:** *"Consulta desde $[X] MXN"* — cada mock tiene precio diferente (ej. $350, $500, $450, $600)
> - **Disponibilidad inline expandible** — al tocar el pin en el mapa O al tocar la card, se expande una sección dentro de la card:
>   - Título: *"Próxima disponibilidad"*
>   - Fila horizontal scrollable de los próximos 5 días como pills (ej. "Lun 21" · "Mié 23" · "Vie 25") — algunos días habilitados, otros grayed out (mock)
>   - Al seleccionar un día: grid de horarios disponibles como pills (ej. 9:00 · 10:30 · 12:00) — algunos disponibles, otros grayed out
>   - Al seleccionar horario: aparecen los dos CTAs finales (ver abajo)
>   - Colapsa si se toca otra card o pin
>
> **CTAs dentro de la card (aparecen al seleccionar horario):**
> - Botón primary full-width: "Crear cuenta para agendar" → abre `QuickRegisterModal`
> - Botón outline full-width: "Iniciar sesión para agendar" → abre `LoginModal`
>
> **Mensaje sticky al fondo de la página** (siempre visible, no dentro de ninguna card):
> > Info Alert (azul, dismissable una vez): *"¿Ya tienes un nutriólogo asignado en NutriApp y deseas cambiar? Abre un ticket para liberar tu registro. Tu nutriólogo actual será notificado."* + link inline "Abrir ticket →" → abre `ChangeNutritionistTicketModal`
>
> ---
>
> **Modal: `QuickRegisterModal`** (Dialog component existente)
>
> Contexto del nutriólogo seleccionado visible en el header del modal:
> - Avatar + nombre + horario seleccionado (ej. *"Agendar con Lic. García — Lunes 21, 10:30 hrs"*)
>
> Campos:
> - Nombre completo (text, required)
> - Email (email, required)
> - Contraseña (password, min 8 chars, required)
> - Fecha de nacimiento (date picker, required — validar mayor de 18)
>
> Checkbox obligatorio sin pre-marcar:
> - `[ ]` *"Acepto el Aviso de Privacidad y Términos de Uso. Entiendo que mis datos serán tratados conforme a la LFPDPPP."*
>
> CTA: "Crear cuenta y solicitar cita" — disabled hasta que checkbox marcado. Al confirmar:
> - Cuenta creada en local state
> - Nutriólogo queda pre-asignado automáticamente
> - Estado de la solicitud: `PENDING_NUTRITIONIST_APPROVAL`
> - Success screen dentro del modal: checkmark + *"¡Solicitud enviada! Lic. [nombre] tiene 48 horas para confirmar tu cita. Te notificaremos por email."*
> - Botón: "Entendido" → cierra modal → paciente va a patient Dashboard
>
> Note muted abajo del success: *"Si el nutriólogo no confirma en 48 horas, te sugeriremos opciones alternativas cercanas automáticamente."*
>
> ---
>
> **Modal: `LoginModal`** (Dialog component existente)
>
> Contexto del nutriólogo visible en header: mismo que `QuickRegisterModal`
>
> Campos: Email + Contraseña — formulario exacto del Login.tsx existente pero dentro de un modal
>
> CTA: "Iniciar sesión y solicitar cita" → al autenticar: nutriólogo pre-asignado al paciente con estado `PENDING_NUTRITIONIST_APPROVAL` → success screen idéntico al de `QuickRegisterModal`
>
> Link debajo: "¿No tienes cuenta? Regístrate →" → cierra este modal y abre `QuickRegisterModal`
>
> ---
>
> **Modal: `ChangeNutritionistTicketModal`** (Dialog component existente)
>
> - Título: *"Solicitar cambio de nutriólogo"*
> - Info note (amber): *"Tu nutriólogo actual será notificado de esta solicitud. El proceso puede tomar hasta 48 horas hábiles."*
> - Campos:
>   - Razón del cambio — dropdown: "Cambio de ubicación" · "No es compatible con mis objetivos" · "Problemas de comunicación" · "Otro"
>   - Descripción (textarea, optional, placeholder: *"Detalles adicionales (opcional)"*)
> - Checkbox: `[ ]` *"Entiendo que esta acción notificará a mi nutriólogo actual."*
> - CTA: "Enviar solicitud" → genera folio `CHG-[8 dígitos]` → success toast: *"Solicitud #CHG-XXXXXXXX enviada. Te contactaremos en menos de 48 horas."* → modal cierra
> - Mock: guarda en local state
>
> ---
>
> **Data model (mock — real backend PostgreSQL):**
> ```
> PatientNutritionistAssignment: {
>   patient_id,
>   nutritionist_id,
>   status: 'PENDING_NUTRITIONIST_APPROVAL' |
>           'ACTIVE' | 'REJECTED' | 'RELEASED',
>   requested_slot?,
>   assigned_at?,
>   expires_at?,   // assigned_at + 48hrs si PENDING
>   rejection_reason?
> }
>
> ChangeNutritionistTicket: {
>   id, folio, patient_id,
>   current_nutritionist_id,
>   reason, description?,
>   status: 'OPEN' | 'RESOLVED',
>   created_at
> }
> ```
> Mock con local state — mismo patrón que screens existentes.
>
> ---
>
> ## 3. `Login.tsx` — limpieza y navegación
>
> **Quitar completamente:** cualquier botón, link o referencia a "Ver precios", planes, o "Regístrate como nutriólogo" — ese link no funciona y se elimina.
>
> **Agregar top left:** link sutil *"← Inicio"* → `/` — `variant="ghost"` o texto plano, no botón prominente.
>
> **Encima del formulario:**
> - Logo NutriApp centrado (mantener existente)
> - Tagline nueva debajo del logo (muted, 13px): *"Gestión clínica segura · Cumplimiento LFPDPPP incluido"*
>
> **Formulario existente:** mantener exactamente — email + contraseña + "Iniciar sesión" + "¿Olvidaste tu contraseña?"
>
> **Debajo del formulario — dos links únicamente:**
> - *"¿Eres paciente?"* + link "Busca tu nutriólogo →" → `/buscar-nutriologo`
> - *"¿Buscas información?"* + link "Ver la app →" → `/`
>
> ---
>
> **Design constraints:**
> - Mock map: CSS only, sin librerías externas. Pins como `div` absolutos con `border-radius: 50%` e iniciales
> - Pin seleccionado: `transform: scale(1.3)` + `z-index` mayor
> - Card expandible: `useState` por card — solo una expandida a la vez, colapsa las demás al abrir una nueva
> - Días y horarios: arrays hardcodeados por nutriólogo mock, algunos `disabled` (grayed, non-tappable)
> - CTAs de cita solo aparecen después de seleccionar día Y horario — antes permanecen ocultos
> - `LoginModal` y `QuickRegisterModal` comparten el mismo header de contexto del nutriólogo — extraer como subcomponente
> - Mensaje sticky de cambio de nutriólogo: `Alert` component, dismissable con `useState`, solo reaparece en fresh load
> - Toggle mensual/anual en `PricingPage` actualiza Basic y Pro — Students siempre $0
> - Todo en español · mobile-first · sin dependencias nuevas · solo componentes en `package.json`