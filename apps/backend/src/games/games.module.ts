import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Game } from './entities/game.entity';
import { Team } from './entities/team.entity';
import { GameParticipant } from './entities/game-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Team, GameParticipant])],
  providers: [GamesService],
  controllers: [GamesController],
  exports: [GamesService, TypeOrmModule],
})
export class GamesModule {}
