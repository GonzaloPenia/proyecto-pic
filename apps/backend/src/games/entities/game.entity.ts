import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';
import { Team } from './team.entity';
import { GameParticipant } from './game-participant.entity';

export type VictoryCondition = 'first_to_3' | 'first_to_5' | 'all_categories';
export type GameStatus = 'active' | 'paused' | 'finished';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'room_id' })
  @Index('idx_game_room')
  roomId!: string;

  @ManyToOne(() => Room, { eager: true })
  @JoinColumn({ name: 'room_id' })
  room!: Room;

  @Column({
    type: 'enum',
    enum: ['first_to_3', 'first_to_5', 'all_categories'],
    name: 'victory_condition',
    default: 'first_to_3',
  })
  victoryCondition!: VictoryCondition;

  @Column({ type: 'int', name: 'current_round', default: 1 })
  currentRound!: number;

  @Column({
    type: 'enum',
    enum: ['active', 'paused', 'finished'],
    default: 'active',
  })
  status!: GameStatus;

  @Column({ type: 'uuid', nullable: true, name: 'winner_team_id' })
  winnerTeamId!: string | null;

  @ManyToOne(() => Team, { nullable: true })
  @JoinColumn({ name: 'winner_team_id' })
  winnerTeam!: Team | null;

  @OneToMany(() => Team, (team) => team.game)
  teams!: Team[];

  @OneToMany(() => GameParticipant, (participant) => participant.game)
  participants!: GameParticipant[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'finished_at' })
  finishedAt!: Date | null;
}
