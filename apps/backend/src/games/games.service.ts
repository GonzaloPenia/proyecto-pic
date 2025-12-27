import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { Team } from './entities/team.entity';
import { GameParticipant } from './entities/game-participant.entity';

@Injectable()
export class GamesService {
  // Map para mantener jugadores conectados en cada sala (en memoria)
  // Key: roomCode, Value: Set de userIds
  private connectedPlayers: Map<string, Set<string>> = new Map();

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(GameParticipant)
    private readonly participantRepository: Repository<GameParticipant>,
  ) {}

  // ===== TRACKING DE JUGADORES =====

  /**
   * Agregar jugador a la lista de conectados en una sala
   */
  addPlayerToRoom(roomCode: string, userId: string): void {
    if (!this.connectedPlayers.has(roomCode)) {
      this.connectedPlayers.set(roomCode, new Set());
    }
    this.connectedPlayers.get(roomCode)!.add(userId);
  }

  /**
   * Remover jugador de la lista de conectados en una sala
   */
  removePlayerFromRoom(roomCode: string, userId: string): void {
    const players = this.connectedPlayers.get(roomCode);
    if (players) {
      players.delete(userId);
      if (players.size === 0) {
        this.connectedPlayers.delete(roomCode);
      }
    }
  }

  /**
   * Obtener jugadores conectados en una sala
   */
  getConnectedPlayers(roomCode: string): string[] {
    const players = this.connectedPlayers.get(roomCode);
    return players ? Array.from(players) : [];
  }

  /**
   * Obtener cantidad de jugadores conectados
   */
  getPlayerCount(roomCode: string): number {
    return this.connectedPlayers.get(roomCode)?.size || 0;
  }

  /**
   * Validar si la sala está llena
   */
  isRoomFull(roomCode: string, maxPlayers: number): boolean {
    return this.getPlayerCount(roomCode) >= maxPlayers;
  }

  // ===== GESTIÓN DE JUEGOS Y EQUIPOS =====

  /**
   * Crear un nuevo juego para una sala
   */
  async createGame(roomId: string, victoryCondition: 'first_to_3' | 'first_to_5' | 'all_categories' = 'first_to_3'): Promise<Game> {
    const game = this.gameRepository.create({
      roomId,
      victoryCondition,
      status: 'active',
      currentRound: 1,
    });

    const savedGame = await this.gameRepository.save(game);

    // Crear los dos equipos
    await this.createTeamsForGame(savedGame.id);

    return savedGame;
  }

  /**
   * Crear los dos equipos para un juego
   */
  async createTeamsForGame(gameId: string): Promise<Team[]> {
    const team1 = this.teamRepository.create({
      gameId,
      teamNumber: 1,
      name: 'Azul',
      score: 0,
      categoriesCompleted: [],
    });

    const team2 = this.teamRepository.create({
      gameId,
      teamNumber: 2,
      name: 'Blanco',
      score: 0,
      categoriesCompleted: [],
    });

    return await this.teamRepository.save([team1, team2]);
  }

  /**
   * Agregar participante a un juego
   */
  async addParticipant(gameId: string, userId: string, joinOrder: number): Promise<GameParticipant> {
    const participant = this.participantRepository.create({
      gameId,
      userId,
      joinOrder,
      isConnected: true,
    });

    return await this.participantRepository.save(participant);
  }

  /**
   * Obtener juego por roomId
   */
  async getGameByRoomId(roomId: string): Promise<Game | null> {
    return await this.gameRepository.findOne({
      where: { roomId },
      relations: ['teams', 'participants', 'participants.user', 'participants.team'],
    });
  }

  /**
   * Asignar jugadores a equipos de forma manual
   */
  async assignTeamsManually(
    gameId: string,
    team1UserIds: string[],
    team2UserIds: string[],
  ): Promise<{ team1: GameParticipant[]; team2: GameParticipant[] }> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['teams', 'participants'],
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const teams = game.teams;
    if (teams.length !== 2) {
      throw new BadRequestException('Game must have exactly 2 teams');
    }

    const team1 = teams.find(t => t.teamNumber === 1);
    const team2 = teams.find(t => t.teamNumber === 2);

    if (!team1 || !team2) {
      throw new BadRequestException('Teams not found');
    }

    // Asignar jugadores al equipo 1
    const team1Participants = await Promise.all(
      team1UserIds.map(async (userId) => {
        const participant = game.participants.find(p => p.userId === userId);
        if (!participant) {
          throw new NotFoundException(`Participant with userId ${userId} not found`);
        }
        participant.teamId = team1!.id;
        return await this.participantRepository.save(participant);
      }),
    );

    // Asignar jugadores al equipo 2
    const team2Participants = await Promise.all(
      team2UserIds.map(async (userId) => {
        const participant = game.participants.find(p => p.userId === userId);
        if (!participant) {
          throw new NotFoundException(`Participant with userId ${userId} not found`);
        }
        participant.teamId = team2!.id;
        return await this.participantRepository.save(participant);
      }),
    );

    return { team1: team1Participants, team2: team2Participants };
  }

  /**
   * Asignar jugadores a equipos de forma aleatoria
   */
  async assignTeamsRandomly(gameId: string): Promise<{ team1: GameParticipant[]; team2: GameParticipant[] }> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['teams', 'participants'],
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const teams = game.teams;
    if (teams.length !== 2) {
      throw new BadRequestException('Game must have exactly 2 teams');
    }

    // Obtener participantes y mezclarlos aleatoriamente
    const participants = [...game.participants];
    this.shuffleArray(participants);

    // Dividir en dos equipos equitativos
    const midpoint = Math.ceil(participants.length / 2);
    const team1Participants = participants.slice(0, midpoint);
    const team2Participants = participants.slice(midpoint);

    const team1 = teams.find(t => t.teamNumber === 1);
    const team2 = teams.find(t => t.teamNumber === 2);

    if (!team1 || !team2) {
      throw new BadRequestException('Teams not found');
    }

    // Asignar al equipo 1
    const savedTeam1 = await Promise.all(
      team1Participants.map(async (participant) => {
        participant.teamId = team1!.id;
        return await this.participantRepository.save(participant);
      }),
    );

    // Asignar al equipo 2
    const savedTeam2 = await Promise.all(
      team2Participants.map(async (participant) => {
        participant.teamId = team2!.id;
        return await this.participantRepository.save(participant);
      }),
    );

    return { team1: savedTeam1, team2: savedTeam2 };
  }

  /**
   * Obtener participantes de un juego con sus equipos
   */
  async getParticipantsWithTeams(gameId: string): Promise<GameParticipant[]> {
    return await this.participantRepository.find({
      where: { gameId },
      relations: ['user', 'team'],
      order: { joinOrder: 'ASC' },
    });
  }

  /**
   * Utilidad: Mezclar array aleatoriamente (Fisher-Yates shuffle)
   */
  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
