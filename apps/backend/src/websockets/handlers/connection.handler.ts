import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GamesService } from '../../games/games.service';

@Injectable()
export class ConnectionHandler {
  private readonly logger = new Logger('ConnectionHandler');
  private clientRooms: Map<string, string> = new Map();
  private gameDisconnectHandler: ((userId: string, roomCode: string, server: Server) => void) | null = null;

  constructor(private readonly gamesService: GamesService) {}

  /**
   * Registra el handler para desconexiones durante el juego
   */
  setGameDisconnectHandler(
    handler: (userId: string, roomCode: string, server: Server) => void,
  ): void {
    this.gameDisconnectHandler = handler;
  }

  /**
   * Maneja la autenticación y conexión de un cliente WebSocket
   */
  async handleConnection(client: Socket): Promise<void> {
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

  /**
   * Maneja la desconexión de un cliente y limpieza de recursos
   */
  handleDisconnect(client: Socket, server: Server): void {
    const user = client.data.user;
    const roomCode = this.clientRooms.get(client.id);

    if (roomCode && user) {
      // Si hay un handler de juego registrado, llamarlo primero
      if (this.gameDisconnectHandler) {
        this.gameDisconnectHandler(user.sub, roomCode, server);
      }

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

  /**
   * Maneja el evento ping para verificar la conexión
   */
  handlePing(client: Socket): { event: string; data: any } {
    const user = client.data.user;
    this.logger.log(`Ping from ${user?.username || client.id}`);
    return {
      event: 'pong',
      data: { message: 'pong', timestamp: Date.now() },
    };
  }

  /**
   * Obtiene el código de sala asociado a un cliente
   */
  getRoomCode(clientId: string): string | undefined {
    return this.clientRooms.get(clientId);
  }

  /**
   * Asocia un cliente con un código de sala
   */
  setClientRoom(clientId: string, roomCode: string): void {
    this.clientRooms.set(clientId, roomCode);
  }

  /**
   * Remueve la asociación de un cliente con su sala
   */
  deleteClientRoom(clientId: string): void {
    this.clientRooms.delete(clientId);
  }
}
