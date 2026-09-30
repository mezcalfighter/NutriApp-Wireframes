# NutriApp - Esquema de Base de Datos

> **⚠ DOCUMENTO LEGADO — NO USAR COMO REFERENCIA**
> Este esquema fue reemplazado por `/workspaces/default/code/modelo.md` (v2, septiembre 2026).
> Las definiciones aquí pueden contradecir el modelo vigente. Consulta `modelo.md` para diseño nuevo.

## Arquitectura

NutriApp utiliza una arquitectura de tres capas:
- **Frontend**: React + TypeScript
- **Server**: Supabase Edge Functions con Hono
- **Database**: Sistema de almacenamiento clave-valor (KV Store) de Supabase

## Estructura de Datos

### 1. Nutriólogos (Nutritionists)

**Key**: `nutritionist:{nutritionistId}`

**Estructura**:
```json
{
  "id": "nutritionist_123",
  "email": "nutriologo@example.com",
  "nutritionistName": "María González Hernández",
  "academicDegree": "Doctora",
  "gender": "female",
  "practiceName": "Nutrición Integral",
  "phone": "+52 123 456 7890",
  "email": "contacto@nutricion.com",
  "address": "Ciudad de México, CDMX",
  "branding": {
    "logo": "data:image/png;base64,...",
    "watermark": "data:image/png;base64,...",
    "pdfColor": "#D1FAE5",
    "pdfLabels": {
      "breakfast": "Desayuno",
      "morningSnack": "Colación Mañana",
      "lunch": "Comida",
      "afternoonSnack": "Colación Tarde",
      "dinner": "Cena",
      "eveningSnack": "Colación Noche",
      "notes": "Notas",
      "dietPlan": "Plan de Dieta",
      "nutritionalSummary": "Resumen Nutricional",
      "calories": "Calorías",
      "protein": "Proteínas",
      "carbs": "Carbohidratos",
      "fats": "Grasas",
      "patient": "Paciente",
      "nutritionist": "Nutricionista",
      "startDate": "Fecha de Inicio",
      "endDate": "Fecha de Fin",
      "mealPlan": "Plan de Comidas"
    }
  },
  "createdAt": "2025-01-24T10:00:00.000Z",
  "updatedAt": "2025-01-24T10:00:00.000Z"
}
```

### 2. Pacientes (Patients)

**Key**: `patient:{patientId}`

**Estructura**:
```json
{
  "id": "patient_456",
  "nutritionistId": "nutritionist_123",
  "fullName": "Juan Pérez López",
  "email": "juan@example.com",
  "phone": "+52 987 654 3210",
  "bloodType": "O+",
  "allergies": ["Lactosa", "Nueces"],
  "age": 35,
  "height": 175,
  "weight": 80,
  "diseases": ["Diabetes tipo 2"],
  "gender": "male",
  "createdAt": "2025-01-24T10:30:00.000Z",
  "updatedAt": "2025-01-24T10:30:00.000Z"
}
```

### 3. Lista de Pacientes por Nutriólogo

**Key**: `nutritionist:{nutritionistId}:patients`

**Estructura**:
```json
[
  "patient_456",
  "patient_789",
  "patient_101"
]
```

## Relaciones

### Nutriólogo → Pacientes (One-to-Many)

- Un nutriólogo puede tener múltiples pacientes
- La relación se mantiene mediante:
  1. El campo `nutritionistId` en cada registro de paciente
  2. La lista de IDs de pacientes en `nutritionist:{id}:patients`

### Privacidad de Datos

- **Aislamiento entre nutriólogos**: Cada nutriólogo solo puede ver sus propios pacientes
- **Paciente vinculado a un solo nutriólogo**: Un paciente pertenece únicamente al nutriólogo que lo creó
- **El `nutritionistId` no se puede cambiar** una vez que el paciente es creado

## API Endpoints

### Nutriólogos

#### GET /make-server-7bac5156/nutritionist/:id
Obtiene la información completa del nutriólogo incluyendo configuración de branding.

**Respuesta**:
```json
{
  "id": "nutritionist_123",
  "nutritionistName": "María González",
  "branding": { ... }
}
```

#### PUT /make-server-7bac5156/nutritionist/:id
Actualiza la información del nutriólogo (perfil y/o branding).

**Body**:
```json
{
  "academicDegree": "Doctora",
  "nutritionistName": "María González Hernández",
  "branding": {
    "pdfColor": "#DBEAFE"
  }
}
```

#### GET /make-server-7bac5156/nutritionist/:id/patients
Obtiene la lista de todos los pacientes de un nutriólogo.

**Respuesta**:
```json
[
  {
    "id": "patient_456",
    "fullName": "Juan Pérez",
    "nutritionistId": "nutritionist_123",
    ...
  }
]
```

### Pacientes

#### POST /make-server-7bac5156/patients
Crea un nuevo paciente y lo asocia a un nutriólogo.

**Body**:
```json
{
  "nutritionistId": "nutritionist_123",
  "fullName": "Juan Pérez López",
  "email": "juan@example.com",
  "bloodType": "O+",
  ...
}
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "id": "patient_456",
    "nutritionistId": "nutritionist_123",
    ...
  }
}
```

#### GET /make-server-7bac5156/patients/:id
Obtiene la información de un paciente específico.

#### PUT /make-server-7bac5156/patients/:id
Actualiza la información de un paciente (excepto el `nutritionistId`).

#### DELETE /make-server-7bac5156/patients/:id
Elimina un paciente y lo remueve de la lista del nutriólogo.

## Seguridad

### Consideraciones de Autenticación

En un entorno de producción, se requeriría:

1. **Supabase Auth** con roles de usuario (nutritionist, patient)
2. **Row Level Security (RLS)** en las tablas
3. **JWT tokens** para verificar la identidad del usuario
4. **Validación de permisos** en cada endpoint:
   - Verificar que el nutriólogo solo acceda a sus propios pacientes
   - Verificar que el paciente solo vea su propia información
5. **MFA obligatorio** para nutriólogos (Google Authenticator)
6. **Limite de intentos de login** (5 intentos con bloqueo de 30 minutos)

### Ejemplo de Middleware de Autenticación (Producción)

```typescript
// Verificar que el usuario autenticado es el propietario del recurso
const verifyNutritionistOwnership = async (c, nutritionistId) => {
  const token = c.req.header('Authorization')?.split(' ')[1];
  const { data: { user } } = await supabase.auth.getUser(token);
  
  if (user.id !== nutritionistId) {
    return c.json({ error: 'Unauthorized' }, 403);
  }
};
```

## Migraciones Futuras

Para escalar la aplicación, considera:

1. **PostgreSQL con tablas relacionales** en lugar del KV Store
2. **Índices** en campos frecuentemente consultados
3. **Supabase Storage** para archivos grandes (imágenes de logo/marca de agua)
4. **Backup automático** de datos sensibles
5. **Encriptación** de información médica sensible (alergias, enfermedades)
6. **Cumplimiento con regulaciones** de salud mexicanas (similar a HIPAA en EE.UU.)

## Notas Importantes

⚠️ **Este es un prototipo**: La implementación actual usa un sistema simplificado de autenticación. Para producción, es crítico implementar autenticación robusta, autorización basada en roles, y cumplir con las regulaciones de privacidad de datos médicos.

⚠️ **Información Personal Identificable (PII)**: Los datos de pacientes contienen información sensible. En producción, se debe garantizar:
- Encriptación en tránsito (HTTPS)
- Encriptación en reposo
- Auditoría de accesos
- Consentimiento informado del paciente
- Derecho al olvido (RGPD/GDPR si aplica)
