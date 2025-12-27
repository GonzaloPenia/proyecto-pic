import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type RoomStatus = 'waiting' | 'team_setup' | 'in_progress' | 'finished';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_room_code', { unique: true })
  @Column({ type: 'varchar', length: 6, unique: true, name: 'room_code' })
  roomCode: string;

  @Column({ type: 'uuid', name: 'host_id' })
  hostId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'host_id' })
  host: User;

  @Column({
    type: 'enum',
    enum: ['waiting', 'team_setup', 'in_progress', 'finished'],
    default: 'waiting',
  })
  status: RoomStatus;

  @Column({ type: 'int', default: 8, name: 'max_players' })
  maxPlayers: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'started_at' })
  startedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true, name: 'finished_at' })
  finishedAt: Date | null;
}
