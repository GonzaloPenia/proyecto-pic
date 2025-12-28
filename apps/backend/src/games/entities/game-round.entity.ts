import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Game } from './game.entity';
import { User } from '../../users/entities/user.entity';

export type RoundStatus = 'active' | 'guessed' | 'timeout';
export type WordCategory = 'acciones' | 'objetos' | 'refranes' | 'costumbres';

@Entity('game_rounds')
@Index('idx_game_round', ['gameId', 'roundNumber'])
export class GameRound {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'game_id' })
  @Index('idx_round_game')
  gameId!: string;

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game!: Game;

  @Column({ type: 'int', name: 'round_number' })
  roundNumber!: number;

  @Column({ type: 'uuid', name: 'drawer_id' })
  drawerId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'drawer_id' })
  drawer!: User;

  @Column({ type: 'uuid', name: 'guesser_id' })
  guesserId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'guesser_id' })
  guesser!: User;

  @Column({ type: 'uuid', nullable: true, name: 'word_id' })
  wordId!: string | null;

  @Column({
    type: 'enum',
    enum: ['acciones', 'objetos', 'refranes', 'costumbres'],
    nullable: true,
  })
  category!: WordCategory | null;

  @Column({
    type: 'enum',
    enum: ['active', 'guessed', 'timeout'],
    default: 'active',
  })
  status!: RoundStatus;

  @Column({ type: 'boolean', default: false })
  guessed!: boolean;

  @Column({ type: 'int', nullable: true, name: 'time_elapsed' })
  timeElapsed!: number | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'finished_at' })
  finishedAt!: Date | null;
}
