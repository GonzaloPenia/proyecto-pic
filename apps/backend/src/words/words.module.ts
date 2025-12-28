import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entities/word.entity';
import { WordsService } from './words.service';
import { DiceRollerService } from './dice-roller.service';

@Module({
  imports: [TypeOrmModule.forFeature([Word])],
  providers: [WordsService, DiceRollerService],
  exports: [WordsService, DiceRollerService],
})
export class WordsModule {}
