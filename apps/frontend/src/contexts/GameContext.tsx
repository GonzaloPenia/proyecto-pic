import { createContext, useContext, useState, type ReactNode } from 'react';

export type WordCategory = 'acciones' | 'objetos' | 'refranes' | 'costumbres';

export type GameRole = 'drawer' | 'guesser' | 'spectator';

export type GameStatus = 'lobby' | 'active' | 'paused' | 'finished';

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
  timeRemaining: number;
}

export interface TeamState {
  teamId: string;
  teamNumber: 1 | 2;
  score: number;
  categoriesCompleted: WordCategory[];
}

export interface GameState {
  gameId: string;
  roomCode: string;
  status: GameStatus;
  currentRound: number;
  victoryCondition: 'first_to_3' | 'first_to_5' | 'all_categories';
  teams: TeamState[];
  currentTurn: TurnState | null;
}

interface GameContextValue {
  gameState: GameState | null;
  myRole: GameRole;
  currentWord: string | null;
  timeRemaining: number;
  setGameState: (state: GameState | null) => void;
  setMyRole: (role: GameRole) => void;
  setCurrentWord: (word: string | null) => void;
  setTimeRemaining: (time: number) => void;
  rollDice: () => void;
  markGuessed: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [myRole, setMyRole] = useState<GameRole>('spectator');
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);

  const rollDice = () => {
    // This will be implemented by the component that uses socket
    console.log('rollDice called - should be implemented by socket handler');
  };

  const markGuessed = () => {
    // This will be implemented by the component that uses socket
    console.log('markGuessed called - should be implemented by socket handler');
  };

  const resetGame = () => {
    setGameState(null);
    setMyRole('spectator');
    setCurrentWord(null);
    setTimeRemaining(60);
  };

  const value: GameContextValue = {
    gameState,
    myRole,
    currentWord,
    timeRemaining,
    setGameState,
    setMyRole,
    setCurrentWord,
    setTimeRemaining,
    rollDice,
    markGuessed,
    resetGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
