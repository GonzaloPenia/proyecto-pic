import { Injectable, Logger } from '@nestjs/common';
import { WordCategory } from './entities/word.entity';

/**
 * Servicio para simular el lanzamiento del dado de categorías
 */
@Injectable()
export class DiceRollerService {
  private readonly logger = new Logger('DiceRollerService');

  private readonly categories: WordCategory[] = [
    'acciones',
    'objetos',
    'refranes',
    'costumbres',
  ];

  /**
   * Simula el lanzamiento del dado y retorna una categoría aleatoria
   */
  roll(): WordCategory {
    const randomIndex = Math.floor(Math.random() * this.categories.length);
    const selectedCategory = this.categories[randomIndex];

    this.logger.log(`Dice rolled: ${selectedCategory}`);

    return selectedCategory;
  }

  /**
   * Obtiene todas las categorías disponibles
   */
  getAllCategories(): WordCategory[] {
    return [...this.categories];
  }

  /**
   * Simula una animación de dado (para uso futuro con duración)
   * Retorna la categoría después de un delay simulado
   */
  async rollWithAnimation(durationMs: number = 2000): Promise<WordCategory> {
    // Simular delay de animación
    await new Promise((resolve) => setTimeout(resolve, durationMs));

    return this.roll();
  }
}
