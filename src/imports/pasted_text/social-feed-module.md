Context: NutriApp social feed module. Nutritionists can follow other nutritionists and see a combined feed of their own posts plus those of nutritionists they follow. Admin has a full moderation dashboard with a progressive strike system that affects only social publishing — not clinical access.

Navigation (same as before — inside More menus, no bottom nav changes):

nutritionist/More.tsx: add "Comunidad" → SocialFeed.tsx
Patient secondary menu: add "Comunidad" → SocialFeed.tsx (read-only)
Admin navigation: add "Moderación" → AdminModerationDashboard.tsx


Screens to build:
1. SocialFeed.tsx — nutritionist view

Feed shows: own posts + posts from nutritionists the user follows, reverse chronological
Tab bar at top: "Para ti" (combined feed) | "Mis publicaciones" (own only)
Each post card: avatar + full name + credential badge (e.g. "Lic. Nutrición" or "Dr.") + relative timestamp + text + optional image (16:9) + like counter + comment counter → PostDetail.tsx
Three-dot on own posts: "Editar" / "Eliminar". On others: "Reportar contenido"
If account status is 1ST_STRIKE or 2ND_STRIKE: show persistent amber banner at top of feed — "Tu cuenta tiene una advertencia activa. Una nueva infracción puede resultar en la suspensión de tus publicaciones. [Ver detalle]"
If status is SUSPENDED or UNDER_REVIEW: show red banner — "Tu acceso para publicar en la comunidad está suspendido temporalmente. [Ver motivo]" — FAB hidden
FAB "+" → CreatePost.tsx — hidden if status is SUSPENDED, UNDER_REVIEW, or CANCELLED
Dismissable info banner (first load only): "El contenido que publiques es de tu exclusiva responsabilidad como profesionista. NutriApp no verifica ni avala las publicaciones."

Discover / follow other nutritionists:

Small horizontal scroll section at top of "Para ti" tab: "Nutriólogos que quizás conozcas" — avatar + name + "Seguir" button
Tapping a nutritionist name → NutritionistPublicProfile.tsx

2. NutritionistPublicProfile.tsx

Header: avatar + name + credential + bio (if set) + follower count + "Seguir / Siguiendo" toggle
Grid or list of that nutritionist's posts
If nutritionist is SUSPENDED/CANCELLED: show "Este nutriólogo no tiene publicaciones activas." — no reason shown to other nutritionists

3. CreatePost.tsx — nutritionist only

Text area: max 500 chars, live counter
Attach image: one image max, thumbnail preview + remove
Non-dismissable amber warning (Alert component): "El contenido que publiques es de tu exclusiva responsabilidad. NutriApp no verifica ni avala publicaciones. El incumplimiento de los Términos de Uso puede resultar en la suspensión de tu cuenta."
"Publicar" CTA — disabled if empty
Success toast: "Publicación enviada"

4. PostDetail.tsx — both roles

Full post, full image, flat comments
Comment input at bottom — both roles can comment
Three-dot per comment: own → "Eliminar"; others → "Reportar"

5. ReportContent.tsx — modal, both roles

Radio reasons: "Información clínica incorrecta o engañosa" / "Publicidad no autorizada / spam" / "Contenido ofensivo o discriminatorio" / "Otro"
Textarea — required only if "Otro"
CTA: "Enviar reporte" → "Reporte recibido con folio #RPT-XXXX. Lo revisaremos en 48 horas."
Post stays visible after reporting


6. AdminModerationDashboard.tsx — admin only
Two tabs: "Reportes" | "Cuentas"
Tab "Reportes":

List of incoming reports, sorted by newest
Each row: Folio RPT-XXXX | Tipo (post/comment) | Nutriólogo reportado | Razón | Fecha | Estado (Pendiente/Archivado/Accionado) | "Ver detalle"
Filter by: estado, razón, fecha
Tapping "Ver detalle" → ModerationCaseDetail.tsx

Tab "Cuentas":

Searchable list of all nutritionists
Each row: avatar + name + credential + current social status badge (ACTIVE green / 1ST_STRIKE amber / 2ND_STRIKE orange / SUSPENDED red / UNDER_REVIEW purple / REINSTATED teal / CANCELLED gray)
Strike/status summary visible inline — e.g. "2 strikes · Suspendida desde 15 abr"
Tapping a row → AdminNutritionistModerationProfile.tsx

7. ModerationCaseDetail.tsx — admin only

Full report detail: folio, reporter (anonymous label, not name), reported content preview, reason, date, status
Action panel at bottom with three buttons:

"Archivar reporte" (no action on account)
"Asignar advertencia" → opens ModerationActionModal.tsx
"Suspender cuenta" → opens ModerationActionModal.tsx


Timeline at bottom: history of all actions taken on this case

8. AdminNutritionistModerationProfile.tsx — admin only

Header: avatar + name + credential + current social status badge + member since date
Status history timeline — chronological list of all moderation events for this account: folio + action + reason + admin note + date
Current status section with "Cambiar estado" button → ModerationActionModal.tsx
Stats: total posts | total reports received | strikes count | last activity date
Notes section: list of all admin notes on this account, each with date + admin ID + text — add new note inline

9. ModerationActionModal.tsx — admin only, reusable modal

Title: "Registrar acción de moderación"
Dropdown: "Nuevo estado" — options: 1ST_STRIKE / 2ND_STRIKE / SUSPENDED / UNDER_REVIEW / REINSTATED / CANCELLED
Dropdown: "Razón" — catalog: "Información clínica incorrecta o engañosa" / "Publicidad no autorizada" / "Contenido ofensivo" / "Reporte múltiple de usuarios" / "Violación de términos — otro"
Textarea: "Nota interna (visible solo para administradores)" — required for SUSPENDED, CANCELLED, and "Violación — otro"; optional otherwise
Auto-generated folio preview: "Este evento se registrará con folio #MOD-2026-XXXX"
CTA: "Confirmar y registrar" → success toast "Acción registrada con folio #MOD-2026-XXXX"
On confirm: account status updates immediately in the UI; if SUSPENDED or CANCELLED — nutritionist's FAB disappears and banner appears on their next session


Data model (mock — real backend PostgreSQL relational):
SocialAccount: { nutritionist_id, social_status, strike_count, suspended_at?, suspension_reason?, last_moderation_folio? }

Post: { id, nutritionist_id, text, image_url?, likes_count, comments_count, is_hidden, created_at }

Comment: { id, post_id, author_id, author_role, text, created_at }

Report: { id, folio, content_type, content_id, reason, description?, reported_by, status, created_at }

ModerationEvent: { id, folio, nutritionist_id, action, previous_status, new_status, reason_catalog, admin_note?, admin_id, created_at }

AdminNote: { id, nutritionist_id, text, admin_id, created_at }
Mock with local state — same pattern as existing screens. No Supabase calls.

Design constraints:

No changes to MobileNav.tsx
All cards and tables follow existing styles from PatientList.tsx and ManageNutritionists.tsx
Status badges use the existing Badge component with semantic colors
All modals use existing AlertDialog or Dialog components
All strings in Spanish
No new dependencies
Mobile-first