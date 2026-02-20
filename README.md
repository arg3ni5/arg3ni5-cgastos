
# Sistema control de gastos con REACT - cerdyn v.1.0

Cerdyn es un sistema para controlar los gastos personales de forma fácil y rápida.

## 🚀 Características

- 💰 Control de gastos e ingresos personales
- 📊 Visualización de datos con gráficos
- 🏦 Gestión de múltiples cuentas
- 🏷️ Categorización de movimientos
- 📈 Informes y reportes detallados
- 🔐 Autenticación segura con Google OAuth
- 🌓 Modo claro/oscuro
- 💱 Soporte multi-moneda

## Authors

- [@ing-franklin-bustamante-CODIGO369](https://www.youtube.com/@Codigo369)


## Demo

https://cerdyn.com/


## Stack de tecnologias utilizadas

**Frontend:** React.js, Zustand, Styled Components, TanStack Query

**Backend:** PostgreSQL, Supabase

**Validación:** Zod

**Seguridad:** Encrypted LocalStorage, Session Management


## 🔧 Configuración del proyecto

### Requisitos previos

- Node.js 16 o superior
- npm o yarn
- Cuenta de Supabase

### Instalación

1. Clona el repositorio
```bash
git clone https://github.com/arg3ni5/arg3ni5-cgastos.git
cd arg3ni5-cgastos
```

2. Instala las dependencias
```bash
npm install
```

3. Configura las variables de entorno

Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

Edita el archivo `.env` y configura las siguientes variables:

```env
# Supabase Configuration
# Obtén estos valores de tu proyecto Supabase: https://app.supabase.com/project/_/settings/api
VITE_APP_SUPABASE_URL=tu_supabase_project_url_aqui
VITE_APP_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui

# Application Environment
# Opciones: development, production, test
VITE_APP_ENV=development

# Session Configuration (opcional)
# Timeout de sesión en milisegundos (por defecto: 24 horas)
VITE_SESSION_TIMEOUT=86400000
```

### Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Configura la autenticación de Google OAuth en la sección de Authentication
3. Ejecuta las migraciones de base de datos (si las hay)
4. Copia la URL del proyecto y la clave anónima a tu archivo `.env`

### Variables de Entorno Requeridas

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `VITE_APP_SUPABASE_URL` | URL de tu proyecto Supabase | Sí |
| `VITE_APP_SUPABASE_ANON_KEY` | Clave anónima de Supabase | Sí |
| `VITE_APP_ENV` | Entorno de la aplicación (development/production/test) | No |
| `VITE_SESSION_TIMEOUT` | Timeout de sesión en milisegundos | No |

### Iniciar proyecto

Para inicializar en modo desarrollo:

```bash
npm run dev
```

Para construir para producción:

```bash
npm run build
```

Para previsualizar la build de producción:

```bash
npm run preview
```

## 🔒 Seguridad

Este proyecto implementa múltiples capas de seguridad:

- **Validación de datos**: Todas las entradas se validan con Zod
- **Cifrado de LocalStorage**: Datos sensibles se almacenan cifrados
- **Expiración de sesión**: Las sesiones expiran automáticamente
- **Logging centralizado**: Todos los errores se registran para debugging
- **Error Boundaries**: Captura errores de React para evitar crashes
- **Typed Environment Variables**: Variables de entorno tipadas y validadas

## 🧪 Testing

La infraestructura de testing está configurada. Para ejecutar tests:

```bash
npm test
```

**Nota**: Actualmente se requiere instalar vitest y @testing-library/react para ejecutar tests.

## 📝 Scripts disponibles

```json
{
  "dev": "Inicia el servidor de desarrollo",
  "build": "Construye para producción",
  "preview": "Previsualiza la build de producción",
  "lint": "Ejecuta el linter",
  "lint:fix": "Ejecuta el linter y corrige errores automáticamente",
  "test": "Ejecuta los tests",
  "test:ui": "Ejecuta los tests con interfaz visual",
  "test:coverage": "Ejecuta los tests con reporte de cobertura"
}
```

## Pantallazos
![Screenshot1](https://i.ibb.co/F3VVTv0/HGERTHDDFGG.png)

![Screenshot2](https://i.ibb.co/cDjwFzH/screencapture-127-0-0-1-5173-movimientos-2023-09-22-00-38-32.png)

![Screenshot3](https://i.ibb.co/tCqq9Kw/32shots-so.png)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Adquiere el curso

Puedes adquirir el curso en:

[codigo369.com](https://codigo369.com/)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia correspondiente.

## 📞 Soporte

Para soporte, visita [codigo369.com](https://codigo369.com/) o contacta al autor.
