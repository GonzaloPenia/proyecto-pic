import { Injectable, Logger } from '@nestjs/common';
import { WordCategory } from '../words/entities/word.entity';

export interface PlayerInTurn {
  userId: string;
  username: string;
}

export interface TurnState {
  roundNumber: number;
  drawer: PlayerInTurn;
  guesser: PlayerInTurn;
  category: WordCategory | null;
  wordId: string | null;
  wordText: string | null;
  startedAt: Date | null;
  timeRemaining: number; // segundos
}

export interface TeamState {
  teamId: string;
  teamNumber: 1 | 2;
  score: number;
  categoriesCompleted: WordCategory[];
}

export interface TurnInfo {
  drawerId: string;
  drawerUsername: string;
  guesserId: string;
  guesserUsername: string;
}

export interface GameState {
  gameId: string;
  roomId: string;
  roomCode: string;
  status: 'lobby' | 'active' | 'paused' | 'finished';
  currentRound: number;
  victoryCondition: 'first_to_3' | 'first_to_5' | 'all_categories';
  teams: TeamState[];
  currentTurn: TurnState | null;
  turnOrder: TurnInfo[];
  winnerTeamId: string | null;
}

/**
 * Servicio para mantener el estado en memoria de los juegos activos
 */
@Injectable()
export class GameStateService {
  private readonly logger = new Logger('GameStateService');
  private gameStates: Map<string, GameState> = new Map();

  /**
   * Inicializa un nuevo estado de juego
   */
  initializeGame(
    gameId: string,
    roomId: string,
    roomCode: string,
    teams: TeamState[],
    turnOrder: TurnInfo[],
    victoryCondition: 'first_to_3' | 'first_to_5' | 'all_categories',
  ): GameState {
    const gameState: GameState = {
      gameId,
      roomId,
      roomCode,
      status: 'active',
      currentRound: 0,
      victoryCondition,
      teams,
      currentTurn: null,
      turnOrder,
      winnerTeamId: null,
    };

    this.gameStates.set(gameId, gameState);
    this.logger.log(`Game ${gameId} initialized with ${turnOrder.length} turns`);

    return gameState;
  }

  /**
   * Obtiene el estado actual de un juego
   */
  getGameState(gameId: string): GameState | null {
    return this.gameStates.get(gameId) || null;
  }

  /**
   * Obtiene el estado de un juego por roomCode
   */
  getGameStateByRoomCode(roomCode: string): GameState | null {
    for (const [, gameState] of this.gameStates.entries()) {
      if (gameState.roomCode === roomCode) {
        return gameState;
      }
    }
    return null;
  }

  /**
   * Actualiza el estado de un juego
   */
  updateGameState(gameId: string, updates: Partial<GameState>): GameState | null {
    const gameState = this.gameStates.get(gameId);
    if (!gameState) {
      this.logger.warn(`Attempted to update non-existent game: ${gameId}`);
      return null;
    }

    const updatedState = { ...gameState, ...updates };
    this.gameStates.set(gameId, updatedState);

    return updatedState;
  }

  /**
   * Inicia un nuevo turno
   */
  startTurn(
    gameId: string,
    drawer: PlayerInTurn,
    guesser: PlayerInTurn,
  ): TurnState | null {
    const gameState = this.gameStates.get(gameId);
    if (!gameState) {
      return null;
    }

    const newRound = gameState.currentRound + 1;

    const turnState: TurnState = {
      roundNumber: newRound,
      drawer,
      guesser,
      category: null,
      wordId: null,
      wordText: null,
      startedAt: null,
      timeRemaining: 60, // 60 segundos por turno
    };

    this.updateGameState(gameId, {
      currentRound: newRound,
      currentTurn: turnState,
    });

    this.logger.log(
      `Turn ${newRound} started in game ${gameId}: ${drawer.username} draws, ${guesser.username} guesses`,
    );

    return turnState;
  }

  /**
   * Asigna una categoría y palabra al turno actual
   */
  assignWord(
    gameId: string,
    category: WordCategory,
    wordId: string,
    wordText: string,
  ): TurnState | null {
    const gameState = this.gameStates.get(gameId);
    if (!gameState || !gameState.currentTurn) {
      return null;
    }

    const updatedTurn: TurnState = {
      ...gameState.currentTurn,
      category,
      wordId,
      wordText,
      startedAt: new Date(),
      timeRemaining: 60,
    };

    this.updateGameState(gameId, {
      currentTurn: updatedTurn,
    });

    this.logger.log(
      `Word assigned to game ${gameId}: ${category} - ${wordText}`,
    );

    return updatedTurn;
  }

  /**
   * Actualiza el tiempo restante del turno
   */
  updateTimeRemaining(gameId: string, timeRemaining: number): void {
    const gameState = this.gameStates.get(gameId);
    if (!gameState || !gameState.currentTurn) {
      return;
    }

    const updatedTurn: TurnState = {
      ...gameState.currentTurn,
      timeRemaining,
    };

    this.updateGameState(gameId, {
      currentTurn: updatedTurn,
    });
  }

  /**
   * Incrementa el score de un equipo
   */
  incrementTeamScore(gameId: string, teamId: string): TeamState | null {
    const gameState = this.gameStates.get(gameId);
    if (!gameState) {
      return null;
    }

    const updatedTeams = gameState.teams.map((team) => {
      if (team.teamId === teamId) {
        return {
          ...team,
          score: team.score + 1,
        };
      }
      return team;
    });

    this.updateGameState(gameId, {
      teams: updatedTeams,
    });

    const updatedTeam = updatedTeams.find((t) => t.teamId === teamId);
    if (updatedTeam) {
      this.logger.log(
        `Team ${teamId} score incremented to ${updatedTeam.score} in game ${gameId}`,
      );
    }

    return updatedTeam || null;
  }

  /**
   * Agrega una categoría completada a un equipo
   */
  addCompletedCategory(
    gameId: string,
    teamId: string,
    category: WordCategory,
  ): TeamState | null {
    const gameState = this.gameStates.get(gameId);
    if (!gameState) {
      return null;
    }

    const updatedTeams = gameState.teams.map((team) => {
      if (team.teamId === teamId) {
        if (!team.categoriesCompleted.includes(category)) {
          return {
            ...team,
            categoriesCompleted: [...team.categoriesCompleted, category],
          };
        }
      }
      return team;
    });

    this.updateGameState(gameId, {
      teams: updatedTeams,
    });

    return updatedTeams.find((t) => t.teamId === teamId) || null;
  }

  /**
   * Finaliza el turno actual
   */
  endTurn(gameId: string): void {
    const gameState = this.gameStates.get(gameId);
    if (!gameState) {
      return;
    }

    this.updateGameState(gameId, {
      currentTurn: null,
    });

    this.logger.log(`Turn ended in game ${gameId}`);
  }

  /**
   * Finaliza el juego
   */
  finishGame(gameId: string, winnerTeamId: string | null): GameState | null {
    const gameState = this.gameStates.get(gameId);
    if (!gameState) {
      return null;
    }

    const updatedState = this.updateGameState(gameId, {
      status: 'finished',
      winnerTeamId,
      currentTurn: null,
    });

    this.logger.log(`Game ${gameId} finished. Winner: ${winnerTeamId || 'None'}`);

    return updatedState;
  }

  /**
   * Elimina un juego del estado
   */
  removeGame(gameId: string): void {
    this.gameStates.delete(gameId);
    this.logger.log(`Game ${gameId} removed from state`);
  }

  /**
   * Obtiene todos los juegos activos
   */
  getAllActiveGames(): GameState[] {
    return Array.from(this.gameStates.values()).filter(
      (game) => game.status === 'active',
    );
  }
}
