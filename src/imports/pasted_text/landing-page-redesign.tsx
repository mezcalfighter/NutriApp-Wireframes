Antes de escribir el prompt, una sola cosa que cambia el diseño:

User selected: "Carrusel automático que alterna entre la vista nutriólogo y la vista paciente" and "En una pantalla dedicada post-registro: 'Encuentra tu nutriólogo'"

Perfecto. Aquí van los prompts:

Prompt 1 — LandingPage.tsx rediseño completo
Context: Completely redesign the existing LandingPage.tsx. The current version goes straight to login with no home experience — no app in the market does this and it's a conversion killer. The new landing must serve two audiences simultaneously: nutritionists and patients. Both feel equally welcomed from the first screen. Use existing component system, design tokens, and coding patterns exactly.

Routing: LandingPage.tsx lives at /. Login moves to /login. No authentication required to view any part of this page.

Sticky navbar:

Left: NutriApp logo + wordmark
Right links: "Características" (→ #caracteristicas) · "Planes" (→ #planes) · "Students" (→ #students) · "Buscar nutriólogo" (→ /buscar-nutriologo)
Right buttons: "Iniciar sesión" (outline → /login) · "Comenzar gratis" (primary → /registro)
Mobile: hamburger collapses links. Both buttons stay visible stacked below the hamburger.
On scroll past hero: navbar background becomes solid var(--color-background-primary) with border-bottom: 0.5px solid var(--color-border-tertiary)
Section 1 — Hero con carrusel automático

Full-width hero. Contains an auto-rotating carousel that alternates every 4 seconds between two slides. No manual controls visible — automatic only. Smooth fade or slide transition between states.

Slide A — Vista nutriólogo:

Large badge above headline: "Para nutriólogos" (teal)
Headline (32px, font-weight 500): "Gestiona tu consulta con seguridad y cumplimiento legal"
Subheadline (16px, muted): "Expedientes, citas y planes de dieta — con cumplimiento LFPDPPP automático desde el primer paciente."
CTA primary: "Ver planes y registrarme" → #planes
CTA secondary (outline): "Iniciar sesión" → /login
Right side visual: phone mockup frame showing the nutritionist Dashboard.tsx screen
Slide B — Vista paciente:

Large badge above headline: "Para pacientes" (blue)
Headline (32px, font-weight 500): "Encuentra tu nutriólogo y lleva tu seguimiento en un solo lugar"
Subheadline (16px, muted): "Busca nutriólogos cerca de ti, agenda tu cita y accede a tu plan de alimentación desde tu celular."
CTA primary: "Buscar nutriólogo" → /buscar-nutriologo
CTA secondary (outline): "Registrarme como paciente" → /registro-paciente
Right side visual: phone mockup frame showing the patient Dashboard.tsx screen
Carousel indicator dots at bottom of hero — 2 dots, filled = active slide. Tapping a dot jumps to that slide.

Trust badges row below carousel (visible always, not part of the carousel): 4 inline pills: "Cifrado AES-256" · "Cumple LFPDPPP 2025" · "MFA incluida" · "Privacy by Design"

Section 2 — ¿Eres nutriólogo o paciente? (id="audiencias")

Two large cards side by side on desktop, stacked on mobile. Equal visual weight. This section answers the question the carousel raised.

Card A — Nutriólogo:

Badge: "Soy nutriólogo" (teal)
Icon: clipboard or stethoscope (24px)
Title: "Encuentra pacientes y gestiona su seguimiento"
Bullet list (3 items, checkmark icons):
Expediente clínico digital con cumplimiento LFPDPPP automático
Agenda de citas, plantillas de dieta y módulo de finanzas
Comunidad de nutriólogos y branding personalizado
CTA: "Ver planes →" → #planes
Card B — Paciente:

Badge: "Soy paciente" (blue)
Icon: person or heart (24px)
Title: "¿Buscas nutriólogo? Encuentra uno cerca de ti"
Bullet list (3 items, checkmark icons):
Busca nutriólogos por código postal y agenda tu primera cita
Accede a tu plan de dieta y registra tu progreso
Comunicación segura con tu nutriólogo en un solo lugar
CTA: "Buscar nutriólogo →" → /buscar-nutriologo
Section 3 — Funcionalidades (id="caracteristicas")

Tab bar with two tabs at top: "Para nutriólogos" | "Para pacientes" — switching tab changes the feature grid below without page reload.

Tab Nutriólogos — 2-column feature grid: Icon + title + 1-line description:

Expediente clínico digital · Agenda y disponibilidad · Planes de dieta y plantillas · Seguimiento de progreso · Módulo de finanzas · Comunidad entre nutriólogos · Notificaciones SMS y WhatsApp · Reportes PDF firmados
Tab Pacientes — 2-column feature grid:

Búsqueda de nutriólogos por CP · Perfil público del nutriólogo · Agenda de citas online · Acceso a mi plan de dieta · Registro de progreso personal · Evaluación de mi nutriólogo · Notificaciones de citas · Comunicación segura
Section 4 — Students Program (id="students")

Background: var(--color-background-secondary) Badge: "NutriApp Students" (purple) Title: "Empieza bien desde la universidad" Description: "Acceso gratis 1 año con correo institucional (.edu, .edu.mx, .ipn.mx y similares). Agenda, plantillas ilimitadas, comunidad y notificaciones incluidas."

Two-column layout:

Left card "¿Qué incluye?": 15 pacientes · 60 consultas/mes · 20 SMS + 20 WhatsApp/mes · 1 GB storage · Agenda · Plantillas ilimitadas · Comunidad
Right card "Condición importante" (amber Alert): "Recibirás un aviso por email 24 horas antes del vencimiento. Si no migras a un plan de pago, tu cuenta y todos los datos serán eliminados automáticamente conforme a NOM-004."
CTA centered: "Activar plan Students" (purple) → /registro?plan=students

Section 5 — Planes (id="planes")

Title: "Planes para cada etapa de tu carrera" Reuse PricingPage.tsx component — import and render, do not duplicate code.

Section 6 — Sobre NutriApp (id="sobre")

Short paragraph about origin and mission. Compliance callout (info Alert): "NutriApp es la única plataforma de nutrición en México diseñada con Privacy by Design desde su arquitectura, conforme a la LFPDPPP 2025 y la NOM-004-SSA3-2012."

Footer:

Left: logo + "© 2026 NutriApp. Todos los derechos reservados."
Center: Aviso de Privacidad · Términos de Uso · Students Program · Buscar nutriólogo · Contacto
Right: social placeholder icons
Design constraints:

Carousel auto-rotates every 4 seconds — implemented with useEffect + useState interval, no external carousel library
Carousel transition: CSS opacity fade or translateX slide — whichever is cleaner with existing setup
Section 3 tab switch: useState controls which feature grid renders — use existing Tabs component from components/ui/tabs.tsx
All sections use py-16 equivalent vertical padding
Hero headline ~32px · section titles ~22px · body 16px — existing font tokens only
All colors via CSS variables — no hardcoded hex
Smooth scroll to anchors on nav link click
All strings in Spanish · mobile-first · no new dependencies · only components in package.json
Prompt 2 — PostRegisterFindNutritionist.tsx — pantalla post-registro de paciente
Context: Add a dedicated screen that appears immediately after a patient completes registration. This is not the Dashboard — it's an onboarding step that helps the newly registered patient find and connect with a nutritionist in their area. It should feel like a natural continuation of the registration flow, not a separate app section.

Route: /registro-paciente/encuentra-nutriologo Triggered automatically after successful patient registration before redirecting to patient Dashboard. Patient can skip and go to Dashboard.

Header:

NutriApp logo centered
Progress context (muted, small): "Último paso — Conecta con tu nutriólogo"
Skip link top right: "Omitir por ahora →" → patient Dashboard
Welcome message:

Title: "¡Bienvenido/a a NutriApp, [nombre del paciente]!"
Subtitle: "Encontramos nutriólogos cerca de tu zona (CP [código postal ingresado en el registro]). Elige uno para comenzar tu seguimiento."
Mock map (same pattern as FindNutritionist.tsx):

CSS-only styled div, no external library
Shows mock pins pre-loaded based on the CP entered during registration — no need to search again
Map height: 200px mobile / 280px desktop
Disclaimer: "Mapa ilustrativo. Ubicaciones aproximadas."
Nutritionist cards list (below map, pre-loaded — no search needed): 3 mock cards. Each card:

Avatar (photo placeholder or initials circle)
Name + credential badge ("Lic. Nutrición")
Specialty tags (1–2 pills)
Star rating + review count
Distance chip: "~X km de tu zona"
Availability preview (mock): "Próxima cita disponible: [day], [time]" — shown as a small green chip
Two action buttons:
"Agendar cita" (primary) → opens ScheduleAppointment.tsx with this nutritionist pre-selected
"Ver perfil" (outline) → NutritionistPublicProfile.tsx
Appointment scheduling inline (if "Agendar cita" is tapped): Instead of navigating away, expand the card inline to show a mini scheduling flow:

Step A — Date picker:

Horizontal scrollable row of the next 7 days as pill buttons (Mon 21, Tue 22, etc.)
Tapping a day loads available time slots below
Step B — Time slots:

Grid of available time slot pills (e.g. 9:00 · 10:30 · 12:00 · 16:00)
Unavailable slots shown as muted and non-tappable
Tapping a slot selects it (filled style)
Step C — Confirm button:

"Confirmar cita" (primary, full width within expanded card)
On confirm: success state replaces the card content — checkmark icon + "¡Cita agendada! [Day] a las [time] con [nutritionist name]" + "Recibirás una confirmación por SMS/WhatsApp."
Card collapses back after 2 seconds, button changes to "Ver mis citas" → patient Dashboard appointments tab
Bottom CTA (below all cards):

"¿No encuentras lo que buscas?" + link "Explorar más nutriólogos →" → /buscar-nutriologo
Primary button full width: "Ir a mi dashboard" → patient Dashboard
Data model (mock — real backend PostgreSQL):

PostRegisterContext: {
  patient_id,
  postal_code,           // from registration
  suggested_nutritionists: NutritionistPublicProfile[],
  appointment_booked: boolean,
  booked_nutritionist_id?,
  booked_slot?
}
Mock with local state. Pre-populate 3 mock nutritionists on component mount. Appointment booking updates local state only.

Design constraints:

Inline appointment expansion uses useState to toggle expanded card — no navigation, no modal
Date picker is a horizontal scrollable div with day pills — no external date library
Time slots are simple button grid — existing Button component, outline variant for available, disabled for unavailable
Skip link always visible — patient is never forced to book
Map uses same CSS-only pattern as FindNutritionist.tsx
Transition from registration success screen to this screen: auto-redirect after 2 seconds or "Continuar" button
All strings in Spanish · mobile-first · no new dependencies · only components in package.json
Pega el Prompt 1 primero para que actualice el landing, luego el Prompt 2 para la pantalla post-registro. Cuando genere me mandas el link y los reviso juntos.


