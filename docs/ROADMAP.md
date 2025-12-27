# 🎯 Roadmap - Proyecto Pictionary Online

## 📍 Estado Actual del Proyecto

**Fase actual:** Configuración Inicial Completada ✅
**Próximo paso:** Configurar PostgreSQL y comenzar Fase 1 (Autenticación)

---

## ✅ Fase 0: Configuración Inicial del Monorepo (COMPLETADA)

- [X] Crear estructura de carpetas del monorepo
- [X] Configurar pnpm workspace y .gitignore
- [X] Crear package compartido (@proyecto-pic/shared)
  - [X] Definir todos los tipos TypeScript (auth, user, room, game, team, word, socket-events)
  - [X] Crear constantes del juego (GAME_CONFIG)
  - [X] Definir eventos de Socket.io tipados
- [X] Inicializar frontend (React + Vite + TypeScript)
  - [X] Instalar dependencias (react-router-dom, socket.io-client, axios)
  - [X] Configurar referencia a @proyecto-pic/shared
  - [X] Crear .env.example
- [X] Inicializar backend (NestJS + TypeScript)
  - [X] Instalar dependencias (TypeORM, Socket.io, JWT, Passport, bcrypt)
  - [X] Configurar referencia a @proyecto-pic/shared
  - [X] Crear .env.example
- [X] Verificar compilación de frontend y backend
- [X] Crear commit inicial en Git
- [X] Crear documentación (README.md, COMMANDS.md)

---

## 🔧 Fase 1: Fundación (Semanas 1-2)

### Backend - Base de Datos y Autenticación

- [X] **Configurar PostgreSQL**

  - [X] Instalar PostgreSQL (Docker recomendado)
  - [X] Crear base de datos `pictionary_db`
  - [X] Configurar archivo `.env` con credenciales
  - [X] Verificar conexión a la base de datos
- [X] **Configurar TypeORM en NestJS**

  - [X] onfigurar TypeORM en `app.module.ts`
  - [X] Crear archivo `ormconfig.ts` o configuración inline
  - [X] Probar conexión exitosa
- [X] **Crear Entidad User**

  - [X] Crear archivo `src/users/entities/user.entity.ts`
  - [X] Definir campos: id, username, email, password_hash, createdAt, updatedAt
  - [X] Agregar índices en username y email
- [X] **Generar y Correr Primera Migración**

  - [X] Generar migración: `pnpm typeorm migration:generate src/migrations/CreateUsersTable`
  - [X] Revisar SQL generado
  - [X] Ejecutar migración: `pnpm typeorm migration:run`
  - [X] Verificar tabla en base de datos
- [X] **Crear Módulo Users**

  - [X] Generar módulo: `nest g module users`
  - [X] Generar servicio: `nest g service users`
  - [X] Generar controlador: `nest g controller users`
  - [X] Implementar CRUD básico de usuarios
- [X] **Crear Módulo Auth**

  - [X] Generar módulo: `nest g module auth`
  - [X] Generar servicio: `nest g service auth`
  - [X] Generar controlador: `nest g controller auth`
- [X] **Implementar Registro de Usuarios**

  - [X] Crear DTO `RegisterDto` (username, email, password)
  - [X] Implementar validaciones con class-validator
  - [X] Hash de password con bcrypt (10 rounds)
  - [X] Endpoint POST `/auth/register`
  - [X] Manejar errores (email duplicado, etc)
- [X] **Implementar Login de Usuarios**

  - [X] Crear DTO `LoginDto` (username, password)
  - [X] Implementar `LocalStrategy` con Passport
  - [X] Validar credenciales (comparar hash)
  - [X] Endpoint POST `/auth/login`
- [X] **Implementar JWT Authentication**

  - [X] Configurar JwtModule con secret y expiración
  - [X] Crear `JwtStrategy` para validar tokens
  - [X] Generar access token en login exitoso
  - [X] Crear decorador `@CurrentUser()` para extraer user del request
- [X] **Crear Guards de Autenticación**

  - [X] Crear `JwtAuthGuard` para rutas protegidas
  - [X] Crear `LocalAuthGuard` para login
  - [X] Aplicar guards en controladores necesarios
- [X] **Testing de Autenticación**

  - [X] Probar registro con Postman/Thunder Client
  - [X] Probar login y obtención de token
  - [X] Probar acceso a ruta protegida con token
  - [X] Probar errores (credenciales inválidas, token expirado)

### Frontend - Autenticación UI

- [X] **Crear Estructura de Carpetas Frontend**

  - [X] Crear carpetas: components/, contexts/, hooks/, pages/, services/, utils/
- [X] **Configurar React Router**

  - [X] Instalar dependencias ya agregadas
  - [X] Crear archivo `src/App.tsx` con rutas básicas
  - [X] Crear páginas: HomePage, LoginPage, RegisterPage, DashboardPage
- [X] **Crear AuthContext**

  - [X] Crear `src/contexts/AuthContext.tsx`
  - [X] Estado: user, token, isAuthenticated, isLoading
  - [X] Funciones: login, register, logout
  - [X] Guardar token en localStorage
  - [X] Provider envolviendo la app
- [X] **Crear Servicio de API (Axios)**

  - [X] Crear `src/services/api.ts` con instancia de Axios
  - [X] Configurar baseURL desde variables de entorno
  - [X] Crear interceptor para agregar token en headers
  - [X] Crear interceptor para manejar errores 401
- [X] **Crear Auth Service**

  - [X] Crear `src/services/auth.service.ts`
  - [X] Función `register(data: RegisterDto)`
  - [X] Función `login(data: LoginDto)`
  - [X] Función `getCurrentUser()`
- [X] **Crear Componente LoginForm**

  - [X] Integrado en `src/pages/LoginPage.tsx`
  - [X] Formulario con username y password
  - [X] Validación de campos
  - [X] Llamar a authContext.login()
  - [X] Mostrar errores
- [X] **Crear Componente RegisterForm**

  - [X] Integrado en `src/pages/RegisterPage.tsx`
  - [X] Formulario con username, email, password, confirmPassword
  - [X] Validación de campos (email válido, passwords coinciden)
  - [X] Llamar a authContext.register()
  - [X] Mostrar errores
- [X] **Crear Páginas de Auth**

  - [X] Crear `src/pages/LoginPage.tsx` con LoginForm
  - [X] Crear `src/pages/RegisterPage.tsx` con RegisterForm
  - [X] Redireccionar a dashboard después de login exitoso
- [X] **Crear ProtectedRoute Component**

  - [X] Crear `src/components/common/ProtectedRoute.tsx`
  - [X] Verificar isAuthenticated
  - [X] Redireccionar a /login si no está autenticado
- [X] **Crear Dashboard Básico**

  - [X] Crear `src/pages/DashboardPage.tsx`
  - [X] Mostrar información del usuario logueado
  - [X] Botón de logout
- [X] **Testing Frontend Auth**

  - [X] Probar flujo completo: registro → login → dashboard → logout
  - [X] Verificar persistencia de sesión (refresh page)
  - [X] Probar manejo de errores

### Finalización Fase 1

- [X] **Commit de Fase 1**
  - [X] Crear commit con mensaje descriptivo
  - [X] Pushear a GitHub

---

## 🏠 Fase 2: Salas y Lobby (Semana 3)

### Backend - Sistema de Salas

- [X] **Crear Entidad Room**

  - [X] Crear `src/rooms/entities/room.entity.ts`
  - [X] Campos: id, roomCode, hostId, status, maxPlayers, createdAt, startedAt, finishedAt
  - [X] Relación con User (host)
- [X] **Generar Migración de Rooms**

  - [X] Generar migración para tabla rooms
  - [X] Ejecutar migración
- [X] **Crear Módulo Rooms**

  - [X] Generar módulo, servicio y controlador
  - [X] Implementar lógica de generación de código único (6 caracteres)
- [X] **Implementar Crear Sala**

  - [X] Endpoint POST `/rooms/create`
  - [X] Generar roomCode único
  - [X] Asignar user actual como host
  - [X] Retornar sala creada
- [X] **Implementar Unirse a Sala**

  - [X] Endpoint POST `/rooms/join`
  - [X] Validar que roomCode existe
  - [ ] Validar que sala no está llena (max 8 players)
  - [ ] Agregar jugador a la sala
- [ ] **Configurar WebSocket Gateway**

  - [ ] Generar gateway: `nest g gateway websockets/game`
  - [ ] Configurar CORS para WebSocket
  - [ ] Implementar autenticación JWT para WebSocket
- [ ] **Crear WS JWT Guard**

  - [ ] Crear `src/common/guards/ws-jwt.guard.ts`
  - [ ] Validar token desde handshake
  - [ ] Adjuntar user a socket.data
- [ ] **Implementar Eventos de Sala**

  - [ ] Evento `join_room` - Unirse a room de Socket.io
  - [ ] Evento `leave_room` - Salir de room
  - [ ] Broadcast `player_joined` a todos en la sala
  - [ ] Broadcast `player_left` cuando alguien se va
- [ ] **Crear Lógica de Asignación de Equipos**

  - [ ] Crear entidad Team (id, gameId, teamNumber, score, categoriesCompleted)
  - [ ] Crear entidad GameParticipant (id, gameId, userId, teamId, joinOrder)
  - [ ] Generar migraciones
- [ ] **Implementar Asignación Manual de Equipos**

  - [ ] Evento `assign_teams` (solo host)
  - [ ] Validar que user es host
  - [ ] Asignar jugadores a team1 y team2
  - [ ] Broadcast `teams_assigned` con equipos
- [ ] **Implementar Asignación Aleatoria de Equipos**

  - [ ] Evento `assign_teams_random` (solo host)
  - [ ] Algoritmo: shuffle players y dividir en 2 equipos equitativos
  - [ ] Broadcast `teams_assigned`

### Frontend - UI de Salas

- [ ] **Crear SocketContext**

  - [ ] Crear `src/contexts/SocketContext.tsx`
  - [ ] Inicializar socket.io-client con token
  - [ ] Funciones: connect, disconnect, emit, on, off
  - [ ] Usar tipos de @proyecto-pic/shared
- [ ] **Crear Página CreateRoom**

  - [ ] Crear `src/pages/CreateRoomPage.tsx`
  - [ ] Formulario: seleccionar maxPlayers (4, 6, 8)
  - [ ] Llamar API POST `/rooms/create`
  - [ ] Redireccionar a `/lobby/:roomCode`
- [ ] **Crear Página JoinRoom**

  - [ ] Crear `src/pages/JoinRoomPage.tsx`
  - [ ] Input para ingresar roomCode
  - [ ] Llamar API POST `/rooms/join`
  - [ ] Redireccionar a `/lobby/:roomCode`
- [ ] **Crear Componente RoomLobby**

  - [ ] Crear `src/components/lobby/RoomLobby.tsx`
  - [ ] Mostrar roomCode grande
  - [ ] Lista de jugadores conectados
  - [ ] Indicar quién es el host
- [ ] **Conectar WebSocket al Entrar a Lobby**

  - [ ] En LobbyPage, conectar socket
  - [ ] Emitir evento `join_room` con roomCode
  - [ ] Escuchar `player_joined` y actualizar lista
  - [ ] Escuchar `player_left` y actualizar lista
- [ ] **Crear Componente TeamAssignment**

  - [ ] Crear `src/components/lobby/TeamAssignment.tsx`
  - [ ] Mostrar 2 columnas: Team 1 y Team 2
  - [ ] Si es host: drag & drop para asignar jugadores
  - [ ] Botón "Asignar Aleatoriamente" (solo host)
  - [ ] Botón "Iniciar Juego" (solo host, habilitado si teams están asignados)
- [ ] **Implementar Drag & Drop de Jugadores**

  - [ ] Usar librería o HTML5 drag & drop
  - [ ] Permitir mover jugadores entre equipos
  - [ ] Emitir `assign_teams` al confirmar
- [ ] **Escuchar Evento teams_assigned**

  - [ ] Actualizar estado local con equipos
  - [ ] Mostrar jugadores en sus equipos respectivos

### Finalización Fase 2

- [ ] **Testing Salas**

  - [ ] Probar crear sala
  - [ ] Probar unirse con código
  - [ ] Probar asignación manual de equipos
  - [ ] Probar asignación aleatoria
  - [ ] Probar con múltiples usuarios (2+ navegadores)
- [ ] **Commit de Fase 2**

  - [ ] Crear commit descriptivo
  - [ ] Pushear a GitHub

---

## 🎮 Fase 3: Lógica Core del Juego (Semanas 4-5)

### Backend - Sistema de Juego

- [ ] **Crear Entidades del Juego**

  - [ ] Crear entidad Game (id, roomId, victoryCondition, currentRound, status, winnerTeamId)
  - [ ] Crear entidad GameRound (id, gameId, roundNumber, drawerId, guesserId, wordId, status, guessed, timeElapsed)
  - [ ] Generar migraciones
- [ ] **Crear Entidad Word y Seeders**

  - [ ] Crear entidad Word (id, category, wordText, difficulty, isActive)
  - [ ] Generar migración
  - [ ] Crear seeder con palabras iniciales:
    - [ ] 20+ palabras categoría "Acciones"
    - [ ] 20+ palabras categoría "Objetos"
    - [ ] 20+ palabras categoría "Refranes"
    - [ ] 20+ palabras categoría "Costumbres Argentinas"
- [ ] **Crear GameStateService (In-Memory)**

  - [ ] Crear `src/games/game-state.service.ts`
  - [ ] Mantener Map<gameId, GameState>
  - [ ] Métodos: getGameState, updateGameState, initializeGame, removeGame
- [ ] **Crear TurnManagerService**

  - [ ] Crear `src/games/turn-manager.service.ts`
  - [ ] Implementar algoritmo de rotación de turnos
  - [ ] Método generateTurnOrder(team1Players, team2Players)
  - [ ] Método getNextTurn(currentTurn, turnOrder)
- [ ] **Implementar Inicio de Juego**

  - [ ] Evento `start_game` (solo host)
  - [ ] Validar que equipos están asignados
  - [ ] Crear registro en tabla games
  - [ ] Crear registros en tabla teams
  - [ ] Inicializar GameState en memoria
  - [ ] Generar turnOrder
  - [ ] Broadcast `game_started` con estado inicial
- [ ] **Implementar DiceRollerService**

  - [ ] Crear `src/words/dice-roller.service.ts`
  - [ ] Método roll() que retorna categoría aleatoria
  - [ ] Simular animación de dado (duración 2 segundos)
- [ ] **Implementar Evento roll_dice**

  - [ ] Validar que quien emite es el dibujante actual
  - [ ] Llamar diceRollerService.roll()
  - [ ] Broadcast `dice_rolled` a todos con categoría y animación
  - [ ] Obtener palabra aleatoria de esa categoría
  - [ ] Guardar palabra en GameState
  - [ ] Enviar evento `word_assigned` SOLO al socket del dibujante
- [ ] **Implementar Timer del Turno**

  - [ ] Al asignar palabra, iniciar timer de 60 segundos
  - [ ] Broadcast `turn_started` a todos (drawer, guesser, duration)
  - [ ] Emitir `timer_tick` cada segundo a todos
  - [ ] Al llegar a 0, emitir `turn_timeout` con palabra revelada
- [ ] **Implementar Evento mark_guessed**

  - [ ] Validar que quien emite es el adivinador actual
  - [ ] Detener timer
  - [ ] Calcular timeElapsed
  - [ ] Incrementar score del equipo
  - [ ] Agregar categoría a categoriesGuessed si no existe
  - [ ] Guardar GameRound en DB con guessed=true
  - [ ] Broadcast `word_guessed` con info del equipo
- [ ] **Implementar Verificación de Victoria**

  - [ ] Método checkVictoryCondition(gameState)
  - [ ] Lógica para "first_to_3"
  - [ ] Lógica para "first_to_5"
  - [ ] Lógica para "all_categories"
  - [ ] Si hay ganador, emitir `game_over` y finalizar
- [ ] **Implementar Siguiente Turno**

  - [ ] Obtener nextTurn de turnOrder
  - [ ] Actualizar GameState
  - [ ] Broadcast `next_turn` con próximo drawer y guesser
  - [ ] Esperar a que nuevo drawer haga roll_dice
- [ ] **Manejo de Desconexiones**

  - [ ] Escuchar evento `disconnect`
  - [ ] Marcar jugador como desconectado en GameParticipant
  - [ ] Broadcast `player_disconnected`
  - [ ] Si es drawer o guesser actual, pausar juego
- [ ] **Manejo de Reconexiones**

  - [ ] Evento `rejoin_game`
  - [ ] Marcar jugador como conectado
  - [ ] Enviar estado completo del juego al jugador
  - [ ] Broadcast `player_reconnected`
  - [ ] Reanudar juego si estaba pausado

### Frontend - UI del Juego

- [ ] **Crear GameContext**

  - [ ] Crear `src/contexts/GameContext.tsx`
  - [ ] Estado: gameState, myRole (drawer/guesser/spectator), currentWord, timeRemaining
  - [ ] Función rollDice()
  - [ ] Función markGuessed()
- [ ] **Crear Hook useGameState**

  - [ ] Crear `src/hooks/useGameState.ts`
  - [ ] Determinar myRole basado en gameState y userId
  - [ ] Retornar info útil para componentes
- [ ] **Crear Página GamePage**

  - [ ] Crear `src/pages/GamePage.tsx`
  - [ ] Escuchar todos los eventos del juego
  - [ ] Actualizar GameContext con eventos
- [ ] **Crear Componente GameContainer**

  - [ ] Crear `src/components/game/GameContainer.tsx`
  - [ ] Orquestador que decide qué vista mostrar
  - [ ] Mostrar DrawerView, GuesserView o SpectatorView según rol
- [ ] **Crear Componente DrawerView**

  - [ ] Crear `src/components/game/DrawerView.tsx`
  - [ ] Mostrar la palabra en grande
  - [ ] Instrucciones: "Dibuja esto en papel"
  - [ ] Timer visible
- [ ] **Crear Componente GuesserView**

  - [ ] Crear `src/components/game/GuesserView.tsx`
  - [ ] Mostrar: "Tu compañero está dibujando"
  - [ ] Botón grande: "¡Adiviné!" (llama markGuessed)
  - [ ] Timer visible
- [ ] **Crear Componente SpectatorView**

  - [ ] Crear `src/components/game/SpectatorView.tsx`
  - [ ] Mostrar quién está dibujando y adivinando
  - [ ] Timer visible
  - [ ] Mensaje: "Esperando..."
- [ ] **Crear Componente Timer**

  - [ ] Crear `src/components/game/Timer.tsx`
  - [ ] Animación de reloj de arena
  - [ ] Mostrar segundos restantes
  - [ ] Actualizar con evento `timer_tick`
- [ ] **Crear Componente DiceRoller**

  - [ ] Crear `src/components/game/DiceRoller.tsx`
  - [ ] Botón "Tirar Dado" (solo visible para drawer)
  - [ ] Animación de dado girando (2 segundos)
  - [ ] Mostrar categoría resultante
- [ ] **Crear Componente ScoreBoard**

  - [ ] Crear `src/components/game/ScoreBoard.tsx`
  - [ ] Mostrar scores de Team 1 y Team 2
  - [ ] Actualizar con `game_state_update`
- [ ] **Crear Componente CategoryDisplay**

  - [ ] Mostrar categoría actual del turno
  - [ ] Mostrar categorías ya adivinadas por cada equipo
- [ ] **Crear Componente GameOverModal**

  - [ ] Crear `src/components/game/GameOverModal.tsx`
  - [ ] Mostrar equipo ganador
  - [ ] Mostrar scores finales
  - [ ] Botón "Volver al Lobby" o "Nueva Partida"
- [ ] **Conectar Eventos de WebSocket**

  - [ ] Escuchar `game_started` y navegar a /game/:roomCode
  - [ ] Escuchar `dice_rolled` y mostrar animación
  - [ ] Escuchar `word_assigned` y guardar en GameContext
  - [ ] Escuchar `turn_started` y actualizar estado
  - [ ] Escuchar `timer_tick` y actualizar timer
  - [ ] Escuchar `word_guessed` y actualizar scores
  - [ ] Escuchar `turn_timeout` y mostrar palabra
  - [ ] Escuchar `next_turn` y actualizar roles
  - [ ] Escuchar `game_over` y mostrar modal

### Finalización Fase 3

- [ ] **Testing del Juego Completo**

  - [ ] Probar flujo completo con 4 jugadores (2 navegadores x2)
  - [ ] Probar tirada de dado
  - [ ] Probar asignación privada de palabra
  - [ ] Probar timer sincronizado
  - [ ] Probar botón "Adiviné"
  - [ ] Probar rotación de turnos
  - [ ] Probar victoria con "first_to_3"
  - [ ] Probar victoria con "all_categories"
- [ ] **Commit de Fase 3**

  - [ ] Crear commit descriptivo
  - [ ] Pushear a GitHub

---

## 💾 Fase 4: Persistencia de Partidas (Semana 6)

- [ ] **Verificar Entidad GameRound**

  - [ ] Asegurar que se guarda cada ronda en DB
  - [ ] Campos completos: drawerId, guesserId, wordId, category, guessed, timeElapsed
- [ ] **Crear Endpoint de Historial**

  - [ ] GET `/games/:gameId/rounds` - Obtener todas las rondas de un juego
  - [ ] GET `/games/:gameId` - Obtener info completa del juego
- [ ] **Actualizar Tabla Games al Finalizar**

  - [ ] Al emitir `game_over`, actualizar:
    - [ ] status = 'finished'
    - [ ] winnerTeamId
    - [ ] finishedAt = now()
- [ ] **Crear Vista de Historial en Frontend**

  - [ ] Crear `src/components/game/RoundHistory.tsx`
  - [ ] Mostrar lista de rondas durante el juego
  - [ ] Indicar quién dibujó, categoría, si adivinó, tiempo
- [ ] **Mostrar Resumen Final**

  - [ ] En GameOverModal, mostrar:
    - [ ] Todas las rondas jugadas
    - [ ] MVP (jugador con más adivinanzas)
    - [ ] Categorías completadas por equipo
- [ ] **Commit de Fase 4**

  - [ ] Crear commit descriptivo
  - [ ] Pushear a GitHub

---

## 🎨 Fase 5: Pulido y UX (Semana 7)

### Mejoras de UX

- [ ] **Validaciones Exhaustivas**

  - [ ] Backend: validar todos los DTOs con class-validator
  - [ ] Frontend: validar formularios antes de submit
  - [ ] Mensajes de error claros y en español
- [ ] **Loading States**

  - [ ] Agregar spinners durante API calls
  - [ ] Skeleton loaders en listas de jugadores
  - [ ] Disable buttons durante operaciones
- [ ] **Feedback Visual**

  - [ ] Animaciones al unirse jugador (slide-in)
  - [ ] Confetti al ganar partida
  - [ ] Highlight del jugador actual (drawer/guesser)
  - [ ] Toast notifications para eventos importantes
- [ ] **Diseño Responsive**

  - [ ] Mobile-first design
  - [ ] Optimizar para pantallas pequeñas (320px+)
  - [ ] Touch-friendly buttons (min 44x44px)
  - [ ] Probar en iPhone SE, Android medium, tablet
- [ ] **Animaciones**

  - [ ] Transición suave entre vistas (drawer → guesser → spectator)
  - [ ] Animación del dado (CSS o Lottie)
  - [ ] Countdown timer con efecto pulsante últimos 10s
  - [ ] Palabra revelándose en timeout (fade-in)
- [ ] **Sonidos (Opcional)**

  - [ ] Sonido al tirar dado
  - [ ] Tick-tock del timer
  - [ ] Sonido de victoria
  - [ ] Sonido de timeout

### Manejo de Errores

- [ ] **Error Boundaries en React**

  - [ ] Crear ErrorBoundary component
  - [ ] Envolver app para capturar crashes
  - [ ] Mostrar mensaje amigable
- [ ] **Manejo de Errores de WebSocket**

  - [ ] Escuchar evento `error` del servidor
  - [ ] Mostrar toast con mensaje de error
  - [ ] Retry automático en caso de desconexión
- [ ] **Manejo de Desconexión de Red**

  - [ ] Detectar cuando socket se desconecta
  - [ ] Mostrar banner: "Reconectando..."
  - [ ] Intentar reconectar automáticamente
  - [ ] Sincronizar estado al reconectar

### Testing

- [ ] **Tests Unitarios Backend**

  - [ ] Tests de AuthService (register, login)
  - [ ] Tests de TurnManagerService (generateTurnOrder)
  - [ ] Tests de DiceRollerService
- [ ] **Tests E2E Backend**

  - [ ] Test de flujo completo de auth
  - [ ] Test de crear y unirse a sala
  - [ ] Test de inicio de juego
- [ ] **Tests Frontend (Opcional)**

  - [ ] Tests de componentes con React Testing Library
  - [ ] Tests de hooks custom

### Finalización Fase 5

- [ ] **Code Review**

  - [ ] Revisar código duplicado (DRY)
  - [ ] Verificar nombres descriptivos
  - [ ] Agregar comentarios donde sea necesario
  - [ ] Remover console.logs
- [ ] **Commit de Fase 5**

  - [ ] Crear commit descriptivo
  - [ ] Pushear a GitHub

---

## 📊 Fase 6: Estadísticas (FUTURO - Opcional)

- [ ] **Crear Tabla user_statistics**

  - [ ] Campos: total_games_played, total_games_won, total_words_drawn, etc.
  - [ ] Generar migración
- [ ] **Crear Tabla match_history**

  - [ ] Relacionar gameId con userId
  - [ ] Campos: won, words_drawn, words_guessed, points_contributed
  - [ ] Generar migración
- [ ] **Actualizar Estadísticas al Finalizar Juego**

  - [ ] Incrementar contadores de cada jugador
  - [ ] Guardar registro en match_history
- [ ] **Crear Endpoints de Estadísticas**

  - [ ] GET `/users/:id/stats` - Estadísticas del jugador
  - [ ] GET `/users/:id/history` - Historial de partidas
  - [ ] GET `/leaderboard` - Ranking global
- [ ] **Crear Página de Perfil**

  - [ ] Mostrar estadísticas del usuario
  - [ ] Gráficos (Chart.js o Recharts)
  - [ ] Historial de últimas 10 partidas
- [ ] **Crear Página de Leaderboard**

  - [ ] Top 10 jugadores por win rate
  - [ ] Top 10 por partidas jugadas
  - [ ] Top 10 por palabras adivinadas
- [ ] **Commit de Fase 6**

  - [ ] Crear commit descriptivo
  - [ ] Pushear a GitHub

---

## 🚀 Fase 7: Deploy (Semana 9)

### Backend Deploy

- [ ] **Preparar Backend para Producción**

  - [ ] Crear archivo `.env.production`
  - [ ] Configurar variables de entorno seguras
  - [ ] Habilitar CORS solo para dominio de frontend
- [ ] **Deploy de Base de Datos**

  - [ ] Opción 1: Railway PostgreSQL
  - [ ] Opción 2: Supabase PostgreSQL (gratis)
  - [ ] Opción 3: Render PostgreSQL
  - [ ] Obtener DATABASE_URL
- [ ] **Correr Migraciones en Producción**

  - [ ] Conectar a DB de producción
  - [ ] Ejecutar migraciones
  - [ ] Ejecutar seeders de palabras
- [ ] **Deploy Backend**

  - [ ] Opción 1: Railway
    - [ ] Crear proyecto en Railway
    - [ ] Conectar repositorio GitHub
    - [ ] Configurar variables de entorno
    - [ ] Deploy automático desde main
  - [ ] Opción 2: Render
    - [ ] Crear Web Service
    - [ ] Build command: `pnpm install && pnpm build:backend`
    - [ ] Start command: `pnpm --filter backend start:prod`
  - [ ] Obtener URL del backend
- [ ] **Verificar Backend en Producción**

  - [ ] Probar endpoint `/auth/register`
  - [ ] Probar WebSocket connection

### Frontend Deploy

- [ ] **Configurar Variables de Entorno Frontend**

  - [ ] Crear `.env.production`
  - [ ] VITE_API_URL con URL del backend en producción
  - [ ] VITE_WS_URL con URL WebSocket
- [ ] **Build de Frontend**

  - [ ] `pnpm build:frontend`
  - [ ] Verificar que no hay errores de TypeScript
- [ ] **Deploy Frontend en Vercel**

  - [ ] Crear cuenta en Vercel
  - [ ] Conectar repositorio GitHub
  - [ ] Configurar:
    - [ ] Root directory: `apps/frontend`
    - [ ] Build command: `cd ../.. && pnpm install && pnpm build:frontend`
    - [ ] Output directory: `apps/frontend/dist`
  - [ ] Configurar variables de entorno
  - [ ] Deploy
- [ ] **Configurar Dominio (Opcional)**

  - [ ] Comprar dominio o usar subdominio de Vercel
  - [ ] Configurar DNS
- [ ] **Testing en Producción**

  - [ ] Probar flujo completo end-to-end
  - [ ] Probar con múltiples dispositivos
  - [ ] Verificar WebSockets funcionen

### Finalización

- [ ] **Documentación Final**

  - [ ] Actualizar README.md con:
    - [ ] Link al proyecto live
    - [ ] Screenshots
    - [ ] Instrucciones de uso
    - [ ] Tech stack
  - [ ] Crear CHANGELOG.md
- [ ] **Agregar a Portafolio**

  - [ ] Agregar proyecto a portafolio personal
  - [ ] Agregar a LinkedIn
  - [ ] Compartir en redes
- [ ] **Commit Final**

  - [ ] Tag de release: `git tag v1.0.0`
  - [ ] Push tags: `git push --tags`

---

## 🎉 Proyecto Completado

**Características Finales:**

- ✅ Autenticación con JWT
- ✅ Sistema de salas con códigos
- ✅ Asignación de equipos (manual y aleatoria)
- ✅ Juego completo con turnos rotatorios
- ✅ Timer sincronizado en tiempo real
- ✅ Múltiples condiciones de victoria
- ✅ Historial de partidas
- ✅ Estadísticas de jugadores (opcional)
- ✅ Deploy en producción

**Tecnologías Utilizadas:**

- Frontend: React 19, TypeScript, Vite, Socket.io Client
- Backend: NestJS 11, TypeScript, Socket.io, TypeORM, PostgreSQL
- Autenticación: JWT, Passport, bcrypt
- Monorepo: pnpm workspaces
- Deploy: Vercel (frontend), Railway/Render (backend)

---

## 📝 Notas

- Este roadmap es una guía. Puedes ajustar el orden según tus necesidades.
- Prioriza hacer commits frecuentes (al menos 1 por día de trabajo).
- Testea cada feature antes de pasar a la siguiente.
- Pide feedback a amigos/colegas durante el desarrollo.
