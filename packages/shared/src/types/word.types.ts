export type WordCategory = 'Acciones' | 'Objetos' | 'Refranes' | 'Costumbres Argentinas';

export interface Word {
  id: string;
  category: WordCategory;
  wordText: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  createdAt: Date;
}

export interface WordDto {
  id: string;
  text: string;
  category: WordCategory;
}
