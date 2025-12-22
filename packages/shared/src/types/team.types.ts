import { WordCategory } from './word.types';

export interface Team {
  id: string;
  gameId: string;
  teamNumber: 1 | 2;
  name?: string;
  score: number;
  categoriesCompleted: WordCategory[];
  createdAt: Date;
}

export interface TeamState {
  id: string;
  teamNumber: 1 | 2;
  score: number;
  playerIds: string[];
  categoriesGuessed: WordCategory[];
}
