# 🚀 Guía de Configuración y Ejecución del Proyecto

Esta guía te ayudará a configurar y ejecutar el proyecto Pictionary Online en tu entorno local.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **pnpm** (gestor de paquetes)
- **PostgreSQL** (versión 14 o superior)
- **Git**

## 🔧 Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd proyecto-pic
```

### 2. Instalar Dependencias

```bash
pnpm install
```

Este comando instalará todas las dependencias del monorepo (frontend, backend y shared).

### 3. Configurar Variables de Entorno

#### Backend

Crea el archivo `.env` en `apps/backend/`:

```bash
# Base de datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_password
DATABASE_NAME=pictionary_db

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRES_IN=15m

# Servidor
PORT=3000
NODE_ENV=development
```

#### Frontend

Crea el archivo `.env` en `apps/frontend/`:

```bash
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

### 4. Configurar Base de Datos

#### Opción A: PostgreSQL Local

1. Inicia PostgreSQL
2. Crea la base de datos:

```sql
CREATE DATABASE pictionary_db;
```

#### Opción B: Docker (Recomendado)

```bash
docker run --name pictionary-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=pictionary_db \
  -p 5432:5432 \
  -d postgres:14
```

### 5. Ejecutar Migraciones

```bash
cd apps/backend
pnpm typeorm migration:run
```

## 🏃 Ejecutar el Proyecto

### Opción 1: Ejecutar Todo el Proyecto (Recomendado)

Desde la raíz del proyecto:

```bash
# Terminal 1 - Backend
pnpm --filter backend start:dev

# Terminal 2 - Frontend
pnpm --filter frontend dev
```

### Opción 2: Scripts Individuales

#### Backend

```bash
cd apps/backend
pnpm start:dev
```

El backend estará disponible en: `http://localhost:3000`

#### Frontend

```bash
cd apps/frontend
pnpm dev
```

El frontend estará disponible en: `http://localhost:5173`

## 🌐 Acceder a la Aplicación

Una vez que ambos servidores estén corriendo:

1. Abre tu navegador
2. Ve a `http://localhost:5173`
3. Deberías ver la página de inicio de Pictionary Online

### Rutas Disponibles

- `/` - Página de inicio
- `/login` - Iniciar sesión
- `/register` - Registrarse
- `/dashboard` - Dashboard (requiere autenticación)

## 🧪 Probar la API del Backend

### Registro de Usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Obtener Perfil (requiere token)

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <tu_token_jwt_aqui>"
```

## 🛠️ Comandos Útiles

### Monorepo

```bash
# Instalar dependencias
pnpm install

# Limpiar node_modules
pnpm clean

# Build de todo el proyecto
pnpm build

# Type-check
pnpm type-check
```

### Backend

```bash
# Desarrollo
pnpm --filter backend start:dev

# Build
pnpm --filter backend build

# Generar migración
pnpm --filter backend migration:generate <NombreMigracion>

# Ejecutar migraciones
pnpm --filter backend migration:run

# Revertir migración
pnpm --filter backend migration:revert
```

### Frontend

```bash
# Desarrollo
pnpm --filter frontend dev

# Build
pnpm --filter frontend build

# Preview del build
pnpm --filter frontend preview

# Lint
pnpm --filter frontend lint
```

## 🐛 Solución de Problemas

### El backend no se conecta a la base de datos

- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en el archivo `.env`
- Asegúrate de que la base de datos `pictionary_db` existe

### Error de migraciones

```bash
# Si las migraciones fallan, puedes revertir y volver a ejecutar
cd apps/backend
pnpm typeorm migration:revert
pnpm typeorm migration:run
```

### Puerto 3000 o 5173 ya en uso

```bash
# Windows - Encontrar proceso usando el puerto
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Matar el proceso (reemplaza PID con el ID del proceso)
taskkill /PID <PID> /F
```

### Problemas con pnpm

```bash
# Limpiar cache de pnpm
pnpm store prune

# Reinstalar dependencias
rm -rf node_modules
pnpm install
```

## 📝 Notas Adicionales

- El servidor de desarrollo del frontend usa **Hot Module Replacement (HMR)**, por lo que los cambios se reflejan automáticamente
- El backend usa **nodemon** para reiniciar automáticamente cuando detecta cambios
- Los tipos compartidos están en el paquete `@proyecto-pic/shared`

## 🎯 Próximos Pasos

Una vez que tengas el proyecto corriendo:

1. Prueba registrar un usuario desde el frontend
2. Inicia sesión con ese usuario
3. Explora el dashboard

Para continuar con el desarrollo, revisa el archivo `docs/ROADMAP.md` para ver las siguientes tareas pendientes.

## 🆘 ¿Necesitas Ayuda?

Si encuentras algún problema que no está cubierto en esta guía, revisa:

- El archivo `README.md` principal
- El archivo `docs/ROADMAP.md` para el plan de desarrollo
- Los issues en GitHub (si aplica)
