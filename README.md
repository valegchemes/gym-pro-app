# GymPro - Aplicación Profesional de Gimnasio 💪

Una aplicación web moderna y completa para el seguimiento de entrenamientos, nutrición y progreso en el gimnasio.

## 🚀 Características Principales

### 📊 Dashboard Completo
- Vista general de estadísticas diarias
- Racha de entrenamientos
- Plan de entrenamiento del día
- Logros recientes
- Acciones rápidas

### 🏋️ Módulo de Entrenamientos
- **Múltiples planes predefinidos**: Pecho y Tríceps, Piernas, HIIT, Espalda y Bíceps
- **Sistema de seguimiento en tiempo real**: Marca ejercicios completados
- **Información detallada**: Series, repeticiones, peso, tiempo de descanso
- **Filtros por categoría**: Fuerza, Cardio, Flexibilidad, HIIT
- **Barra de progreso**: Visualiza tu avance en cada sesión
- **Niveles de dificultad**: Principiante, Intermedio, Avanzado

### 🍎 Módulo de Nutrición
- **Registro de comidas**: Desayuno, Almuerzo, Cena, Snacks
- **Seguimiento de macronutrientes**: Calorías, Proteínas, Carbohidratos, Grasas
- **Objetivos nutricionales personalizados**
- **Indicadores visuales de progreso**
- **Hidratación**: Control de vasos de agua consumidos
- **Alimentos comunes**: Acceso rápido a alimentos frecuentes
- **Objetivo semanal**: Seguimiento de cumplimiento

### 📈 Módulo de Progreso
- **Gráficos interactivos**: Peso, grasa corporal, masa muscular
- **Medidas corporales**: Pecho, cintura, brazos, piernas
- **Récords personales (PR)**: Seguimiento de mejores marcas
- **Volumen de entrenamiento**: Análisis semanal
- **Comparativas**: Cambios y tendencias
- **Fotos de progreso**: Sube y compara fotos

### 👤 Perfil de Usuario
- **Información personal completa**
- **Actividad semanal visualizada**
- **Sistema de logros y badges**
- **Estadísticas detalladas**
- **Configuración personalizada**
- **Racha de entrenamiento**

## 🎨 Características de Diseño

### Interfaz Moderna
- ✨ **Animaciones fluidas** con Framer Motion
- 🌓 **Modo oscuro** nativo
- 📱 **Completamente responsive** (móvil, tablet, desktop)
- 🎯 **Navegación inferior** en móvil, superior en desktop
- 🎨 **Gradientes vibrantes** y colores profesionales
- 🔄 **Transiciones suaves** y efectos hover
- 📊 **Gráficos interactivos** con Recharts

### UX Optimizada
- 🚀 **Carga rápida** con Next.js 16
- 💫 **Micro-interacciones** en cada elemento
- 🎯 **Feedback visual** inmediato
- 📍 **Indicadores de estado** claros
- ⚡ **Rendimiento optimizado**

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TypeScript
- **Estilos**: Tailwind CSS 4
- **Animaciones**: Framer Motion
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Fechas**: date-fns

## 📦 Instalación

```bash
# Clonar el repositorio
cd gym-pro-app

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Abrir en el navegador
http://localhost:3000
```

## 🏗️ Estructura del Proyecto

```
gym-pro-app/
├── app/
│   ├── components/
│   │   └── Navbar.tsx          # Navegación principal
│   ├── workouts/
│   │   └── page.tsx            # Módulo de entrenamientos
│   ├── nutrition/
│   │   └── page.tsx            # Módulo de nutrición
│   ├── progress/
│   │   └── page.tsx            # Módulo de progreso
│   ├── profile/
│   │   └── page.tsx            # Perfil de usuario
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Dashboard/Home
│   └── globals.css             # Estilos globales
├── public/                     # Archivos estáticos
├── tailwind.config.js          # Configuración de Tailwind
├── next.config.js              # Configuración de Next.js
└── package.json
```

## 🎯 Funcionalidades Destacadas

### Dashboard Inteligente
- Resumen visual de tu actividad diaria
- Plan de entrenamiento sugerido
- Estadísticas clave al alcance
- Acceso rápido a todas las funciones

### Entrenamientos Personalizados
- Biblioteca de ejercicios completa
- Tracking en tiempo real
- Historial de entrenamientos
- Sistema de progresión

### Control Nutricional Total
- Base de datos de alimentos
- Cálculo automático de macros
- Objetivos ajustables
- Registro rápido y fácil

### Análisis de Progreso Profundo
- Múltiples métricas corporales
- Gráficos de evolución
- Comparativas temporales
- Récords y logros

## 🔐 Características de Seguridad

- Datos encriptados
- Sesiones seguras
- Privacidad de usuario

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge
- ✅ iOS 12+
- ✅ Android 8+
- ✅ Tablets y iPads
- ✅ Pantallas de escritorio

## 🎓 Casos de Uso

1. **Principiantes**: Planes de entrenamiento guiados y seguimiento básico
2. **Intermedios**: Tracking detallado y análisis de progreso
3. **Avanzados**: Personalización completa y métricas avanzadas
4. **Nutrición**: Control total de macros y objetivos
5. **Transformación**: Fotos de progreso y comparativas

## 🚀 Próximas Características

- [ ] Integración con wearables (Apple Watch, Garmin)
- [ ] Social: Compartir logros
- [ ] IA: Recomendaciones personalizadas
- [ ] Planes de entrenamiento generados por IA
- [ ] Recetas saludables
- [ ] Calculadora de 1RM
- [ ] Temporizador de descanso con notificaciones
- [ ] Modo offline
- [ ] Exportar datos a PDF/Excel
- [ ] Integración con apps de salud

## 📄 Licencia

ISC

## 👨‍💻 Autor

Desarrollado con ❤️ para la comunidad fitness

---

**¡Comienza tu transformación hoy! 💪🔥**
