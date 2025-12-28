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
import { ConnectionHandler, RoomHandler, TeamHandler, GameHandler } from './handlers';

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

  constructor(
    private readonly connectionHandler: ConnectionHandler,
    private readonly roomHandler: RoomHandler,
    private readonly teamHandler: TeamHandler,
    private readonly gameHandler: GameHandler,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');

    // Registrar el handler de desconexión de juego
    this.connectionHandler.setGameDisconnectHandler(
      (userId: string, roomCode: string, server: Server) => {
        this.gameHandler.handlePlayerDisconnect(userId, roomCode, server);
      },
    );
  }

  async handleConnection(client: Socket) {
    await this.connectionHandler.handleConnection(client);
  }

  handleDisconnect(client: Socket) {
    this.connectionHandler.handleDisconnect(client, this.server);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('ping')
  handlePing(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): { event: string; data: any } {
    return this.connectionHandler.handlePing(client);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string },
  ) {
    return await this.roomHandler.handleJoinRoom(client, data, this.server);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string },
  ) {
    return await this.roomHandler.handleLeaveRoom(client, data);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('assign_teams')
  async handleAssignTeams(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string; team1UserIds: string[]; team2UserIds: string[] },
  ) {
    return await this.teamHandler.handleAssignTeams(client, data, this.server);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('assign_teams_random')
  async handleAssignTeamsRandom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string },
  ) {
    return await this.teamHandler.handleAssignTeamsRandom(client, data, this.server);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('start_game')
  async handleStartGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string },
  ) {
    return await this.gameHandler.handleStartGame(client, data, this.server);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('roll_dice')
  async handleRollDice(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string },
  ) {
    return await this.gameHandler.handleRollDice(client, data, this.server);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('mark_guessed')
  async handleMarkGuessed(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string },
  ) {
    return await this.gameHandler.handleMarkGuessed(client, data, this.server);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('rejoin_game')
  async handleRejoinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomCode: string },
  ) {
    return await this.gameHandler.handleRejoinGame(client, data, this.server);
  }
}
