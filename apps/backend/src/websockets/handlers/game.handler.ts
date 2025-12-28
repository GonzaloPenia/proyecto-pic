import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RoomsService } from '../../rooms/rooms.service';
import { GamesService } from '../../games/games.service';
import { GameStateService, TeamState } from '../../games/game-state.service';
import { TurnManagerService, PlayerInfo } from '../../games/turn-manager.service';
import { WordsService } from '../../words/words.service';
import { DiceRollerService } from '../../words/dice-roller.service';
import { WordCategory } from '../../words/entities/word.entity';

export interface StartGameData {
  roomCode: string;
}

export interface RollDiceData {
  roomCode: string;
}

export interface MarkGuessedData {
  roomCode: string;
}

export interface GameResponse {
  success: boolean;
  message: string;
}

@Injectable()
export class GameHandler {
  private readonly logger = new Logger('GameHandler');
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private pausedTimers: Map<string, number> = new Map(); // Stores remaining time when paused

  constructor(
    private readonly roomsService: RoomsService,
    private readonly gamesService: GamesService,
    private readonly gameStateService: GameStateService,
    private readonly turnManagerService: TurnManagerService,
    private readonly wordsService: WordsService,
    private readonly diceRollerService: DiceRollerService,
  ) {}

  /**
   * Inicia el juego
   */
  async handleStartGame(
    client: Socket,
    data: StartGameData,
    server: Server,
  ): Promise<GameResponse> {
    const user = client.data.user;

    try {
      // Verificar que la sala existe
      const room = await this.roomsService.findByRoomCode(data.roomCode);

      // Validar que el usuario es el host
      if (room.hostId !== user.sub) {
        return {
          success: false,
          message: 'Only the host can start the game',
        };
      }

      // Verificar que existe un juego con equipos asignados
      let game = await this.gamesService.getGameByRoomId(room.id);
      if (!game) {
        return {
          success: false,
          message: 'Teams must be assigned before starting the game',
        };
      }

      // Obtener participantes con sus equipos
      const participants = await this.gamesService.getParticipantsWithTeams(game.id);

      const team1Players: PlayerInfo[] = [];
      const team2Players: PlayerInfo[] = [];

      // Obtener todos los sockets para mapear userIds a usernames
      const allSockets = await server.fetchSockets();

      participants.forEach((p) => {
        const playerSocket = allSockets.find((s) => s.data?.user?.sub === p.userId);
        const playerInfo: PlayerInfo = {
          userId: p.userId,
          username: playerSocket?.data?.user?.username || 'Unknown',
          teamNumber: p.team?.teamNumber || 1,
        };

        if (p.team?.teamNumber === 1) {
          team1Players.push(playerInfo);
        } else if (p.team?.teamNumber === 2) {
          team2Players.push(playerInfo);
        }
      });

      // Validar que ambos equipos tienen al menos 2 jugadores
      if (team1Players.length < 2 || team2Players.length < 2) {
        return {
          success: false,
          message: 'Each team must have at least 2 players to start',
        };
      }

      // Generar orden de turnos
      const turnOrder = this.turnManagerService.generateTurnOrder(
        team1Players,
        team2Players,
      );

      // Crear estados de equipos
      const teams: TeamState[] = game.teams.map((team) => ({
        teamId: team.id,
        teamNumber: team.teamNumber,
        score: 0,
        categoriesCompleted: [],
      }));

      // Inicializar estado del juego
      const gameState = this.gameStateService.initializeGame(
        game.id,
        room.id,
        data.roomCode,
        teams,
        turnOrder,
        game.victoryCondition,
      );

      this.logger.log(`Game ${game.id} started in room ${data.roomCode}`);

      // Broadcast a todos en la sala
      server.to(data.roomCode).emit('game_started', {
        gameId: game.id,
        victoryCondition: game.victoryCondition,
        teams: gameState.teams,
        totalTurns: turnOrder.length,
        timestamp: Date.now(),
      });

      // Iniciar el primer turno automáticamente
      setTimeout(() => {
        this.startNextTurn(game.id, data.roomCode, server);
      }, 2000);

      return {
        success: true,
        message: 'Game started successfully',
      };
    } catch (error) {
      this.logger.error(`Error starting game: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Tira el dado para seleccionar categoría
   */
  async handleRollDice(
    client: Socket,
    data: RollDiceData,
    server: Server,
  ): Promise<GameResponse> {
    const user = client.data.user;

    try {
      const gameState = this.gameStateService.getGameStateByRoomCode(data.roomCode);
      if (!gameState) {
        return {
          success: false,
          message: 'No active game found',
        };
      }

      // Validar que es el turno del usuario y que es el dibujante
      if (!gameState.currentTurn) {
        return {
          success: false,
          message: 'No active turn',
        };
      }

      if (gameState.currentTurn.drawer.userId !== user.sub) {
        return {
          success: false,
          message: 'Only the current drawer can roll the dice',
        };
      }

      if (gameState.currentTurn.category !== null) {
        return {
          success: false,
          message: 'Category already selected for this turn',
        };
      }

      // Tirar el dado
      const category = this.diceRollerService.roll();

      // Broadcast animación del dado a todos
      server.to(data.roomCode).emit('dice_rolling', {
        duration: 2000,
        timestamp: Date.now(),
      });

      // Después de la animación, asignar la categoría y palabra
      setTimeout(async () => {
        // Obtener palabra aleatoria de la categoría
        const word = await this.wordsService.getRandomWordByCategory(category);

        if (!word) {
          server.to(data.roomCode).emit('error', {
            message: `No words found for category: ${category}`,
          });
          return;
        }

        // Asignar palabra al turno
        this.gameStateService.assignWord(
          gameState.gameId,
          category,
          word.id,
          word.wordText,
        );

        // Broadcast categoría a todos
        server.to(data.roomCode).emit('dice_rolled', {
          category,
          timestamp: Date.now(),
        });

        // Enviar palabra SOLO al dibujante
        const drawerSocket = Array.from(server.sockets.sockets.values()).find(
          (s) => s.data?.user?.sub === gameState.currentTurn?.drawer.userId,
        );

        if (drawerSocket) {
          drawerSocket.emit('word_assigned', {
            word: word.wordText,
            category,
            timestamp: Date.now(),
          });
        }

        // Iniciar timer del turno
        this.startTurnTimer(gameState.gameId, data.roomCode, server);

        this.logger.log(
          `Dice rolled in game ${gameState.gameId}: ${category} - ${word.wordText}`,
        );
      }, 2000);

      return {
        success: true,
        message: 'Dice rolled',
      };
    } catch (error) {
      this.logger.error(`Error rolling dice: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Marca la palabra como adivinada
   */
  async handleMarkGuessed(
    client: Socket,
    data: MarkGuessedData,
    server: Server,
  ): Promise<GameResponse> {
    const user = client.data.user;

    try {
      const gameState = this.gameStateService.getGameStateByRoomCode(data.roomCode);
      if (!gameState) {
        return {
          success: false,
          message: 'No active game found',
        };
      }

      if (!gameState.currentTurn) {
        return {
          success: false,
          message: 'No active turn',
        };
      }

      // Validar que es el adivinador
      if (gameState.currentTurn.guesser.userId !== user.sub) {
        return {
          success: false,
          message: 'Only the current guesser can mark as guessed',
        };
      }

      // Detener el timer
      this.stopTurnTimer(gameState.gameId);

      const timeElapsed = 60 - gameState.currentTurn.timeRemaining;

      // Determinar a qué equipo pertenece el adivinador
      const guesserTeam = gameState.teams.find((team) => {
        // Aquí necesitamos verificar qué equipo tiene a este jugador
        // Por ahora asumimos que el drawer y guesser son del mismo equipo
        return true; // TODO: mejorar esta lógica
      });

      if (!guesserTeam) {
        return {
          success: false,
          message: 'Team not found',
        };
      }

      // Incrementar score
      this.gameStateService.incrementTeamScore(gameState.gameId, guesserTeam.teamId);

      // Agregar categoría completada si no existe
      if (gameState.currentTurn.category) {
        this.gameStateService.addCompletedCategory(
          gameState.gameId,
          guesserTeam.teamId,
          gameState.currentTurn.category,
        );
      }

      // Obtener estado actualizado
      const updatedState = this.gameStateService.getGameState(gameState.gameId);

      // Broadcast que adivinaron
      server.to(data.roomCode).emit('word_guessed', {
        guesserId: user.sub,
        guesserUsername: user.username,
        word: gameState.currentTurn.wordText,
        category: gameState.currentTurn.category,
        timeElapsed,
        teamId: guesserTeam.teamId,
        teamNumber: guesserTeam.teamNumber,
        newScore: guesserTeam.score + 1,
        timestamp: Date.now(),
      });

      this.logger.log(
        `Word guessed in game ${gameState.gameId} by ${user.username} in ${timeElapsed}s`,
      );

      // Verificar condición de victoria
      const winner = this.checkVictoryCondition(updatedState!);

      if (winner) {
        this.finishGame(gameState.gameId, data.roomCode, winner.teamId, server);
      } else {
        // Continuar al siguiente turno después de 3 segundos
        setTimeout(() => {
          this.startNextTurn(gameState.gameId, data.roomCode, server);
        }, 3000);
      }

      return {
        success: true,
        message: 'Word guessed!',
      };
    } catch (error) {
      this.logger.error(`Error marking guessed: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Inicia el timer del turno
   */
  private startTurnTimer(gameId: string, roomCode: string, server: Server): void {
    // Limpiar timer existente si hay uno
    this.stopTurnTimer(gameId);

    let timeRemaining = 60;

    const timer = setInterval(() => {
      timeRemaining--;

      // Actualizar estado
      this.gameStateService.updateTimeRemaining(gameId, timeRemaining);

      // Broadcast tick
      server.to(roomCode).emit('timer_tick', {
        timeRemaining,
        timestamp: Date.now(),
      });

      // Si llega a 0, timeout
      if (timeRemaining <= 0) {
        this.handleTurnTimeout(gameId, roomCode, server);
      }
    }, 1000);

    this.timers.set(gameId, timer);
  }

  /**
   * Detiene el timer del turno
   */
  private stopTurnTimer(gameId: string): void {
    const timer = this.timers.get(gameId);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(gameId);
    }
  }

  /**
   * Maneja el timeout del turno
   */
  private handleTurnTimeout(gameId: string, roomCode: string, server: Server): void {
    this.stopTurnTimer(gameId);

    const gameState = this.gameStateService.getGameState(gameId);
    if (!gameState || !gameState.currentTurn) {
      return;
    }

    // Broadcast timeout
    server.to(roomCode).emit('turn_timeout', {
      word: gameState.currentTurn.wordText,
      category: gameState.currentTurn.category,
      drawer: gameState.currentTurn.drawer,
      guesser: gameState.currentTurn.guesser,
      timestamp: Date.now(),
    });

    this.logger.log(`Turn timeout in game ${gameId}`);

    // Continuar al siguiente turno
    setTimeout(() => {
      this.startNextTurn(gameId, roomCode, server);
    }, 3000);
  }

  /**
   * Inicia el siguiente turno
   */
  private startNextTurn(gameId: string, roomCode: string, server: Server): void {
    const gameState = this.gameStateService.getGameState(gameId);
    if (!gameState) {
      return;
    }

    // Obtener índice del turno actual
    let currentIndex = -1;
    if (gameState.currentTurn) {
      currentIndex = this.turnManagerService.getCurrentTurnIndex(
        gameState.currentTurn.drawer.userId,
        gameState.currentTurn.guesser.userId,
        gameState.turnOrder,
      );
    }

    // Obtener siguiente turno
    const nextTurn = this.turnManagerService.getNextTurn(
      currentIndex,
      gameState.turnOrder,
    );

    if (!nextTurn) {
      this.logger.error(`No next turn found for game ${gameId}`);
      return;
    }

    // Iniciar turno
    const turnState = this.gameStateService.startTurn(
      gameId,
      {
        userId: nextTurn.drawerId,
        username: nextTurn.drawerUsername,
      },
      {
        userId: nextTurn.guesserId,
        username: nextTurn.guesserUsername,
      },
    );

    if (!turnState) {
      return;
    }

    // Broadcast nuevo turno
    server.to(roomCode).emit('turn_started', {
      roundNumber: turnState.roundNumber,
      drawer: turnState.drawer,
      guesser: turnState.guesser,
      timestamp: Date.now(),
    });

    this.logger.log(
      `Turn ${turnState.roundNumber} started in game ${gameId}: ${turnState.drawer.username} draws, ${turnState.guesser.username} guesses`,
    );
  }

  /**
   * Verifica las condiciones de victoria
   */
  private checkVictoryCondition(gameState: any): TeamState | null {
    if (!gameState) return null;

    const { victoryCondition, teams } = gameState;

    for (const team of teams) {
      // Condición: first_to_3
      if (victoryCondition === 'first_to_3' && team.score >= 3) {
        return team;
      }

      // Condición: first_to_5
      if (victoryCondition === 'first_to_5' && team.score >= 5) {
        return team;
      }

      // Condición: all_categories
      if (
        victoryCondition === 'all_categories' &&
        team.categoriesCompleted.length >= 4
      ) {
        return team;
      }
    }

    return null;
  }

  /**
   * Finaliza el juego
   */
  private finishGame(
    gameId: string,
    roomCode: string,
    winnerTeamId: string,
    server: Server,
  ): void {
    this.stopTurnTimer(gameId);

    const gameState = this.gameStateService.finishGame(gameId, winnerTeamId);

    if (!gameState) {
      return;
    }

    const winnerTeam = gameState.teams.find((t) => t.teamId === winnerTeamId);

    // Broadcast fin del juego
    server.to(roomCode).emit('game_over', {
      winnerTeamId,
      winnerTeamNumber: winnerTeam?.teamNumber,
      finalScores: gameState.teams.map((t) => ({
        teamId: t.teamId,
        teamNumber: t.teamNumber,
        score: t.score,
        categoriesCompleted: t.categoriesCompleted,
      })),
      totalRounds: gameState.currentRound,
      timestamp: Date.now(),
    });

    this.logger.log(`Game ${gameId} finished. Winner: Team ${winnerTeam?.teamNumber}`);

    // TODO: Guardar resultados en la base de datos
  }

  /**
   * Maneja la desconexión de un jugador durante el juego
   */
  handlePlayerDisconnect(userId: string, roomCode: string, server: Server): void {
    const gameState = this.gameStateService.getGameStateByRoomCode(roomCode);

    if (!gameState || gameState.status !== 'active') {
      return;
    }

    // Verificar si el jugador desconectado es parte del turno actual
    if (!gameState.currentTurn) {
      return;
    }

    const isDrawer = gameState.currentTurn.drawer.userId === userId;
    const isGuesser = gameState.currentTurn.guesser.userId === userId;

    if (isDrawer || isGuesser) {
      // Pausar el juego y el timer
      this.pauseGame(gameState.gameId, roomCode, server);

      const disconnectedRole = isDrawer ? 'dibujante' : 'adivinador';
      const disconnectedUsername = isDrawer
        ? gameState.currentTurn.drawer.username
        : gameState.currentTurn.guesser.username;

      this.logger.log(
        `Player ${disconnectedUsername} (${disconnectedRole}) disconnected from game ${gameState.gameId}`,
      );

      // Broadcast a todos que el juego está en pausa
      server.to(roomCode).emit('game_paused', {
        reason: 'player_disconnected',
        disconnectedUserId: userId,
        disconnectedUsername,
        disconnectedRole,
        message: `El juego está en pausa. ${disconnectedUsername} (${disconnectedRole}) se ha desconectado.`,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Maneja la reconexión de un jugador al juego
   */
  async handleRejoinGame(
    client: Socket,
    data: { roomCode: string },
    server: Server,
  ): Promise<GameResponse> {
    const user = client.data.user;

    try {
      const gameState = this.gameStateService.getGameStateByRoomCode(data.roomCode);

      if (!gameState) {
        return {
          success: false,
          message: 'No active game found',
        };
      }

      // Unir al socket a la sala
      await client.join(data.roomCode);

      // Enviar el estado completo del juego al jugador que se reconecta
      client.emit('game_state_sync', {
        gameId: gameState.gameId,
        status: gameState.status,
        currentRound: gameState.currentRound,
        victoryCondition: gameState.victoryCondition,
        teams: gameState.teams,
        currentTurn: gameState.currentTurn,
        timestamp: Date.now(),
      });

      // Verificar si el juego estaba pausado esperando a este jugador
      if (gameState.status === 'paused' && gameState.currentTurn) {
        const wasDrawer = gameState.currentTurn.drawer.userId === user.sub;
        const wasGuesser = gameState.currentTurn.guesser.userId === user.sub;

        if (wasDrawer || wasGuesser) {
          const reconnectedRole = wasDrawer ? 'dibujante' : 'adivinador';

          this.logger.log(
            `Player ${user.username} (${reconnectedRole}) reconnected to game ${gameState.gameId}`,
          );

          // Broadcast que el jugador se reconectó
          server.to(data.roomCode).emit('player_reconnected', {
            userId: user.sub,
            username: user.username,
            role: reconnectedRole,
            timestamp: Date.now(),
          });

          // Reanudar el juego
          this.resumeGame(gameState.gameId, data.roomCode, server);
        }
      }

      return {
        success: true,
        message: 'Rejoined game successfully',
      };
    } catch (error) {
      this.logger.error(`Error rejoining game: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Pausa el juego
   */
  private pauseGame(gameId: string, roomCode: string, server: Server): void {
    const gameState = this.gameStateService.getGameState(gameId);
    if (!gameState) {
      return;
    }

    // Guardar el tiempo restante antes de detener el timer
    if (gameState.currentTurn) {
      this.pausedTimers.set(gameId, gameState.currentTurn.timeRemaining);
    }

    // Detener el timer
    this.stopTurnTimer(gameId);

    // Actualizar estado a pausado
    this.gameStateService.updateGameState(gameId, {
      status: 'paused',
    });

    this.logger.log(`Game ${gameId} paused`);
  }

  /**
   * Reanuda el juego
   */
  private resumeGame(gameId: string, roomCode: string, server: Server): void {
    const gameState = this.gameStateService.getGameState(gameId);
    if (!gameState) {
      return;
    }

    // Actualizar estado a activo
    this.gameStateService.updateGameState(gameId, {
      status: 'active',
    });

    // Broadcast que el juego se reanudó
    server.to(roomCode).emit('game_resumed', {
      timestamp: Date.now(),
    });

    // Si hay un turno activo con palabra asignada, reanudar el timer
    if (gameState.currentTurn && gameState.currentTurn.wordText) {
      const savedTime = this.pausedTimers.get(gameId);
      if (savedTime !== undefined) {
        this.resumeTurnTimer(gameId, roomCode, server, savedTime);
        this.pausedTimers.delete(gameId);
      }
    }

    this.logger.log(`Game ${gameId} resumed`);
  }

  /**
   * Reanuda el timer del turno desde un tiempo específico
   */
  private resumeTurnTimer(
    gameId: string,
    roomCode: string,
    server: Server,
    startTime: number,
  ): void {
    // Limpiar timer existente si hay uno
    this.stopTurnTimer(gameId);

    let timeRemaining = startTime;

    const timer = setInterval(() => {
      timeRemaining--;

      // Actualizar estado
      this.gameStateService.updateTimeRemaining(gameId, timeRemaining);

      // Broadcast tick
      server.to(roomCode).emit('timer_tick', {
        timeRemaining,
        timestamp: Date.now(),
      });

      // Si llega a 0, timeout
      if (timeRemaining <= 0) {
        this.handleTurnTimeout(gameId, roomCode, server);
      }
    }, 1000);

    this.timers.set(gameId, timer);

    this.logger.log(`Timer resumed for game ${gameId} with ${startTime} seconds remaining`);
  }
}
