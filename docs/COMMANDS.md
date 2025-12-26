# Comandos Disponibles - Proyecto Pictionary

## 📦 Gestión de Dependencias

```bash
# Instalar todas las dependencias del monorepo
pnpm install

# Instalar una dependencia en el frontend
pnpm --filter frontend add <paquete>

# Instalar una dependencia en el backend
pnpm --filter backend add <paquete>

# Instalar una dependencia de desarrollo en el root
pnpm add -D <paquete> -w

# Actualizar todas las dependencias
pnpm update --recursive

# Limpiar node_modules de todo el proyecto
pnpm clean
```

## 🚀 Desarrollo

```bash
# Correr frontend Y backend simultáneamente
pnpm dev

# Solo frontend (Puerto 5173)
pnpm dev:frontend

# Solo backend (Puerto 3000)
pnpm dev:backend
```

## 🏗️ Build

```bash
# Build de todos los proyectos
pnpm build

# Build solo del frontend
pnpm build:frontend

# Build solo del backend
pnpm build:backend

# Preview del frontend después del build
cd apps/frontend && pnpm preview
```

## 🧪 Testing

```bash
# Correr tests en todos los proyectos
pnpm test

# Tests del backend
pnpm --filter backend test

# Tests con coverage
pnpm --filter backend test:cov

# Tests en watch mode
pnpm --filter backend test:watch

# Tests E2E del backend
pnpm --filter backend test:e2e
```

## 🎨 Linting y Formateo

```bash
# Lint de todos los proyectos
pnpm lint

# Lint solo del frontend
pnpm --filter frontend lint

# Lint solo del backend
pnpm --filter backend lint

# Format del backend con Prettier
pnpm --filter backend format
```

## 🗄️ Base de Datos (PostgreSQL + TypeORM)

```bash
# Generar una nueva migración
pnpm --filter backend typeorm migration:generate src/migrations/NombreMigracion

# Correr migraciones pendientes
pnpm --filter backend typeorm migration:run

# Revertir última migración
pnpm --filter backend typeorm migration:revert

# Ver el estado de las migraciones
pnpm --filter backend typeorm migration:show
```

## 🐳 Docker (PostgreSQL)

```bash
# Iniciar contenedor de PostgreSQL
docker run --name pictionary-postgres \
  -e POSTGRES_USER=pictionary \
  -e POSTGRES_PASSWORD=pictionary123 \
  -e POSTGRES_DB=pictionary_db \
  -p 5432:5432 \
  -d postgres:15

# Detener contenedor
docker stop pictionary-postgres

# Iniciar contenedor existente
docker start pictionary-postgres

# Ver logs del contenedor
docker logs -f pictionary-postgres

# Eliminar contenedor
docker rm pictionary-postgres
```

## 🔍 Debugging

```bash
# Backend en modo debug (puerto 9229)
pnpm --filter backend start:debug

# Conectar con Chrome DevTools o VS Code debugger
# chrome://inspect o configurar launch.json
```

## 📊 Análisis de Tipos

```bash
# Type-check del package compartido
pnpm --filter @proyecto-pic/shared type-check

# Type-check del frontend
cd apps/frontend && pnpm tsc --noEmit

# Type-check del backend
cd apps/backend && pnpm tsc --noEmit
```

## 🔧 Utilidades

```bash
# Ver árbol de dependencias
pnpm list

# Ver dependencias outdated
pnpm outdated

# Ver información del workspace
pnpm -r exec pwd

# Ejecutar comando en todos los workspaces
pnpm -r exec <comando>
```

## 🌐 Variables de Entorno

### Frontend (.env)
```bash
cp apps/frontend/.env.example apps/frontend/.env
# Editar apps/frontend/.env con tus valores
```

### Backend (.env)
```bash
cp apps/backend/.env.example apps/backend/.env
# Editar apps/backend/.env con tus valores
```

## 📝 Git

```bash
# Crear commit (siguiendo convenciones)
git add .
git commit -m "feat: descripción del cambio

🤖 Generated with Claude Code

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push al repositorio
git push origin main

# Ver estado
git status
```

## 🚢 Producción

```bash
# Build de producción
pnpm build

# Correr backend en producción
cd apps/backend && pnpm start:prod

# Correr frontend preview
cd apps/frontend && pnpm preview
```

## 🆘 Troubleshooting

```bash
# Si hay problemas con pnpm, reinstalar todo
pnpm clean
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Si TypeScript da errores de tipos
pnpm --filter @proyecto-pic/shared type-check

# Si el backend no compila
cd apps/backend && rm -rf dist && pnpm build

# Si el frontend no compila
cd apps/frontend && rm -rf dist && pnpm build
```