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
import { Team } from './team.entity';

@Entity('game_participants')
@Index('idx_game_user', ['gameId', 'userId'], { unique: true })
export class GameParticipant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'game_id' })
  gameId!: string;

  @ManyToOne(() => Game, (game) => game.participants)
  @JoinColumn({ name: 'game_id' })
  game!: Game;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'uuid', nullable: true, name: 'team_id' })
  teamId!: string | null;

  @ManyToOne(() => Team, (team) => team.participants, { nullable: true })
  @JoinColumn({ name: 'team_id' })
  team!: Team | null;

  @Column({ type: 'int', name: 'join_order' })
  joinOrder!: number;

  @Column({ type: 'boolean', default: true, name: 'is_connected' })
  isConnected!: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'disconnected_at' })
  disconnectedAt!: Date | null;
}
