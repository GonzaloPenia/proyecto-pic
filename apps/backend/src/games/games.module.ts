import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Game } from './entities/game.entity';
import { Team } from './entities/team.entity';
import { GameParticipant } from './entities/game-participant.entity';
import { GameRound } from './entities/game-round.entity';
import { GameStateService } from './game-state.service';
import { TurnManagerService } from './turn-manager.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Team, GameParticipant, GameRound])],
  providers: [GamesService, GameStateService, TurnManagerService],
  controllers: [GamesController],
  exports: [GamesService, GameStateService, TurnManagerService, TypeOrmModule],
})
export class GamesModule {}
