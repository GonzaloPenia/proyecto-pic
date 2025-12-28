import { useMemo } from 'react';
import { useGame, type TeamState } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';

export function useGameState() {
  const { gameState, myRole, currentWord, timeRemaining } = useGame();
  const { user } = useAuth();

  const isDrawer = useMemo(() => {
    if (!gameState?.currentTurn || !user) return false;
    return gameState.currentTurn.drawer.userId === user.id;
  }, [gameState?.currentTurn, user]);

  const isGuesser = useMemo(() => {
    if (!gameState?.currentTurn || !user) return false;
    return gameState.currentTurn.guesser.userId === user.id;
  }, [gameState?.currentTurn, user]);

  const isSpectator = useMemo(() => {
    return !isDrawer && !isGuesser;
  }, [isDrawer, isGuesser]);

  const currentDrawer = useMemo(() => {
    return gameState?.currentTurn?.drawer || null;
  }, [gameState?.currentTurn]);

  const currentGuesser = useMemo(() => {
    return gameState?.currentTurn?.guesser || null;
  }, [gameState?.currentTurn]);

  const myTeam = useMemo((): TeamState | null => {
    if (!gameState || !user) return null;

    // Find which team the current user belongs to
    // This would require additional tracking in the game state
    // For now, we'll determine it based on the turn order
    return null; // TODO: Implement team tracking
  }, [gameState, user]);

  const opponentTeam = useMemo((): TeamState | null => {
    if (!gameState || !myTeam) return null;
    return gameState.teams.find((t) => t.teamId !== myTeam.teamId) || null;
  }, [gameState, myTeam]);

  const category = useMemo(() => {
    return gameState?.currentTurn?.category || null;
  }, [gameState?.currentTurn]);

  const roundNumber = useMemo(() => {
    return gameState?.currentTurn?.roundNumber || 0;
  }, [gameState?.currentTurn]);

  const isGameActive = useMemo(() => {
    return gameState?.status === 'active';
  }, [gameState?.status]);

  const isGamePaused = useMemo(() => {
    return gameState?.status === 'paused';
  }, [gameState?.status]);

  const isGameFinished = useMemo(() => {
    return gameState?.status === 'finished';
  }, [gameState?.status]);

  const victoryCondition = useMemo(() => {
    return gameState?.victoryCondition || null;
  }, [gameState?.victoryCondition]);

  const teams = useMemo(() => {
    return gameState?.teams || [];
  }, [gameState?.teams]);

  return {
    gameState,
    myRole,
    currentWord,
    timeRemaining,
    isDrawer,
    isGuesser,
    isSpectator,
    currentDrawer,
    currentGuesser,
    myTeam,
    opponentTeam,
    category,
    roundNumber,
    isGameActive,
    isGamePaused,
    isGameFinished,
    victoryCondition,
    teams,
  };
}
