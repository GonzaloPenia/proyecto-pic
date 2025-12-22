import { User } from './user.types';

export type RoomStatus = 'waiting' | 'team_setup' | 'in_progress' | 'finished';

export interface Room {
  id: string;
  roomCode: string;
  hostId: string;
  host?: User;
  status: RoomStatus;
  maxPlayers: number;
  players?: User[];
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}

export interface CreateRoomDto {
  maxPlayers?: number;
}

export interface JoinRoomDto {
  roomCode: string;
}
