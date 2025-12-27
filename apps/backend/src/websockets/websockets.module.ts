import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { RoomsModule } from '../rooms/rooms.module';
import { AuthModule } from '../auth/auth.module';
import { GamesModule } from '../games/games.module';

@Module({
  imports: [RoomsModule, AuthModule, GamesModule],
  providers: [GameGateway],
  exports: [GameGateway],
})
export class WebsocketsModule {}
