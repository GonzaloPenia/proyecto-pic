import { GameState, VictoryCondition } from './game.types';
import { TeamState } from './team.types';
import { User } from './user.types';
import { Room } from './room.types';
import { WordCategory } from './word.types';

// Client -> Server Events
export interface ClientToServerEvents {
  join_room: (data: { roomCode: string }) => void;
  leave_room: (data: { roomCode: string }) => void;
  assign_teams: (data: { roomCode: string; assignments: { team1: string[]; team2: string[] } }) => void;
  assign_teams_random: (data: { roomCode: string }) => void;
  start_game: (data: { roomCode: string; victoryCondition: VictoryCondition }) => void;
  roll_dice: (data: { gameId: string }) => void;
  mark_guessed: (data: { gameId: string; roundId: string }) => void;
}

// Server -> Client Events
export interface ServerToClientEvents {
  room_joined: (data: { room: Room }) => void;
  player_joined: (data: { player: User; playerCount: number }) => void;
  player_left: (data: { playerId: string; playerCount: number }) => void;
  teams_assigned: (data: { team1: User[]; team2: User[] }) => void;
  game_started: (data: { gameId: string; victoryCondition: VictoryCondition; initialState: GameState }) => void;
  dice_rolled: (data: { category: WordCategory; animation: { duration: number; finalCategory: WordCategory } }) => void;
  word_assigned: (data: { word: { id: string; text: string; category: WordCategory } }) => void;
  turn_started: (data: {
    roundNumber: number;
    drawer: User;
    guesser: User;
    team: TeamState;
    category: WordCategory;
    startTime: Date;
    duration: number;
  }) => void;
  timer_tick: (data: { timeRemaining: number }) => void;
  word_guessed: (data: { roundId: string; timeElapsed: number; team: TeamState; category: WordCategory }) => void;
  turn_timeout: (data: { roundId: string; word: string }) => void;
  next_turn: (data: { nextDrawer: User; nextGuesser: User; nextTeam: TeamState }) => void;
  game_state_update: (data: {
    scores: { team1: number; team2: number };
    categoriesGuessed: { team1: WordCategory[]; team2: WordCategory[] };
    currentRound: number;
  }) => void;
  game_over: (data: {
    winner: { teamId: string; teamNumber: number; players: User[] };
    finalScores: { team1: number; team2: number };
    victoryCondition: VictoryCondition;
  }) => void;
  player_disconnected: (data: { playerId: string; username: string; shouldPauseGame: boolean }) => void;
  player_reconnected: (data: { playerId: string; username: string; currentGameState?: GameState }) => void;
  error: (data: { code: string; message: string }) => void;
}
