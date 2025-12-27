import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Game } from './game.entity';
import { GameParticipant } from './game-participant.entity';
import { WordCategory } from '@proyecto-pic/shared';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'game_id' })
  gameId!: string;

  @ManyToOne(() => Game, (game) => game.teams)
  @JoinColumn({ name: 'game_id' })
  game!: Game;

  @Column({ type: 'int', name: 'team_number' })
  teamNumber!: 1 | 2;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name!: string | null;

  @Column({ type: 'int', default: 0 })
  score!: number;

  @Column({
    type: 'simple-array',
    name: 'categories_completed',
    default: '',
  })
  categoriesCompleted!: WordCategory[];

  @OneToMany(() => GameParticipant, (participant) => participant.team)
  participants!: GameParticipant[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;
}
