import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @CurrentUser() user: User,
  ) {
    const room = await this.roomsService.createRoom(createRoomDto, user.id);
    return {
      message: 'Sala creada exitosamente',
      room: {
        id: room.id,
        roomCode: room.roomCode,
        hostId: room.hostId,
        status: room.status,
        maxPlayers: room.maxPlayers,
        createdAt: room.createdAt,
      },
    };
  }

  @Post('join')
  @HttpCode(HttpStatus.OK)
  async joinRoom(
    @Body() joinRoomDto: JoinRoomDto,
    @CurrentUser() user: User,
  ) {
    const room = await this.roomsService.findByRoomCode(joinRoomDto.roomCode);
    return {
      message: 'Te uniste a la sala exitosamente',
      room: {
        id: room.id,
        roomCode: room.roomCode,
        hostId: room.hostId,
        host: {
          id: room.host.id,
          username: room.host.username,
        },
        status: room.status,
        maxPlayers: room.maxPlayers,
        createdAt: room.createdAt,
      },
    };
  }

  @Get('active')
  async getActiveRooms() {
    const rooms = await this.roomsService.findActiveRooms();
    return {
      message: 'Salas activas obtenidas exitosamente',
      rooms: rooms.map((room) => ({
        id: room.id,
        roomCode: room.roomCode,
        hostId: room.hostId,
        host: {
          id: room.host.id,
          username: room.host.username,
        },
        status: room.status,
        maxPlayers: room.maxPlayers,
        createdAt: room.createdAt,
      })),
    };
  }

  @Get(':roomCode')
  async getRoomByCode(@Param('roomCode') roomCode: string) {
    const room = await this.roomsService.findByRoomCode(roomCode);
    return {
      message: 'Sala encontrada',
      room: {
        id: room.id,
        roomCode: room.roomCode,
        hostId: room.hostId,
        host: {
          id: room.host.id,
          username: room.host.username,
        },
        status: room.status,
        maxPlayers: room.maxPlayers,
        createdAt: room.createdAt,
      },
    };
  }
}
