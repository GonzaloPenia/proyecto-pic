import { TeamState } from './team.types';
import { WordCategory } from './word.types';

export type VictoryCondition = 'first_to_3' | 'first_to_5' | 'all_categories';
export type GameStatus = 'active' | 'paused' | 'finished';

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

export interface Game {
  id: string;
  roomId: string;
  victoryCondition: VictoryCondition;
  currentRound: number;
  status: GameStatus;
  winnerTeamId?: string;
  createdAt: Date;
  finishedAt?: Date;
}

export interface TurnOrder {
  index: number;
  drawerId: string;
  guesserId: string;
  teamId: string;
}
