import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../common/guards/ws-jwt.guard';
import { RoomsService } from '../rooms/rooms.service';
import { GamesService } from '../games/games.service';

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/game',
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('GameGateway');

  // Map para trackear en qué sala está cada socket
  private clientRooms: Map<string, string> = new Map();

  constructor(
    private readonly roomsService: RoomsService,
    private readonly gamesService: GamesService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      // Extraer el token del handshake
      const token =
        client.handshake?.auth?.token ||
        client.handshake?.headers?.authorization?.substring(7) ||
        client.handshake?.query?.token;

      if (!token) {
        this.logger.warn(`Client ${client.id} disconnected: No token provided`);
        client.disconnect();
        return;
      }

      this.logger.log(`Client connected: ${client.id}`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;
    const roomCode = this.clientRooms.get(client.id);

    if (roomCode && user) {
      // Remover jugador del tracking
      this.gamesService.removePlayerFromRoom(roomCode, user.sub);

      // Notificar a otros en la sala que el jugador se fue
      client.to(roomCode).emit('player_left', {
        userId: user.sub,
        username: user.username,
        timestamp: Date.now(),
      });

      this.clientRooms.delete(client.id);
      this.logger.log(
        `User ${user.username} left room ${roomCode} (disconnected)`,
      );
    }

    this.logger.log(
      `Client disconnected: ${client.id}${user ? ` (${user.username})` : ''}`,
    );
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('ping')
  handlePing(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): { event: string; data: any } {
    const user = client.data.user;
    this.logger.log(`Ping from ${user?.username || client.id}`);
    return {
      event: 'pong',
      data: { message: 'pong', timestamp: Date.now() },
    };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string },
  ) {
    const user = client.data.user;

    try {
      // Verificar que la sala existe
      const room = await this.roomsService.findByRoomCode(data.roomCode);

      // Validar que la sala no esté llena
      if (this.gamesService.isRoomFull(data.roomCode, room.maxPlayers)) {
        return {
          success: false,
          message: 'Room is full',
        };
      }

      // Agregar jugador al tracking
      this.gamesService.addPlayerToRoom(data.roomCode, user.sub);

      // Unir al cliente a la room de Socket.io
      await client.join(data.roomCode);

      // Guardar la relación socket-room
      this.clientRooms.set(client.id, data.roomCode);

      this.logger.log(
        `User ${user.username} joined room ${data.roomCode} (${this.gamesService.getPlayerCount(data.roomCode)}/${room.maxPlayers})`,
      );

      // Obtener lista actualizada de jugadores
      const connectedPlayers = this.gamesService.getConnectedPlayers(data.roomCode);

      // Notificar a TODOS en la sala (incluyendo al que se unió)
      this.server.to(data.roomCode).emit('player_joined', {
        userId: user.sub,
        username: user.username,
        email: user.email,
        roomCode: data.roomCode,
        playerCount: connectedPlayers.length,
        maxPlayers: room.maxPlayers,
        timestamp: Date.now(),
      });

      // Retornar confirmación al cliente
      return {
        success: true,
        message: 'Successfully joined room',
        roomCode: data.roomCode,
        roomId: room.id,
        playerCount: connectedPlayers.length,
        maxPlayers: room.maxPlayers,
      };
    } catch (error) {
      this.logger.error(
        `Error joining room: ${error.message}`,
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string },
  ) {
    const user = client.data.user;

    try {
      // Remover jugador del tracking
      this.gamesService.removePlayerFromRoom(data.roomCode, user.sub);

      // Salir de la room de Socket.io
      await client.leave(data.roomCode);

      // Remover la relación socket-room
      this.clientRooms.delete(client.id);

      this.logger.log(
        `User ${user.username} left room ${data.roomCode}`,
      );

      // Notificar a los demás en la sala
      client.to(data.roomCode).emit('player_left', {
        userId: user.sub,
        username: user.username,
        roomCode: data.roomCode,
        playerCount: this.gamesService.getPlayerCount(data.roomCode),
        timestamp: Date.now(),
      });

      // Retornar confirmación al cliente
      return {
        success: true,
        message: 'Successfully left room',
        roomCode: data.roomCode,
      };
    } catch (error) {
      this.logger.error(
        `Error leaving room: ${error.message}`,
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('assign_teams')
  async handleAssignTeams(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string; team1UserIds: string[]; team2UserIds: string[] },
  ) {
    const user = client.data.user;

    try {
      // Verificar que la sala existe
      const room = await this.roomsService.findByRoomCode(data.roomCode);

      // Validar que el usuario es el host
      if (room.hostId !== user.sub) {
        return {
          success: false,
          message: 'Only the host can assign teams',
        };
      }

      // Obtener o crear el juego para esta sala
      let game = await this.gamesService.getGameByRoomId(room.id);

      if (!game) {
        // Si no existe juego, crearlo
        game = await this.gamesService.createGame(room.id);

        // Agregar participantes
        const connectedPlayers = this.gamesService.getConnectedPlayers(data.roomCode);
        for (let i = 0; i < connectedPlayers.length; i++) {
          await this.gamesService.addParticipant(game.id, connectedPlayers[i], i + 1);
        }

        // Recargar game con participantes
        game = await this.gamesService.getGameByRoomId(room.id);
      }

      if (!game) {
        throw new Error('Failed to create or retrieve game');
      }

      // Asignar equipos manualmente
      const result = await this.gamesService.assignTeamsManually(
        game.id,
        data.team1UserIds,
        data.team2UserIds,
      );

      this.logger.log(
        `Teams assigned manually in room ${data.roomCode} by ${user.username}`,
      );

      // Obtener participantes con equipos actualizados
      const participants = await this.gamesService.getParticipantsWithTeams(game.id);

      // Broadcast a todos en la sala
      this.server.to(data.roomCode).emit('teams_assigned', {
        gameId: game.id,
        participants: participants.map(p => ({
          userId: p.userId,
          username: p.user.username,
          teamId: p.teamId,
          teamNumber: p.team?.teamNumber,
          teamName: p.team?.name,
        })),
        timestamp: Date.now(),
      });

      return {
        success: true,
        message: 'Teams assigned successfully',
      };
    } catch (error) {
      this.logger.error(
        `Error assigning teams: ${error.message}`,
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('assign_teams_random')
  async handleAssignTeamsRandom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string },
  ) {
    const user = client.data.user;

    try {
      // Verificar que la sala existe
      const room = await this.roomsService.findByRoomCode(data.roomCode);

      // Validar que el usuario es el host
      if (room.hostId !== user.sub) {
        return {
          success: false,
          message: 'Only the host can assign teams',
        };
      }

      // Obtener o crear el juego para esta sala
      let game = await this.gamesService.getGameByRoomId(room.id);

      if (!game) {
        // Si no existe juego, crearlo
        game = await this.gamesService.createGame(room.id);

        // Agregar participantes
        const connectedPlayers = this.gamesService.getConnectedPlayers(data.roomCode);
        for (let i = 0; i < connectedPlayers.length; i++) {
          await this.gamesService.addParticipant(game.id, connectedPlayers[i], i + 1);
        }

        // Recargar game con participantes
        game = await this.gamesService.getGameByRoomId(room.id);
      }

      if (!game) {
        throw new Error('Failed to create or retrieve game');
      }

      // Asignar equipos aleatoriamente
      await this.gamesService.assignTeamsRandomly(game.id);

      this.logger.log(
        `Teams assigned randomly in room ${data.roomCode} by ${user.username}`,
      );

      // Obtener participantes con equipos actualizados
      const participants = await this.gamesService.getParticipantsWithTeams(game.id);

      // Broadcast a todos en la sala
      this.server.to(data.roomCode).emit('teams_assigned', {
        gameId: game.id,
        participants: participants.map(p => ({
          userId: p.userId,
          username: p.user.username,
          teamId: p.teamId,
          teamNumber: p.team?.teamNumber,
          teamName: p.team?.name,
        })),
        timestamp: Date.now(),
      });

      return {
        success: true,
        message: 'Teams assigned randomly',
      };
    } catch (error) {
      this.logger.error(
        `Error assigning teams randomly: ${error.message}`,
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }
}
