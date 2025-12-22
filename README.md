# Plan de Implementación: Pictionary Online

## Resumen del Proyecto
Aplicación web de Pictionary donde los jugadores dibujan en papel físico y usan sus dispositivos móviles solo para gestionar palabras, tiempo y puntuación.

## Stack Tecnológico Seleccionado

### Arquitectura
- **Monorepo** con pnpm workspaces
- **Tipos compartidos** entre frontend y backend

### Frontend
- **React + TypeScript + Vite**
- **Socket.io Client** para WebSockets
- **React Router** para navegación
- **Context API** para estado global

### Backend
- **NestJS** (Node.js framework)
- **TypeORM** (o Prisma) para ORM
- **Socket.io** para WebSockets
- **JWT** para autenticación
- **bcrypt** para hash de contraseñas

### Base de Datos
- **PostgreSQL**

### Gestor de Paquetes
- **pnpm** (velocidad, eficiencia de disco, workspaces superiores)

---

## Pros y Contras del Stack

### ✅ PROS

#### React + TypeScript
**Ventajas:**
- **Type Safety**: TypeScript previene bugs en tiempo de compilación
- **Ecosistema maduro**: Amplia comunidad, muchas librerías, fácil encontrar soluciones
- **Excelente para portafolio**: Es el stack más demandado por empleadores
- **Desarrollo ágil**: Hot reload con Vite, componentes reutilizables
- **Hooks modernos**: useState, useEffect, useContext simplifican la lógica
- **Mobile-friendly**: React es excelente para interfaces responsive

#### NestJS
**Ventajas:**
- **Arquitectura escalable**: Modular, inspirado en Angular, SOLID principles
- **TypeScript nativo**: Consistencia con el frontend
- **WebSocket integrado**: Socket.io viene de serie, fácil configuración
- **Decoradores y Guards**: Autenticación y validación muy limpias
- **Excelente para portafolio**: Muestra conocimiento de arquitectura profesional
- **Documentación automática**: Swagger/OpenAPI integrado
- **Dependency Injection**: Facilita testing y mantenimiento

#### PostgreSQL
**Ventajas:**
- **Robustez**: Base de datos relacional madura y confiable
- **Relaciones complejas**: Perfecto para Users ↔ Games ↔ Rounds ↔ Teams
- **Integridad de datos**: ACID compliance, foreign keys, constraints
- **Excelente con TypeORM**: Migraciones automáticas, tipo-seguras
- **Escalable**: Soporta millones de registros sin problemas
- **JSON support**: Campos JSONB para datos flexibles (categoriesGuessed)
- **Gratis y open-source**: Sin costos de licencia

#### Socket.io
**Ventajas:**
- **Real-time bidireccional**: Perfecto para juegos multijugador
- **Rooms integrados**: Aislamiento de partidas sin esfuerzo extra
- **Reconnection automática**: Maneja desconexiones de red
- **Fallback a polling**: Funciona incluso si WebSockets están bloqueados
- **Event-based**: Arquitectura clara y fácil de entender

### ❌ CONTRAS Y ALTERNATIVAS

#### React: Contras
**Desventajas:**
- **Boilerplate**: Más código que frameworks opinados (Next.js, Svelte)
- **Decisiones de arquitectura**: Tienes que decidir gestión de estado, estructura, etc.
- **Bundle size**: Puede ser pesado para móviles (18kb min+gzip solo React)
- **Re-renders**: Fácil causar renders innecesarios sin optimización

**Alternativa: Svelte + TypeScript**
- ✅ **Menos código**: No necesitas useState, useEffect, todo es reactivo
- ✅ **Bundle más pequeño**: Compila a vanilla JS, ~3kb
- ✅ **Performance superior**: No virtual DOM, cambios quirúrgicos al DOM
- ✅ **Curva de aprendizaje suave**: Sintaxis más simple que React
- ⚠️ **Ecosistema más pequeño**: Menos librerías que React
- ⚠️ **Menos demandado**: Menos ofertas de trabajo con Svelte

**Recomendación:** Mantener React para portafolio, pero Svelte es excelente si buscas aprender algo nuevo

#### NestJS: Contras
**Desventajas:**
- **Curva de aprendizaje**: Más complejo que Express puro
- **Overhead**: Más pesado que frameworks minimalistas (Fastify, Express)
- **Verbosidad**: Decoradores y módulos requieren más líneas de código
- **Startup time**: Más lento que alternativas ligeras

**Alternativa 1: Express + TypeScript**
- ✅ **Simplicidad**: Menos abstracción, más control
- ✅ **Lightweight**: Arranque rápido, menos memoria
- ✅ **Flexibilidad total**: No hay "forma correcta" de hacer las cosas
- ⚠️ **Menos estructura**: Tienes que definir tu propia arquitectura
- ⚠️ **Configuración manual**: WebSockets, validación, guards todo desde cero
- ⚠️ **Menos impresionante en portafolio**: Express es "básico"

**Alternativa 2: Fastify + TypeScript**
- ✅ **Más rápido**: 2-3x más performance que Express/Nest
- ✅ **TypeScript first-class**: Excelente soporte de tipos
- ✅ **Schema validation**: JSON Schema integrado
- ✅ **Plugin ecosystem**: Modular como NestJS pero más ligero
- ⚠️ **Menos opinado**: Requiere más decisiones de arquitectura
- ⚠️ **WebSockets no nativos**: Necesitas @fastify/websocket

**Recomendación:** Mantener NestJS - su arquitectura modular es perfecta para portafolio y muestra madurez como desarrollador

#### PostgreSQL: Contras
**Desventajas:**
- **Setup complejo**: Instalación, configuración, migrations
- **Overkill para MVP**: Puede ser excesivo para fase inicial de prototipo
- **Costos de hosting**: Menos opciones gratuitas que MongoDB

**Alternativa 1: MongoDB + Mongoose**
- ✅ **Setup rápido**: Sin migraciones, schema flexible
- ✅ **JSON nativo**: Perfecto para estructuras anidadas
- ✅ **Hosting gratuito**: MongoDB Atlas tier gratis (512MB)
- ✅ **Escalabilidad horizontal**: Sharding más fácil que PostgreSQL
- ⚠️ **Menos integridad**: No hay foreign keys, relaciones más débiles
- ⚠️ **Queries complejas**: JOINs son más difíciles (usa $lookup)
- ⚠️ **No ACID por defecto**: Transacciones requieren configuración

**Alternativa 2: SQLite (solo desarrollo)**
- ✅ **Cero configuración**: Un solo archivo
- ✅ **Perfecto para prototipar**: Rápido para empezar
- ⚠️ **No production-ready**: No soporta múltiples conexiones concurrentes
- ⚠️ **No WebSocket-friendly**: Locks pueden causar problemas

**Recomendación:** Mantener PostgreSQL - tus relaciones (Users ↔ Teams ↔ Games ↔ Rounds) son naturalmente relacionales

#### Socket.io: Contras
**Desventajas:**
- **Bundle size**: ~54kb (grande para móviles con 3G)
- **Complejidad innecesaria**: Si solo necesitas WebSockets simples
- **Debugging**: Eventos pueden ser difíciles de rastrear

**Alternativa: WebSockets nativos (ws library)**
- ✅ **Lightweight**: ~7kb vs 54kb de Socket.io
- ✅ **Simple**: Solo WebSockets, sin abstracción extra
- ✅ **Performance**: Menos overhead
- ⚠️ **Sin rooms**: Tienes que implementar manualmente
- ⚠️ **Sin reconnection**: Debes manejar todo desde cero
- ⚠️ **Solo WebSockets**: No fallback a polling

**Recomendación:** Mantener Socket.io - rooms y reconnection automática son críticos para tu juego

---

## Stack Alternativo Recomendado (Si quieres explorar)

### Opción 1: Stack "Moderno y Rápido"
```
Frontend: Svelte + TypeScript + Vite
Backend: Fastify + TypeScript + ws (WebSockets nativos)
Database: PostgreSQL + Prisma ORM
Auth: JWT
```

**Cuándo elegir:**
- Quieres máxima performance
- Prefieres menos boilerplate
- Te gusta aprender tecnologías emergentes

**Trade-offs:**
- Menos familiar para empleadores
- Ecosistema más pequeño
- Más decisiones de arquitectura manuales

### Opción 2: Stack "Full TypeScript Type-Safe"
```
Frontend: React + TypeScript + Vite
Backend: tRPC + Express + TypeScript
Database: PostgreSQL + Prisma
WebSockets: Socket.io
```

**Cuándo elegir:**
- Quieres type-safety end-to-end
- Odias escribir DTOs duplicados
- Valoras DX (Developer Experience) sobre todo

**Trade-offs:**
- Menos convencional (tRPC es nicho)
- Prisma tiene opiniones fuertes sobre estructura

### Opción 3: Stack "Súper Simple para MVP Rápido"
```
Frontend: React + TypeScript
Backend: Supabase (Backend-as-a-Service)
Database: PostgreSQL (incluido en Supabase)
Real-time: Supabase Realtime
Auth: Supabase Auth
```

**Cuándo elegir:**
- Quieres lanzar en 1-2 semanas
- No te importa depender de un servicio
- Priorizas velocidad de desarrollo

**Trade-offs:**
- Menos control sobre backend
- Vendor lock-in
- Menos impresionante para portafolio (no muestras skills de backend)

---

## Recomendación Final

### MANTÉN EL STACK ORIGINAL ✅

**React + NestJS + PostgreSQL + Socket.io**

**Razones:**
1. **Portafolio profesional**: Este stack está en la mayoría de ofertas de trabajo Full-Stack
2. **Escalabilidad real**: Puede crecer de 10 a 10,000 usuarios
3. **Arquitectura clara**: NestJS te obliga a escribir código limpio y mantenible
4. **Aprenderás patrones pro**: Dependency Injection, Guards, Decorators, SOLID
5. **Versatilidad**: Las skills son transferibles a Angular, Nest, Enterprise apps
6. **Documentación abundante**: Fácil encontrar soluciones a problemas

**Optimizaciones sugeridas:**
- Usar **Prisma** en lugar de TypeORM (mejor DX, migrations más claras)
- Agregar **Redis** para cache de game state en producción (opcional)
- Usar **Zod** para validación de DTOs (type-safe en runtime)

---

## Estructura de Archivos Críticos

### Backend - Archivos Clave
```
backend/src/
├── websockets/game.gateway.ts          [CRÍTICO] Lógica WebSocket real-time
├── games/game-state.service.ts         [CRÍTICO] Estado en memoria
├── games/turn-manager.service.ts       [CRÍTICO] Rotación de turnos
├── auth/strategies/jwt.strategy.ts     [CRÍTICO] Seguridad JWT
├── words/words.service.ts              [IMPORTANTE] Generación de palabras
└── common/guards/ws-jwt.guard.ts       [IMPORTANTE] Seguridad WebSocket
```

### Frontend - Archivos Clave
```
frontend/src/
├── contexts/GameContext.tsx            [CRÍTICO] Estado del juego
├── contexts/SocketContext.tsx          [CRÍTICO] Conexión WebSocket
├── components/game/GameContainer.tsx   [CRÍTICO] Orquestador de vistas
├── components/game/DrawerView.tsx      [IMPORTANTE] Vista con palabra
├── components/game/GuesserView.tsx     [IMPORTANTE] Vista con botón
└── hooks/useGameState.ts               [IMPORTANTE] Lógica de roles
```

---

## Fases de Implementación (Resumen)

### Fase 1: Fundación (Semanas 1-2)
- Setup proyectos backend y frontend
- Auth completo (registro, login, JWT)
- Base de datos con migraciones
- Seeders de palabras

### Fase 2: Salas y Lobby (Semana 3)
- Crear/unirse a salas
- Sistema de códigos de sala
- Asignación de equipos
- WebSocket básico

### Fase 3: Lógica Core del Juego (Semanas 4-5)
- Inicio de partida
- Rotación de turnos
- Tirada de dado
- Asignación privada de palabra al dibujante
- Timer sincronizado
- Botón "Adiviné"
- Sistema de puntuación
- Condiciones de victoria

### Fase 4: Persistencia (Semana 6)
- Guardar rondas en DB
- Historial de partidas
- Preparar estructura para estadísticas

### Fase 5: Pulido (Semana 7)
- Manejo de desconexiones
- Reconexión de jugadores
- Validaciones exhaustivas
- UI/UX responsive
- Animaciones

### Fase 6: Estadísticas (Futuro)
- Stats por jugador
- Ranking global
- Historial detallado

### Fase 7: Deploy (Semana 9)
- Backend en Railway/Render
- Frontend en Vercel
- PostgreSQL en Supabase/Railway

---

## Características Técnicas Clave

### 1. Sistema de Turnos
Algoritmo que rota dibujante/adivinador alternando equipos:
- Equipo 1: Juan dibuja, Mauricio adivina
- Equipo 2: Ailin dibuja, Gonzalo adivina
- Equipo 1: Mauricio dibuja, Juan adivina
- Equipo 2: Gonzalo dibuja, Ailin adivina
- (ciclo se repite)

### 2. Privacidad de Palabra
Solo el dibujante recibe evento `word_assigned` en su socket individual.
Otros jugadores nunca reciben la palabra hasta timeout o adivinanza.

### 3. Timer Sincronizado
Servidor emite `timer_tick` cada segundo a todos los clientes.
Previene manipulación del timer en cliente.

### 4. Condiciones de Victoria
Configurables al inicio de partida:
- Primera en 3 aciertos
- Primera en 5 aciertos
- Primera en adivinar una palabra de cada categoría (4 categorías)

### 5. Categorías de Palabras
- Acciones (ej: "correr", "saltar")
- Objetos (ej: "mesa", "teléfono")
- Refranes (ej: "A caballo regalado...")
- Costumbres Argentinas (ej: "mate", "asado")

---

## Modelo de Base de Datos (Simplificado)

```
users
  ├── id (PK)
  ├── username
  ├── email
  └── password_hash

rooms
  ├── id (PK)
  ├── room_code (UNIQUE)
  ├── host_id (FK → users)
  └── status

games
  ├── id (PK)
  ├── room_id (FK → rooms)
  ├── victory_condition
  └── status

teams
  ├── id (PK)
  ├── game_id (FK → games)
  ├── team_number (1 o 2)
  ├── score
  └── categories_completed (JSONB)

game_participants
  ├── id (PK)
  ├── game_id (FK → games)
  ├── user_id (FK → users)
  ├── team_id (FK → teams)
  └── join_order

words
  ├── id (PK)
  ├── category
  └── word_text

game_rounds
  ├── id (PK)
  ├── game_id (FK → games)
  ├── drawer_id (FK → users)
  ├── guesser_id (FK → users)
  ├── word_id (FK → words)
  ├── guessed (boolean)
  └── time_elapsed
```

---

## Eventos WebSocket Principales

### Cliente → Servidor
- `join_room` - Unirse a sala
- `assign_teams` - Asignar equipos (host)
- `start_game` - Iniciar partida (host)
- `roll_dice` - Tirar dado (dibujante)
- `mark_guessed` - Marcar como adivinado (adivinador)

### Servidor → Cliente
- `room_joined` - Confirmación de ingreso
- `teams_assigned` - Equipos configurados
- `game_started` - Partida iniciada
- `dice_rolled` - Categoría seleccionada (todos)
- `word_assigned` - Palabra asignada (SOLO dibujante)
- `turn_started` - Turno iniciado (todos)
- `timer_tick` - Actualización de timer (todos)
- `word_guessed` - Palabra adivinada
- `game_over` - Partida finalizada

---

## Estructura del Monorepo

```
proyecto-pic/
├── .git/
├── .gitignore
├── pnpm-workspace.yaml
├── package.json                    # Root workspace config
├── turbo.json                      # (Opcional) Turborepo para builds optimizados
├── README.md
├── .prettierrc
├── .eslintrc.js
│
├── apps/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── components/
│   │   │   ├── contexts/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── .env.example
│   │
│   └── backend/
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── auth/
│       │   ├── users/
│       │   ├── rooms/
│       │   ├── games/
│       │   ├── words/
│       │   ├── websockets/
│       │   ├── common/
│       │   └── config/
│       ├── test/
│       ├── package.json
│       ├── tsconfig.json
│       ├── nest-cli.json
│       └── .env.example
│
└── packages/
    └── shared/
        ├── src/
        │   ├── types/
        │   │   ├── index.ts
        │   │   ├── auth.types.ts
        │   │   ├── user.types.ts
        │   │   ├── room.types.ts
        │   │   ├── game.types.ts
        │   │   ├── team.types.ts
        │   │   ├── word.types.ts
        │   │   └── socket-events.types.ts
        │   ├── constants/
        │   │   ├── index.ts
        │   │   ├── game-config.ts
        │   │   └── socket-events.ts
        │   └── validators/
        │       └── schemas.ts
        ├── package.json
        └── tsconfig.json
```

---

## Configuración del Monorepo

### 1. `pnpm-workspace.yaml` (root)
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 2. `package.json` (root)
```json
{
  "name": "proyecto-pic",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel --filter \"./apps/**\" dev",
    "dev:frontend": "pnpm --filter frontend dev",
    "dev:backend": "pnpm --filter backend start:dev",
    "build": "pnpm --recursive build",
    "build:frontend": "pnpm --filter frontend build",
    "build:backend": "pnpm --filter backend build",
    "lint": "pnpm --recursive lint",
    "test": "pnpm --recursive test",
    "clean": "pnpm --recursive exec rm -rf node_modules dist && rm -rf node_modules"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0",
    "turbo": "^1.10.0",
    "typescript": "^5.2.0"
  }
}
```

### 3. `turbo.json` (root) - OPCIONAL pero recomendado
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

### 4. `packages/shared/package.json`
```json
{
  "name": "@proyecto-pic/shared",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint src --ext .ts",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.2.0"
  }
}
```

### 5. `packages/shared/src/types/index.ts`
```typescript
// Re-export all types for easy importing
export * from './auth.types';
export * from './user.types';
export * from './room.types';
export * from './game.types';
export * from './team.types';
export * from './word.types';
export * from './socket-events.types';
```

### 6. `packages/shared/src/types/game.types.ts` (ejemplo)
```typescript
export interface GameState {
  gameId: string;
  roomCode: string;
  currentRound: number;
  currentDrawerId: string;
  currentGuesserId: string;
  currentTeamId: string;
  currentWord?: {
    id: string;
    text: string;
    category: string;
  };
  turnStartTime: Date;
  timerDuration: number;
  teams: {
    team1: TeamState;
    team2: TeamState;
  };
  victoryCondition: VictoryCondition;
  status: GameStatus;
}

export interface TeamState {
  id: string;
  teamNumber: 1 | 2;
  score: number;
  playerIds: string[];
  categoriesGuessed: WordCategory[];
}

export type VictoryCondition = 'first_to_3' | 'first_to_5' | 'all_categories';
export type GameStatus = 'active' | 'paused' | 'finished';
export type WordCategory = 'Acciones' | 'Objetos' | 'Refranes' | 'Costumbres Argentinas';
```

### 7. `packages/shared/src/types/socket-events.types.ts`
```typescript
import { GameState, TeamState } from './game.types';
import { User } from './user.types';
import { Room } from './room.types';

// Client -> Server Events
export interface ClientToServerEvents {
  join_room: (data: { roomCode: string }) => void;
  leave_room: (data: { roomCode: string }) => void;
  assign_teams: (data: { roomCode: string; assignments: { team1: string[]; team2: string[] } }) => void;
  assign_teams_random: (data: { roomCode: string }) => void;
  start_game: (data: { roomCode: string; victoryCondition: string }) => void;
  roll_dice: (data: { gameId: string }) => void;
  mark_guessed: (data: { gameId: string; roundId: string }) => void;
}

// Server -> Client Events
export interface ServerToClientEvents {
  room_joined: (data: { room: Room }) => void;
  player_joined: (data: { player: User; playerCount: number }) => void;
  player_left: (data: { playerId: string; playerCount: number }) => void;
  teams_assigned: (data: { team1: User[]; team2: User[] }) => void;
  game_started: (data: { gameId: string; victoryCondition: string; initialState: GameState }) => void;
  dice_rolled: (data: { category: string; animation: { duration: number; finalCategory: string } }) => void;
  word_assigned: (data: { word: { id: string; text: string; category: string } }) => void;
  turn_started: (data: { roundNumber: number; drawer: User; guesser: User; team: TeamState; category: string; startTime: Date; duration: number }) => void;
  timer_tick: (data: { timeRemaining: number }) => void;
  word_guessed: (data: { roundId: string; timeElapsed: number; team: TeamState; category: string }) => void;
  turn_timeout: (data: { roundId: string; word: string }) => void;
  next_turn: (data: { nextDrawer: User; nextGuesser: User; nextTeam: TeamState }) => void;
  game_state_update: (data: { scores: { team1: number; team2: number }; categoriesGuessed: { team1: string[]; team2: string[] }; currentRound: number }) => void;
  game_over: (data: { winner: { teamId: string; teamNumber: number; players: User[] }; finalScores: { team1: number; team2: number }; victoryCondition: string }) => void;
  player_disconnected: (data: { playerId: string; username: string; shouldPauseGame: boolean }) => void;
  player_reconnected: (data: { playerId: string; username: string; currentGameState?: GameState }) => void;
  error: (data: { code: string; message: string }) => void;
}
```

### 8. `packages/shared/src/constants/game-config.ts`
```typescript
export const GAME_CONFIG = {
  MAX_PLAYERS: 8,
  MIN_PLAYERS: 4,
  TURN_DURATION: 60, // seconds
  ROOM_CODE_LENGTH: 6,
  CATEGORIES: ['Acciones', 'Objetos', 'Refranes', 'Costumbres Argentinas'] as const,
  VICTORY_CONDITIONS: {
    FIRST_TO_3: 'first_to_3',
    FIRST_TO_5: 'first_to_5',
    ALL_CATEGORIES: 'all_categories',
  } as const,
} as const;
```

### 9. `apps/frontend/package.json`
```json
{
  "name": "frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx"
  },
  "dependencies": {
    "@proyecto-pic/shared": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.18.0",
    "socket.io-client": "^4.7.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.2.0",
    "vite": "^5.0.0"
  }
}
```

### 10. `apps/backend/package.json`
```json
{
  "name": "backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  },
  "dependencies": {
    "@proyecto-pic/shared": "workspace:*",
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/platform-socket.io": "^10.0.0",
    "@nestjs/websockets": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "typeorm": "^0.3.17",
    "pg": "^8.11.0",
    "bcrypt": "^5.1.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.0",
    "passport-local": "^1.0.0",
    "socket.io": "^4.7.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/bcrypt": "^5.0.0",
    "@types/express": "^4.17.17",
    "@types/node": "^20.0.0",
    "@types/passport-jwt": "^3.0.9",
    "@types/passport-local": "^1.0.35",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.2.0"
  }
}
```

### 11. Uso de tipos compartidos en Backend
```typescript
// apps/backend/src/websockets/game.gateway.ts
import {
  ClientToServerEvents,
  ServerToClientEvents,
  GameState
} from '@proyecto-pic/shared';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents>;

  handleConnection(client: Socket<ClientToServerEvents, ServerToClientEvents>) {
    // TypeScript sabe exactamente qué eventos están disponibles
  }

  @SubscribeMessage('roll_dice')
  handleRollDice(
    client: Socket,
    data: { gameId: string }
  ) {
    // Tipo seguro
  }
}
```

### 12. Uso de tipos compartidos en Frontend
```typescript
// apps/frontend/src/contexts/SocketContext.tsx
import { io, Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents
} from '@proyecto-pic/shared';

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const SocketContext = createContext<{
  socket: TypedSocket | null;
}>({ socket: null });

// Ahora socket.emit y socket.on están completamente tipados
socket.emit('join_room', { roomCode: 'ABC123' }); // ✅ Type-safe
socket.on('room_joined', (data) => {
  // data.room es tipo Room automáticamente
});
```

---

## Próximos Pasos para Implementación

### Paso 1: Configuración Inicial del Monorepo

```bash
# 1. Crear directorio del proyecto
mkdir proyecto-pic
cd proyecto-pic

# 2. Inicializar git
git init

# 3. Instalar pnpm (si no lo tienes)
npm install -g pnpm

# 4. Crear estructura de carpetas
mkdir -p apps/frontend apps/backend packages/shared/src/{types,constants,validators}

# 5. Crear pnpm-workspace.yaml
cat > pnpm-workspace.yaml << EOF
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# 6. Crear package.json root
pnpm init

# 7. Crear .gitignore
cat > .gitignore << EOF
# Dependencies
node_modules/
.pnp/
.pnp.js

# Testing
coverage/

# Production
dist/
build/
.next/

# Environment
.env
.env.local
.env.*.local

# IDEs
.idea/
.vscode/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Misc
.turbo/
EOF
```

### Paso 2: Crear Package Compartido

```bash
cd packages/shared

# Inicializar package.json
cat > package.json << EOF
{
  "name": "@proyecto-pic/shared",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.2.0"
  }
}
EOF

# Crear tsconfig.json
cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

cd ../..
```

### Paso 3: Crear Frontend (React + Vite)

```bash
cd apps

# Crear proyecto Vite
pnpm create vite frontend --template react-ts

cd frontend

# Agregar dependencia del package compartido
pnpm add @proyecto-pic/shared@workspace:*

# Agregar otras dependencias
pnpm add react-router-dom socket.io-client axios

# Agregar tipos
pnpm add -D @types/node

cd ../..
```

### Paso 4: Crear Backend (NestJS)

```bash
cd apps

# Instalar NestJS CLI globalmente (si no lo tienes)
pnpm add -g @nestjs/cli

# Crear proyecto NestJS
nest new backend

# Cuando pregunte qué package manager, elige: pnpm

cd backend

# Agregar dependencia del package compartido
pnpm add @proyecto-pic/shared@workspace:*

# Agregar dependencias del proyecto
pnpm add @nestjs/websockets @nestjs/platform-socket.io socket.io
pnpm add @nestjs/typeorm typeorm pg
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt passport-local
pnpm add bcrypt class-validator class-transformer

# Agregar tipos
pnpm add -D @types/bcrypt @types/passport-jwt @types/passport-local

cd ../..
```

### Paso 5: Instalar Dependencias del Root

```bash
# En la raíz del proyecto
pnpm install

# Opcional: Agregar Turborepo para builds optimizados
pnpm add -D turbo

# Verificar que todo está instalado correctamente
pnpm --filter frontend --filter backend --filter @proyecto-pic/shared install
```

### Paso 6: Configurar PostgreSQL

```bash
# Opción A: Docker (recomendado para desarrollo)
docker run --name pictionary-postgres \
  -e POSTGRES_USER=pictionary \
  -e POSTGRES_PASSWORD=pictionary123 \
  -e POSTGRES_DB=pictionary_db \
  -p 5432:5432 \
  -d postgres:15

# Opción B: Instalación local
# Instala PostgreSQL desde https://www.postgresql.org/download/
# Crea una base de datos llamada "pictionary_db"
```

### Paso 7: Configurar Variables de Entorno

```bash
# Backend .env
cd apps/backend
cat > .env << EOF
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=pictionary
DATABASE_PASSWORD=pictionary123
DATABASE_NAME=pictionary_db

# JWT
JWT_SECRET=tu-super-secreto-jwt-cambiar-en-produccion
JWT_EXPIRES_IN=15m

# Server
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:5173
EOF

# Frontend .env
cd ../frontend
cat > .env << EOF
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
EOF

cd ../..
```

### Paso 8: Verificar que Todo Funciona

```bash
# Desde la raíz del proyecto

# Correr frontend y backend en paralelo
pnpm dev

# O correr individualmente:
pnpm dev:frontend  # Puerto 5173
pnpm dev:backend   # Puerto 3000
```

### Paso 9: Crear Primera Migración (TypeORM)

```bash
cd apps/backend

# Configurar TypeORM en src/app.module.ts primero

# Generar migración
pnpm typeorm migration:generate -n InitialSchema

# Correr migración
pnpm typeorm migration:run
```

### Paso 10: Implementar Auth Básico

1. Crear módulo de autenticación
2. Implementar registro y login
3. Configurar JWT strategy
4. Probar endpoints con Postman/Thunder Client

### Paso 11: Continuar con Fase 2 (Salas)

Seguir el plan de fases descrito más abajo...

