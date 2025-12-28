import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { RoomsModule } from '../rooms/rooms.module';
import { AuthModule } from '../auth/auth.module';
import { GamesModule } from '../games/games.module';
import { WordsModule } from '../words/words.module';
import { ConnectionHandler, RoomHandler, TeamHandler, GameHandler } from './handlers';

@Module({
  imports: [RoomsModule, AuthModule, GamesModule, WordsModule],
  providers: [
    GameGateway,
    ConnectionHandler,
    RoomHandler,
    TeamHandler,
    GameHandler,
  ],
  exports: [GameGateway],
})
export class WebsocketsModule {}
