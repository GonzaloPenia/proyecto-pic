import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useGame, type GameState, type TeamState } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import { GameContainer, ScoreBoard, GameOverModal } from '../components/game';

export function GamePage() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const { socket } = useSocket();
  const { user } = useAuth();
  const { setGameState, setMyRole, setCurrentWord, setTimeRemaining } = useGame();

  const [isRolling, setIsRolling] = useState(false);
  const [gameOverData, setGameOverData] = useState<{
    winnerTeamNumber: 1 | 2;
    teams: TeamState[];
    totalRounds: number;
  } | null>(null);
  const [currentGameState, setCurrentGameState] = useState<GameState | null>(null);

  useEffect(() => {
    if (!socket || !roomCode) return;

    // Request current game state when component mounts
    console.log('Requesting game state for room:', roomCode);
    socket.emit('rejoin_game', { roomCode });

    // Listen to game_started event (from lobby)
    const handleGameStarted = (data: any) => {
      console.log('Game started:', data);
      const initialGameState: GameState = {
        gameId: data.gameId,
        roomCode: roomCode,
        status: 'active',
        currentRound: 0,
        victoryCondition: data.victoryCondition,
        teams: data.teams,
        currentTurn: null,
      };
      setGameState(initialGameState);
      setCurrentGameState(initialGameState);
    };

    // Listen to turn_started
    const handleTurnStarted = (data: any) => {
      console.log('Turn started:', data);
      setCurrentGameState((prev) => {
        if (!prev) return null;
        const newState = {
          ...prev,
          currentRound: data.roundNumber,
          currentTurn: {
            roundNumber: data.roundNumber,
            drawer: data.drawer,
            guesser: data.guesser,
            category: null,
            wordId: null,
            wordText: null,
            startedAt: null,
            timeRemaining: 60,
          },
        };
        setGameState(newState);

        // Determine my role
        if (user) {
          if (data.drawer.userId === user.id) {
            setMyRole('drawer');
          } else if (data.guesser.userId === user.id) {
            setMyRole('guesser');
          } else {
            setMyRole('spectator');
          }
        }

        return newState;
      });
    };

    // Listen to dice_rolling
    const handleDiceRolling = () => {
      console.log('Dice is rolling...');
      setIsRolling(true);
    };

    // Listen to dice_rolled
    const handleDiceRolled = (data: any) => {
      console.log('Dice rolled:', data.category);
      setIsRolling(false);
      setCurrentGameState((prev) => {
        if (!prev || !prev.currentTurn) return prev;
        const newState = {
          ...prev,
          currentTurn: {
            ...prev.currentTurn,
            category: data.category,
          },
        };
        setGameState(newState);
        return newState;
      });
    };

    // Listen to word_assigned (only for drawer)
    const handleWordAssigned = (data: any) => {
      console.log('Word assigned:', data.word);
      setCurrentWord(data.word);
      setCurrentGameState((prev) => {
        if (!prev || !prev.currentTurn) return prev;
        const newState = {
          ...prev,
          currentTurn: {
            ...prev.currentTurn,
            wordText: data.word,
            category: data.category,
            startedAt: new Date(),
          },
        };
        setGameState(newState);
        return newState;
      });
    };

    // Listen to timer_tick
    const handleTimerTick = (data: any) => {
      setTimeRemaining(data.timeRemaining);
      setCurrentGameState((prev) => {
        if (!prev || !prev.currentTurn) return prev;
        const newState = {
          ...prev,
          currentTurn: {
            ...prev.currentTurn,
            timeRemaining: data.timeRemaining,
          },
        };
        setGameState(newState);
        return newState;
      });
    };

    // Listen to word_guessed
    const handleWordGuessed = (data: any) => {
      console.log('Word guessed!', data);

      // Update scores
      setCurrentGameState((prev) => {
        if (!prev) return prev;
        const newState = {
          ...prev,
          teams: prev.teams.map((team) =>
            team.teamId === data.teamId
              ? { ...team, score: data.newScore }
              : team
          ),
        };
        setGameState(newState);
        return newState;
      });

      // Reset word
      setCurrentWord(null);
    };

    // Listen to turn_timeout
    const handleTurnTimeout = (data: any) => {
      console.log('Turn timeout:', data.word);
      // Show the word that wasn't guessed
      alert(`¡Tiempo agotado! La palabra era: ${data.word}`);
      setCurrentWord(null);
    };

    // Listen to game_paused
    const handleGamePaused = (data: any) => {
      console.log('Game paused:', data);
      setCurrentGameState((prev) => {
        if (!prev) return prev;
        const newState = { ...prev, status: 'paused' as const };
        setGameState(newState);
        return newState;
      });
      alert(data.message);
    };

    // Listen to game_resumed
    const handleGameResumed = () => {
      console.log('Game resumed');
      setCurrentGameState((prev) => {
        if (!prev) return prev;
        const newState = { ...prev, status: 'active' as const };
        setGameState(newState);
        return newState;
      });
    };

    // Listen to game_state_sync (for reconnections)
    const handleGameStateSync = (data: any) => {
      console.log('Game state synced:', data);
      setGameState(data);
      setCurrentGameState(data);

      // Sync time
      if (data.currentTurn) {
        setTimeRemaining(data.currentTurn.timeRemaining);
      }
    };

    // Listen to game_over
    const handleGameOver = (data: any) => {
      console.log('Game over:', data);
      setGameOverData({
        winnerTeamNumber: data.winnerTeamNumber,
        teams: data.finalScores,
        totalRounds: data.totalRounds,
      });
      setCurrentGameState((prev) => {
        if (!prev) return prev;
        const newState = { ...prev, status: 'finished' as const };
        setGameState(newState);
        return newState;
      });
    };

    // Register event listeners
    socket.on('game_started', handleGameStarted);
    socket.on('turn_started', handleTurnStarted);
    socket.on('dice_rolling', handleDiceRolling);
    socket.on('dice_rolled', handleDiceRolled);
    socket.on('word_assigned', handleWordAssigned);
    socket.on('timer_tick', handleTimerTick);
    socket.on('word_guessed', handleWordGuessed);
    socket.on('turn_timeout', handleTurnTimeout);
    socket.on('game_paused', handleGamePaused);
    socket.on('game_resumed', handleGameResumed);
    socket.on('game_state_sync', handleGameStateSync);
    socket.on('game_over', handleGameOver);

    // Cleanup
    return () => {
      socket.off('game_started', handleGameStarted);
      socket.off('turn_started', handleTurnStarted);
      socket.off('dice_rolling', handleDiceRolling);
      socket.off('dice_rolled', handleDiceRolled);
      socket.off('word_assigned', handleWordAssigned);
      socket.off('timer_tick', handleTimerTick);
      socket.off('word_guessed', handleWordGuessed);
      socket.off('turn_timeout', handleTurnTimeout);
      socket.off('game_paused', handleGamePaused);
      socket.off('game_resumed', handleGameResumed);
      socket.off('game_state_sync', handleGameStateSync);
      socket.off('game_over', handleGameOver);
    };
  }, [socket, roomCode, user, setGameState, setMyRole, setCurrentWord, setTimeRemaining]);

  const handleRollDice = () => {
    if (!socket || !roomCode) return;
    console.log('Rolling dice...');
    socket.emit('roll_dice', { roomCode });
  };

  const handleMarkGuessed = () => {
    if (!socket || !roomCode) return;
    console.log('Marking as guessed...');
    socket.emit('mark_guessed', { roomCode });
  };

  if (!currentGameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Esperando que inicie el juego...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header with ScoreBoard */}
      <div className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto">
          <ScoreBoard teams={currentGameState.teams} victoryCondition={currentGameState.victoryCondition} />
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-7xl mx-auto py-8">
        <GameContainer
          onRollDice={handleRollDice}
          onMarkGuessed={handleMarkGuessed}
          isRolling={isRolling}
        />
      </div>

      {/* Game Over Modal */}
      {gameOverData && roomCode && (
        <GameOverModal
          winnerTeamNumber={gameOverData.winnerTeamNumber}
          teams={gameOverData.teams}
          totalRounds={gameOverData.totalRounds}
          roomCode={roomCode}
        />
      )}

      {/* Paused Overlay */}
      {currentGameState.status === 'paused' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
            <div className="text-6xl mb-4">⏸️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Juego en Pausa</h2>
            <p className="text-gray-600">Un jugador se ha desconectado. El juego se reanudará automáticamente cuando vuelva.</p>
          </div>
        </div>
      )}
    </div>
  );
}
