export const SOCKET_EVENTS = {
  // Client -> Server
  CLIENT: {
    JOIN_ROOM: 'join_room',
    LEAVE_ROOM: 'leave_room',
    ASSIGN_TEAMS: 'assign_teams',
    ASSIGN_TEAMS_RANDOM: 'assign_teams_random',
    START_GAME: 'start_game',
    ROLL_DICE: 'roll_dice',
    MARK_GUESSED: 'mark_guessed',
  },
  // Server -> Client
  SERVER: {
    ROOM_JOINED: 'room_joined',
    PLAYER_JOINED: 'player_joined',
    PLAYER_LEFT: 'player_left',
    TEAMS_ASSIGNED: 'teams_assigned',
    GAME_STARTED: 'game_started',
    DICE_ROLLED: 'dice_rolled',
    WORD_ASSIGNED: 'word_assigned',
    TURN_STARTED: 'turn_started',
    TIMER_TICK: 'timer_tick',
    WORD_GUESSED: 'word_guessed',
    TURN_TIMEOUT: 'turn_timeout',
    NEXT_TURN: 'next_turn',
    GAME_STATE_UPDATE: 'game_state_update',
    GAME_OVER: 'game_over',
    PLAYER_DISCONNECTED: 'player_disconnected',
    PLAYER_RECONNECTED: 'player_reconnected',
    ERROR: 'error',
  },
} as const;
