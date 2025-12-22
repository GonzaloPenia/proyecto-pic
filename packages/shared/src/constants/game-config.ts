export const GAME_CONFIG = {
  MAX_PLAYERS: 8,
  MIN_PLAYERS: 4,
  TURN_DURATION: 60, // seconds
  ROOM_CODE_LENGTH: 6,
  CATEGORIES: ['Acciones', 'Objetos', 'Refranes', 'Costumbres Argentinas'] as const,
  VICTORY_CONDITIONS: {
    FIRST_TO_3: 'first_to_3',
    FIRST_TO_5: 'first_to_5',
    ALL_CATEGORIES: 'all_categories',
  } as const,
} as const;
