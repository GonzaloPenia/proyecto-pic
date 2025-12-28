import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word, WordCategory } from './entities/word.entity';

@Injectable()
export class WordsService {
  private readonly logger = new Logger('WordsService');

  constructor(
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
  ) {}

  /**
   * Obtiene una palabra aleatoria de una categoría específica
   */
  async getRandomWordByCategory(category: WordCategory): Promise<Word | null> {
    const words = await this.wordRepository.find({
      where: {
        category,
        isActive: true,
      },
    });

    if (words.length === 0) {
      this.logger.warn(`No words found for category: ${category}`);
      return null;
    }

    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }

  /**
   * Obtiene todas las palabras de una categoría
   */
  async getWordsByCategory(category: WordCategory): Promise<Word[]> {
    return this.wordRepository.find({
      where: {
        category,
        isActive: true,
      },
    });
  }

  /**
   * Obtiene una palabra por ID
   */
  async getWordById(id: string): Promise<Word | null> {
    return this.wordRepository.findOne({
      where: { id },
    });
  }

  /**
   * Cuenta las palabras por categoría
   */
  async countWordsByCategory(category: WordCategory): Promise<number> {
    return this.wordRepository.count({
      where: {
        category,
        isActive: true,
      },
    });
  }
}
