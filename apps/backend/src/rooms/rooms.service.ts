import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  /**
   * Genera un código de sala único de 6 caracteres alfanuméricos
   */
  private generateRoomCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code;
  }

  /**
   * Genera un código de sala único verificando que no exista en la BD
   */
  private async generateUniqueRoomCode(): Promise<string> {
    let code = '';
    let exists = true;
    let attempts = 0;
    const maxAttempts = 10;

    while (exists && attempts < maxAttempts) {
      code = this.generateRoomCode();
      const room = await this.roomsRepository.findOne({
        where: { roomCode: code },
      });
      exists = !!room;
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new ConflictException(
        'No se pudo generar un código único. Intenta nuevamente.',
      );
    }

    return code;
  }

  /**
   * Crea una nueva sala
   */
  async createRoom(
    createRoomDto: CreateRoomDto,
    hostId: string,
  ): Promise<Room> {
    const roomCode = await this.generateUniqueRoomCode();

    const room = this.roomsRepository.create({
      roomCode,
      hostId,
      maxPlayers: createRoomDto.maxPlayers || 8,
      status: 'waiting',
    });

    return await this.roomsRepository.save(room);
  }

  /**
   * Busca una sala por su código
   */
  async findByRoomCode(roomCode: string): Promise<Room> {
    const room = await this.roomsRepository.findOne({
      where: { roomCode },
      relations: ['host'],
    });

    if (!room) {
      throw new NotFoundException(
        `No se encontró una sala con el código ${roomCode}`,
      );
    }

    return room;
  }

  /**
   * Busca una sala por ID
   */
  async findOne(id: string): Promise<Room> {
    const room = await this.roomsRepository.findOne({
      where: { id },
      relations: ['host'],
    });

    if (!room) {
      throw new NotFoundException(`No se encontró la sala con ID ${id}`);
    }

    return room;
  }

  /**
   * Obtiene todas las salas activas (no finalizadas)
   */
  async findActiveRooms(): Promise<Room[]> {
    return await this.roomsRepository.find({
      where: [
        { status: 'waiting' },
        { status: 'team_setup' },
        { status: 'in_progress' },
      ],
      relations: ['host'],
      order: { createdAt: 'DESC' },
    });
  }
}
