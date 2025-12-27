# 🔌 WebSockets en Proyecto Pictionary

## ¿Qué es WebSocket?

**WebSocket es un protocolo de comunicación bidireccional en tiempo real** entre cliente y servidor. Permite que ambas partes se envíen mensajes instantáneamente sin necesidad de estar preguntando constantemente si hay actualizaciones.

---

## 📊 Comparación: HTTP vs WebSocket

### HTTP tradicional (REST API)

```
Cliente: "¿Hola servidor, hay algo nuevo?"
Servidor: "No"
[espera 1 segundo]

Cliente: "¿Hola servidor, hay algo nuevo?"
Servidor: "No"
[espera 1 segundo]

Cliente: "¿Hola servidor, hay algo nuevo?"
Servidor: "Sí! El jugador X dibujó una línea"
```

❌ **Ineficiente** - El cliente debe preguntar constantemente (polling)
- Consume muchos recursos
- Latencia alta
- Desperdicio de bandwidth

### WebSocket

```
Cliente: [Conexión abierta permanente]
Servidor: "El jugador X dibujó una línea" → Envía automáticamente
Cliente: Recibe instantáneamente
```

✅ **Eficiente** - El servidor puede enviar datos cuando quiera
- Conexión persistente
- Latencia mínima
- Comunicación bidireccional instantánea

---

## 🎮 WebSockets en el Pictionary

### ¿Para qué lo usamos?

WebSocket nos permite **sincronizar el estado del juego en tiempo real** entre todos los jugadores conectados a una sala.

### Casos de uso en el proyecto:

#### 1. **Gestión de Salas**
Cuando algo sucede en una sala, TODOS los jugadores deben verlo al instante:

- ✅ "Juan se unió a la sala" → Todos lo ven
- ✅ "María salió de la sala" → Todos lo ven
- ✅ Lista de jugadores actualizada en tiempo real

#### 2. **Mecánicas del Juego**
Todo el flujo del juego se sincroniza automáticamente:

- ✅ "Host asignó equipos" → Todos ven sus equipos
- ✅ "Pedro tiró el dado → Salió 'Acciones'" → Todos ven la categoría
- ✅ "María marcó '¡Adiviné!'" → Todos ven el punto sumado
- ✅ Timer contando → Todos ven el mismo tiempo

#### 3. **Estado del Juego**
Mantener a todos sincronizados:

- ✅ Turno actual (quién dibuja, quién adivina)
- ✅ Puntuación de equipos
- ✅ Categorías completadas
- ✅ Palabra asignada (solo al dibujante)

---

## 🏗️ Arquitectura en el Proyecto

### Diagrama de Conexiones

```
┌─────────────┐         WebSocket          ┌─────────────┐
│  Jugador 1  │ ←──────────────────────→  │             │
│  (React)    │                            │   Servidor  │
└─────────────┘                            │   NestJS    │
                                           │  (Gateway)  │
┌─────────────┐         WebSocket          │             │
│  Jugador 2  │ ←──────────────────────→  │             │
│  (React)    │                            │             │
└─────────────┘                            └──────┬──────┘
                                                  │
┌─────────────┐         WebSocket                │
│  Jugador 3  │ ←──────────────────────→         │
│  (React)    │                            PostgreSQL
└─────────────┘                          (Persistencia)
```

### Componentes del Sistema

**Backend (NestJS):**
- `GameGateway`: Gestiona las conexiones WebSocket
- `WsJwtGuard`: Autenticación JWT para WebSocket
- `RoomsService`: Lógica de negocio de salas

**Frontend (React):**
- `SocketContext`: Maneja la conexión del cliente
- Componentes que escuchan eventos del servidor

**Base de Datos:**
- Persiste el estado permanente (salas, usuarios, partidas)
- WebSocket maneja el estado temporal/volátil

---

## 🔄 Flujo de Eventos

### Ejemplo: Jugador se une a una sala

```
┌──────────┐                  ┌──────────┐                  ┌──────────┐
│Jugador 1 │                  │ Servidor │                  │Jugador 2 │
└────┬─────┘                  └────┬─────┘                  └────┬─────┘
     │                             │                             │
     │  POST /rooms/join           │                             │
     ├────────────────────────────>│                             │
     │                             │                             │
     │  { room: {...} }            │                             │
     │<────────────────────────────┤                             │
     │                             │                             │
     │  emit('join_room')          │                             │
     ├────────────────────────────>│                             │
     │                             │                             │
     │                             │  emit('player_joined')      │
     │                             ├────────────────────────────>│
     │                             │                             │
     │  emit('player_joined')      │                             │
     │<────────────────────────────┤                             │
     │                             │                             │
```

**Pasos:**
1. Jugador 1 llama REST API para verificar que la sala existe
2. REST API retorna datos de la sala
3. Jugador 1 emite evento WebSocket `join_room`
4. Servidor notifica a TODOS (incluyendo Jugador 1) vía `player_joined`
5. Todos los clientes actualizan su UI automáticamente

---

## 💻 Implementación Técnica

### Backend (NestJS)

#### GameGateway

```typescript
@WebSocketGateway({
  cors: { origin: 'http://localhost:5173' },
  namespace: '/game',
})
export class GameGateway {
  @WebSocketServer()
  server: Server;

  // Escuchar evento del cliente
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_room')
  handleJoinRoom(client: Socket, data: { roomCode: string }) {
    const user = client.data.user; // Usuario autenticado

    // Unir al cliente a una "room" de Socket.io
    client.join(data.roomCode);

    // Notificar a todos en esa room
    this.server.to(data.roomCode).emit('player_joined', {
      userId: user.id,
      username: user.username,
    });
  }
}
```

#### WsJwtGuard

```typescript
@Injectable()
export class WsJwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = this.extractTokenFromHandshake(client);

    const payload = await this.jwtService.verifyAsync(token);
    client.data.user = payload; // Adjuntar usuario al socket

    return true;
  }
}
```

### Frontend (React)

#### SocketContext

```typescript
import { io, Socket } from 'socket.io-client';

const socket = io('http://localhost:3000/game', {
  auth: {
    token: accessToken // JWT del login
  }
});

// Escuchar eventos del servidor
socket.on('player_joined', (data) => {
  console.log(`${data.username} se unió a la sala`);
  // Actualizar estado de la UI
});

// Emitir eventos al servidor
socket.emit('join_room', { roomCode: 'ABC123' });
```

---

## 🔐 Autenticación en WebSocket

### Flujo de Autenticación

1. **Login via REST API:**
   ```
   POST /auth/login
   → { access_token: "eyJhbG..." }
   ```

2. **Conectar WebSocket con token:**
   ```javascript
   const socket = io('ws://localhost:3000/game', {
     auth: { token: accessToken }
   });
   ```

3. **Servidor valida token:**
   - `handleConnection()` verifica que hay token
   - `WsJwtGuard` valida el token JWT en eventos protegidos
   - Usuario disponible en `socket.data.user`

### Formas de enviar el token:

El WsJwtGuard soporta 3 formas:

1. **Auth object (recomendado):**
   ```javascript
   { auth: { token: "eyJhbG..." } }
   ```

2. **Authorization header:**
   ```javascript
   { headers: { authorization: "Bearer eyJhbG..." } }
   ```

3. **Query parameter:**
   ```javascript
   ?token=eyJhbG...
   ```

---

## 📡 Eventos del Juego

### Eventos de Sala

| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `join_room` | Cliente → Servidor | Unirse a una sala |
| `leave_room` | Cliente → Servidor | Salir de una sala |
| `player_joined` | Servidor → Clientes | Nuevo jugador se unió |
| `player_left` | Servidor → Clientes | Jugador salió |

### Eventos de Equipos

| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `assign_teams` | Cliente → Servidor | Host asigna equipos |
| `assign_teams_random` | Cliente → Servidor | Asignar equipos aleatorio |
| `teams_assigned` | Servidor → Clientes | Equipos fueron asignados |

### Eventos del Juego

| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `start_game` | Cliente → Servidor | Host inicia el juego |
| `game_started` | Servidor → Clientes | Juego iniciado |
| `roll_dice` | Cliente → Servidor | Dibujante tira dado |
| `dice_rolled` | Servidor → Clientes | Resultado del dado |
| `word_assigned` | Servidor → Cliente | Palabra asignada (privado) |
| `turn_started` | Servidor → Clientes | Turno comenzó |
| `timer_tick` | Servidor → Clientes | Actualización del timer |
| `mark_guessed` | Cliente → Servidor | Adivinador marcó correcto |
| `word_guessed` | Servidor → Clientes | Palabra adivinada |
| `turn_timeout` | Servidor → Clientes | Se acabó el tiempo |
| `next_turn` | Servidor → Clientes | Siguiente turno |
| `game_over` | Servidor → Clientes | Juego terminado |

---

## 🎯 Ventajas de WebSocket en el Proyecto

### 1. **Experiencia en Tiempo Real**
Los jugadores ven las acciones de otros instantáneamente, creando una experiencia fluida y dinámica.

### 2. **Sincronización Automática**
No hay que refrescar la página ni hacer polling. Todo se actualiza automáticamente.

### 3. **Eficiencia**
Una sola conexión persistente vs múltiples peticiones HTTP.

### 4. **Escalabilidad**
Socket.io incluye soporte para múltiples servidores (con adaptadores Redis).

### 5. **Fallback Automático**
Socket.io detecta automáticamente si WebSocket no está disponible y usa long-polling como fallback.

---

## 🔧 Configuración en el Proyecto

### Variables de Entorno

```env
# Backend
ALLOWED_ORIGINS=http://localhost:5173
JWT_SECRET=tu-super-secreto-jwt

# Frontend
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000/game
```

### CORS

El gateway está configurado para aceptar conexiones del frontend:

```typescript
@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/game',
})
```

---

## 📚 Recursos Adicionales

- **Socket.io Docs:** https://socket.io/docs/
- **NestJS WebSockets:** https://docs.nestjs.com/websockets/gateways
- **WebSocket Protocol:** https://tools.ietf.org/html/rfc6455

---

## 🚀 Próximos Pasos

1. ✅ Gateway configurado
2. ✅ Autenticación JWT implementada
3. ⏳ Implementar eventos de sala (`join_room`, `leave_room`)
4. ⏳ Implementar eventos de equipos
5. ⏳ Implementar eventos del juego (dado, turnos, timer)
6. ⏳ Conectar frontend al WebSocket
