# Cambios Importantes / Major Changes

## 🌐 Sistema de Idiomas / Language System

- **Idioma por defecto**: Español (para mercado mexicano)
- **Idiomas disponibles**: Español e Inglés
- **Botón de cambio**: Ícono de globo en el header y pantalla de login
- Todo el texto de la aplicación está traducido usando el sistema `t(key)`

## 🌙 Modo Oscuro / Dark Mode

- **Modo por defecto**: Claro
- **Temas disponibles**: Claro y Oscuro
- **Botón de cambio**: Ícono de luna/sol en el header y pantalla de login
- Todos los componentes soportan dark mode con clases `dark:`

## 🍽️ Nuevo Sistema de Categorías de Alimentos / New Food Category System

### Antes (Before):
- Los nutricionistas tenían que agregar productos específicos con emojis
- Ejemplo: "🥣 Avena", "🍌 Plátano"

### Ahora (Now):
- Los nutricionistas solo seleccionan **categorías de alimentos** con cantidades
- Los emojis están en las categorías, no en productos individuales
- El sistema es más flexible y rápido

### Categorías Disponibles / Available Categories:

| Emoji | Categoría (ES) | Category (EN) |
|-------|---------------|---------------|
| 🥬 | Verduras | Vegetables |
| 🍎 | Frutas | Fruits |
| 🍗 | Proteínas | Proteins |
| 🌾 | Cereales | Grains |
| 🥛 | Lácteos | Dairy |
| 🫘 | Leguminosas | Legumes |
| 🫒 | Grasas | Fats |
| ☕ | Bebidas | Beverages |

### Unidades Disponibles / Available Units:

- **Porciones** / Portions
- **Gramos** / Grams
- **Piezas** / Pieces
- **Tazas** / Cups
- **Cucharadas** / Tablespoons

### Ejemplo de Uso / Usage Example:

```
Desayuno / Breakfast:
- 🌾 Cereales: 2 porciones
- 🍎 Frutas: 1 pieza
- 🥛 Lácteos: 1 taza
```

## 📱 Componentes Actualizados / Updated Components

### Completamente Traducidos / Fully Translated:
- ✅ Login (con toggles de idioma y tema)
- ✅ Header (con botones de idioma y tema en todas las pantallas)
- ✅ MobileNav (navegación traducida)
- ✅ CreateTemplate (nuevo sistema de categorías)

### Pendientes de Traducción / Pending Translation:
Los siguientes componentes aún tienen texto hardcodeado que debe ser reemplazado con `t()`:
- Dashboards (Nutritionist y Patient)
- Patient List
- Add/Edit Patient
- Patient Detail
- Template Library
- Assign Diet
- View Patient Diet
- Appointments
- Set Availability
- Appointment Detail
- Progress Tracking
- Current Diet
- Schedule Appointment
- My Appointments
- Appointment Confirmation
- Profiles

## 🔧 Cómo Usar / How to Use

### Para Desarrolladores / For Developers:

1. **Importar el contexto**:
```tsx
import { useApp } from '../../contexts/AppContext';
```

2. **Usar en el componente**:
```tsx
const { t, language, theme, setLanguage, setTheme } = useApp();
```

3. **Traducir texto**:
```tsx
// Simple
<h1>{t('auth.welcome')}</h1>

// Con reemplazos
<p>{t('dashboard.appointmentsToday', { count: 5 })}</p>
```

4. **Aplicar dark mode**:
```tsx
<div className="bg-white dark:bg-slate-900">
  <p className="text-slate-900 dark:text-white">Texto</p>
</div>
```

### Para Usuarios / For Users:

1. **Cambiar idioma**: Click en el ícono de globo 🌐
2. **Cambiar tema**: Click en el ícono de luna 🌙 o sol ☀️
3. **Los cambios se guardan** en localStorage

## 🎨 Paleta de Colores / Color Palette

### Modo Claro / Light Mode:
- Fondo: Slate 50
- Texto: Slate 900
- Primario: Emerald 500

### Modo Oscuro / Dark Mode:
- Fondo: Slate 950/900
- Texto: White/Slate 300
- Primario: Emerald 500 (sin cambios)

## 📝 Notas para Desarrollo Futuro / Future Development Notes

1. **Agregar más traducciones**: Editar `/contexts/AppContext.tsx` y agregar claves en ambos idiomas
2. **Extender categorías de alimentos**: Modificar `FOOD_CATEGORIES` en CreateTemplate
3. **Agregar más unidades**: Modificar `UNITS` en CreateTemplate
4. **Persistencia**: El idioma y tema ya se guardan en localStorage automáticamente

## ✨ Mejoras Implementadas / Implemented Improvements

- ✅ Sistema completo de internacionalización (i18n)
- ✅ Dark mode con persistencia
- ✅ Categorías de alimentos con emojis (sin gestión manual)
- ✅ Flexibilidad para unidades y cantidades
- ✅ Interfaz optimizada para mercado mexicano
- ✅ Toggles accesibles en todas las pantallas principales
