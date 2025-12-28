import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type WordCategory = 'acciones' | 'objetos' | 'refranes' | 'costumbres';
export type WordDifficulty = 'easy' | 'medium' | 'hard';

@Entity('words')
@Index('idx_word_category', ['category'])
@Index('idx_word_active', ['isActive'])
export class Word {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: ['acciones', 'objetos', 'refranes', 'costumbres'],
  })
  category!: WordCategory;

  @Column({ type: 'varchar', length: 100, name: 'word_text' })
  wordText!: string;

  @Column({
    type: 'enum',
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  })
  difficulty!: WordDifficulty;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;
}
