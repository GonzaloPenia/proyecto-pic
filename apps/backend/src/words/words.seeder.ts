import { DataSource } from 'typeorm';
import { Word } from './entities/word.entity';

export const seedWords = async (dataSource: DataSource) => {
  const wordRepository = dataSource.getRepository(Word);

  const existingWords = await wordRepository.count();
  if (existingWords > 0) {
    console.log('Words already seeded, skipping...');
    return;
  }

  const words = [
    // Acciones (20+ palabras)
    { category: 'acciones' as const, wordText: 'Saltar', difficulty: 'easy' as const },
    { category: 'acciones' as const, wordText: 'Correr', difficulty: 'easy' as const },
    { category: 'acciones' as const, wordText: 'Bailar', difficulty: 'easy' as const },
    { category: 'acciones' as const, wordText: 'Nadar', difficulty: 'easy' as const },
    { category: 'acciones' as const, wordText: 'Dormir', difficulty: 'easy' as const },
    { category: 'acciones' as const, wordText: 'Cocinar', difficulty: 'easy' as const },
    { category: 'acciones' as const, wordText: 'Leer', difficulty: 'easy' as const },
    { category: 'acciones' as const, wordText: 'Escribir', difficulty: 'easy' as const },
    { category: 'acciones' as const, wordText: 'Dibujar', difficulty: 'easy' as const },
    { category: 'acciones' as const, wordText: 'Cantar', difficulty: 'easy' as const },
    { category: 'acciones' as const, wordText: 'Trepar', difficulty: 'medium' as const },
    { category: 'acciones' as const, wordText: 'Esquiar', difficulty: 'medium' as const },
    { category: 'acciones' as const, wordText: 'Bucear', difficulty: 'medium' as const },
    { category: 'acciones' as const, wordText: 'Escalar', difficulty: 'medium' as const },
    { category: 'acciones' as const, wordText: 'Meditar', difficulty: 'medium' as const },
    { category: 'acciones' as const, wordText: 'Aplaudir', difficulty: 'easy' as const },
    { category: 'acciones' as const, wordText: 'Silbar', difficulty: 'easy' as const },
    { category: 'acciones' as const, wordText: 'Bostezar', difficulty: 'easy' as const },
    { category: 'acciones' as const, wordText: 'Estornudar', difficulty: 'medium' as const },
    { category: 'acciones' as const, wordText: 'Tropezar', difficulty: 'medium' as const },
    { category: 'acciones' as const, wordText: 'Abrazar', difficulty: 'easy' as const },
    { category: 'acciones' as const, wordText: 'Besar', difficulty: 'easy' as const },

    // Objetos (20+ palabras)
    { category: 'objetos' as const, wordText: 'Mesa', difficulty: 'easy' as const },
    { category: 'objetos' as const, wordText: 'Silla', difficulty: 'easy' as const },
    { category: 'objetos' as const, wordText: 'Computadora', difficulty: 'medium' as const },
    { category: 'objetos' as const, wordText: 'Teléfono', difficulty: 'easy' as const },
    { category: 'objetos' as const, wordText: 'Libro', difficulty: 'easy' as const },
    { category: 'objetos' as const, wordText: 'Lápiz', difficulty: 'easy' as const },
    { category: 'objetos' as const, wordText: 'Reloj', difficulty: 'easy' as const },
    { category: 'objetos' as const, wordText: 'Zapato', difficulty: 'easy' as const },
    { category: 'objetos' as const, wordText: 'Guitarra', difficulty: 'medium' as const },
    { category: 'objetos' as const, wordText: 'Piano', difficulty: 'medium' as const },
    { category: 'objetos' as const, wordText: 'Bicicleta', difficulty: 'medium' as const },
    { category: 'objetos' as const, wordText: 'Auto', difficulty: 'easy' as const },
    { category: 'objetos' as const, wordText: 'Avión', difficulty: 'medium' as const },
    { category: 'objetos' as const, wordText: 'Pelota', difficulty: 'easy' as const },
    { category: 'objetos' as const, wordText: 'Paraguas', difficulty: 'medium' as const },
    { category: 'objetos' as const, wordText: 'Llave', difficulty: 'easy' as const },
    { category: 'objetos' as const, wordText: 'Espejo', difficulty: 'easy' as const },
    { category: 'objetos' as const, wordText: 'Vela', difficulty: 'easy' as const },
    { category: 'objetos' as const, wordText: 'Martillo', difficulty: 'medium' as const },
    { category: 'objetos' as const, wordText: 'Cuchillo', difficulty: 'easy' as const },
    { category: 'objetos' as const, wordText: 'Tijera', difficulty: 'easy' as const },
    { category: 'objetos' as const, wordText: 'Campana', difficulty: 'medium' as const },

    // Refranes (20+ refranes argentinos y universales)
    { category: 'refranes' as const, wordText: 'No hay mal que por bien no venga', difficulty: 'medium' as const },
    { category: 'refranes' as const, wordText: 'A caballo regalado no se le miran los dientes', difficulty: 'hard' as const },
    { category: 'refranes' as const, wordText: 'Más vale tarde que nunca', difficulty: 'medium' as const },
    { category: 'refranes' as const, wordText: 'Al que madruga Dios lo ayuda', difficulty: 'medium' as const },
    { category: 'refranes' as const, wordText: 'Camarón que se duerme se lo lleva la corriente', difficulty: 'hard' as const },
    { category: 'refranes' as const, wordText: 'Del dicho al hecho hay mucho trecho', difficulty: 'hard' as const },
    { category: 'refranes' as const, wordText: 'En casa de herrero cuchillo de palo', difficulty: 'hard' as const },
    { category: 'refranes' as const, wordText: 'Dime con quién andas y te diré quién eres', difficulty: 'medium' as const },
    { category: 'refranes' as const, wordText: 'El que busca encuentra', difficulty: 'easy' as const },
    { category: 'refranes' as const, wordText: 'No por mucho madrugar amanece más temprano', difficulty: 'hard' as const },
    { category: 'refranes' as const, wordText: 'Quien mucho abarca poco aprieta', difficulty: 'medium' as const },
    { category: 'refranes' as const, wordText: 'A mal tiempo buena cara', difficulty: 'medium' as const },
    { category: 'refranes' as const, wordText: 'Más vale pájaro en mano que cien volando', difficulty: 'hard' as const },
    { category: 'refranes' as const, wordText: 'El que ríe último ríe mejor', difficulty: 'medium' as const },
    { category: 'refranes' as const, wordText: 'Ojos que no ven corazón que no siente', difficulty: 'hard' as const },
    { category: 'refranes' as const, wordText: 'A palabras necias oídos sordos', difficulty: 'hard' as const },
    { category: 'refranes' as const, wordText: 'Perro que ladra no muerde', difficulty: 'medium' as const },
    { category: 'refranes' as const, wordText: 'El que siembra vientos cosecha tempestades', difficulty: 'hard' as const },
    { category: 'refranes' as const, wordText: 'Después de la tormenta viene la calma', difficulty: 'medium' as const },
    { category: 'refranes' as const, wordText: 'No dejes para mañana lo que puedas hacer hoy', difficulty: 'medium' as const },

    // Costumbres Argentinas (20+ palabras)
    { category: 'costumbres' as const, wordText: 'Mate', difficulty: 'easy' as const },
    { category: 'costumbres' as const, wordText: 'Asado', difficulty: 'easy' as const },
    { category: 'costumbres' as const, wordText: 'Tango', difficulty: 'easy' as const },
    { category: 'costumbres' as const, wordText: 'Empanada', difficulty: 'easy' as const },
    { category: 'costumbres' as const, wordText: 'Fútbol', difficulty: 'easy' as const },
    { category: 'costumbres' as const, wordText: 'Dulce de leche', difficulty: 'medium' as const },
    { category: 'costumbres' as const, wordText: 'Parrilla', difficulty: 'easy' as const },
    { category: 'costumbres' as const, wordText: 'Gaucho', difficulty: 'medium' as const },
    { category: 'costumbres' as const, wordText: 'Boleadoras', difficulty: 'hard' as const },
    { category: 'costumbres' as const, wordText: 'Locro', difficulty: 'medium' as const },
    { category: 'costumbres' as const, wordText: 'Choripán', difficulty: 'easy' as const },
    { category: 'costumbres' as const, wordText: 'Alfajor', difficulty: 'easy' as const },
    { category: 'costumbres' as const, wordText: 'Chimichurri', difficulty: 'medium' as const },
    { category: 'costumbres' as const, wordText: 'Milonga', difficulty: 'medium' as const },
    { category: 'costumbres' as const, wordText: 'Payada', difficulty: 'hard' as const },
    { category: 'costumbres' as const, wordText: 'Peña', difficulty: 'medium' as const },
    { category: 'costumbres' as const, wordText: 'Folklore', difficulty: 'medium' as const },
    { category: 'costumbres' as const, wordText: 'Bombacha de campo', difficulty: 'hard' as const },
    { category: 'costumbres' as const, wordText: 'Truco', difficulty: 'easy' as const },
    { category: 'costumbres' as const, wordText: 'Siesta', difficulty: 'easy' as const },
    { category: 'costumbres' as const, wordText: 'Chamigo', difficulty: 'medium' as const },
    { category: 'costumbres' as const, wordText: 'Che', difficulty: 'easy' as const },
  ];

  await wordRepository.save(words);
  console.log(`✅ Seeded ${words.length} words successfully`);
};
