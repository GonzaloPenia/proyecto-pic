import { Injectable, Logger } from '@nestjs/common';

export interface PlayerInfo {
  userId: string;
  username: string;
  teamNumber: 1 | 2;
}

export interface Turn {
  drawerId: string;
  drawerUsername: string;
  guesserId: string;
  guesserUsername: string;
}

/**
 * Servicio para gestionar la rotación de turnos en el juego
 *
 * Lógica de turnos:
 * - Alternar entre equipos (Team 1 → Team 2 → Team 1...)
 * - Rotar jugadores dentro de cada equipo
 * - El dibujante y adivinador siempre son del mismo equipo
 */
@Injectable()
export class TurnManagerService {
  private readonly logger = new Logger('TurnManagerService');

  /**
   * Genera el orden completo de turnos para un juego
   *
   * Ejemplo con 4 jugadores (2 por equipo):
   * Team 1: A, B
   * Team 2: C, D
   *
   * Turnos:
   * 1. A dibuja, B adivina (Team 1)
   * 2. C dibuja, D adivina (Team 2)
   * 3. B dibuja, A adivina (Team 1)
   * 4. D dibuja, C adivina (Team 2)
   * 5. A dibuja, B adivina (Team 1) ... se repite
   */
  generateTurnOrder(
    team1Players: PlayerInfo[],
    team2Players: PlayerInfo[],
  ): Turn[] {
    if (team1Players.length < 2 || team2Players.length < 2) {
      throw new Error('Each team must have at least 2 players');
    }

    const turns: Turn[] = [];
    const maxTurnsPerTeam = Math.max(team1Players.length, team2Players.length);

    // Generar suficientes turnos para que todos jueguen al menos una vez
    for (let round = 0; round < maxTurnsPerTeam; round++) {
      // Turno del Team 1
      const team1DrawerIndex = round % team1Players.length;
      const team1GuesserIndex = (round + 1) % team1Players.length;

      turns.push({
        drawerId: team1Players[team1DrawerIndex].userId,
        drawerUsername: team1Players[team1DrawerIndex].username,
        guesserId: team1Players[team1GuesserIndex].userId,
        guesserUsername: team1Players[team1GuesserIndex].username,
      });

      // Turno del Team 2
      const team2DrawerIndex = round % team2Players.length;
      const team2GuesserIndex = (round + 1) % team2Players.length;

      turns.push({
        drawerId: team2Players[team2DrawerIndex].userId,
        drawerUsername: team2Players[team2DrawerIndex].username,
        guesserId: team2Players[team2GuesserIndex].userId,
        guesserUsername: team2Players[team2GuesserIndex].username,
      });
    }

    this.logger.log(
      `Generated ${turns.length} turns for teams of ${team1Players.length} and ${team2Players.length} players`,
    );

    return turns;
  }

  /**
   * Obtiene el siguiente turno basado en el turno actual
   */
  getNextTurn(currentTurnIndex: number, turnOrder: Turn[]): Turn | null {
    if (turnOrder.length === 0) {
      return null;
    }

    const nextIndex = (currentTurnIndex + 1) % turnOrder.length;
    return turnOrder[nextIndex];
  }

  /**
   * Obtiene el índice del turno actual en el orden
   */
  getCurrentTurnIndex(
    drawerId: string,
    guesserId: string,
    turnOrder: Turn[],
  ): number {
    return turnOrder.findIndex(
      (turn) => turn.drawerId === drawerId && turn.guesserId === guesserId,
    );
  }

  /**
   * Barajea (shuffle) un array usando el algoritmo Fisher-Yates
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Genera un orden de turnos aleatorio (para modos de juego rápidos)
   */
  generateRandomTurnOrder(
    team1Players: PlayerInfo[],
    team2Players: PlayerInfo[],
  ): Turn[] {
    const shuffledTeam1 = this.shuffleArray(team1Players);
    const shuffledTeam2 = this.shuffleArray(team2Players);

    return this.generateTurnOrder(shuffledTeam1, shuffledTeam2);
  }
}
