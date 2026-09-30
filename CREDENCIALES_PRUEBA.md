# Credenciales de Prueba - NutriApp

## Cuentas Students (Práctica con datos ficticios)

### Usuario: Estudiante de Nutrición
- **Email:** `estudiante@unam.edu.mx`
- **Password:** `cualquier-cosa` (el sistema de demo acepta cualquier password)
- **Plan:** Students
- **Características:**
  - 10 pacientes ficticios (deben generarse con botón)
  - Features limitados (sin Agenda, Finanzas, Feed Social, Branding)
  - Datos se resetean al cerrar sesión (en demo)

### Usuario: Estudiante IPN
- **Email:** `maria.lopez@ipn.mx`
- **Password:** `cualquier-cosa`
- **Plan:** Students

---

## Cuentas de Nutriólogo Regular

### Usuario: Nutriólogo Basic
- **Email:** `nutritionist@nutriapp.com`
- **Password:** `cualquier-cosa`
- **Plan:** Basic
- **Características:**
  - Pacientes reales (mock data de 5 pacientes)
  - Todos los features disponibles

### Usuario: Dr. García
- **Email:** `dr.garcia@nutritionist.com`
- **Password:** `cualquier-cosa`
- **Plan:** Basic

---

## Cuenta de Paciente

### Usuario: Paciente Regular
- **Email:** `patient@email.com`
- **Password:** `cualquier-cosa`
- **Características:**
  - Cuenta 100% gratuita
  - Puede buscar nutriólogos
  - Agendar citas

---

## Cuenta de Administrador

### Usuario: Admin
- **Email:** `admin@nutriapp.com`
- **Password:** `cualquier-cosa`
- **Características:**
  - Acceso a solicitudes ARCO
  - Gestión de reportes
  - NO puede ver datos médicos sensibles
  - Solo puede enviar reportes por email

---

## Cómo Identificar Cada Tipo de Cuenta

El sistema identifica automáticamente el tipo de cuenta basándose en el email:

1. **Students:** Emails con `.edu`, `.edu.mx`, `.ipn.mx` o que contengan "student"
2. **Admin:** Emails que contengan "admin"
3. **Nutritionist:** Emails que contengan "nutritionist" o cualquier email .edu (Students)
4. **Patient:** Cualquier otro email

---

## Flujo de Prueba para Students

1. Ir a `/login`
2. Ingresar: `estudiante@unam.edu.mx`
3. Password: cualquier cosa
4. Click en "Iniciar Sesión"
5. Navegar a "Pacientes" (menú inferior)
6. Ver botón morado "Generar Pacientes Ficticios"
7. Click para generar 10 pacientes con datos realistas
8. El botón desaparece (solo se puede usar una vez)
9. Notar que "Agenda" está bloqueada con candado 🔒
10. Ir a "Más" y ver que Finanzas, Branding, Feed Social no aparecen
11. Solo están disponibles: Configuración, Planes, Perfil

---

## Notas Importantes

- **Demo Mode:** Al cerrar sesión y volver a entrar, el flag `demoDataGenerated` se resetea, permitiendo volver a generar pacientes
- **Producción:** En producción real, solo se podría generar UNA VEZ
- **Pacientes Ficticios:** Los datos son completamente generados (nombres, edades 18-85, pesos realistas, alergias, etc.)
- **Datos Consistentes:** Usar el mismo email siempre genera los mismos 5 pacientes (seed basado en email)

---

## URLs Directas Útiles

- Landing: `/`
- Funcionalidades: `/funcionalidades`
- Página Students: `/students`
- Precios: `/pricing`
- Login: `/login`
- Dashboard Nutritionist: `/nutritionist/dashboard`
- Lista Pacientes: `/nutritionist/patients`
- Admin ARCO: `/admin/arco-requests`
