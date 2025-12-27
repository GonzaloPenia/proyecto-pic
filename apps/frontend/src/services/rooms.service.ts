import api from './api';

export interface CreateRoomDto {
  maxPlayers: number;
}

export interface Room {
  id: string;
  roomCode: string;
  hostId: string;
  status: string;
  maxPlayers: number;
  createdAt: string;
}

export const roomsService = {
  async createRoom(data: CreateRoomDto): Promise<Room> {
    const response = await api.post('/rooms/create', data);
    return response.data.room; // El backend devuelve { message, room }
  },

  async joinRoom(roomCode: string): Promise<Room> {
    const response = await api.post('/rooms/join', { roomCode });
    return response.data.room; // El backend devuelve { message, room }
  },

  async getRoomByCode(roomCode: string): Promise<Room> {
    const response = await api.get(`/rooms/${roomCode}`);
    return response.data.room; // El backend devuelve { message, room }
  },
};
