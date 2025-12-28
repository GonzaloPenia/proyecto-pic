import type { TeamState } from '../../contexts/GameContext';
import { useNavigate } from 'react-router-dom';

interface GameOverModalProps {
  winnerTeamNumber: 1 | 2;
  teams: TeamState[];
  totalRounds: number;
  roomCode: string;
}

export function GameOverModal({ winnerTeamNumber, teams, totalRounds, roomCode }: GameOverModalProps) {
  const navigate = useNavigate();

  const winnerTeam = teams.find((t) => t.teamNumber === winnerTeamNumber);
  const loserTeam = teams.find((t) => t.teamNumber !== winnerTeamNumber);

  const handleBackToLobby = () => {
    navigate(`/lobby/${roomCode}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative overflow-hidden">
        {/* Confetti effect (simplified) */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">¡Juego Terminado!</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-6xl">🎉</span>
            <div>
              <p className="text-2xl font-semibold text-gray-700">
                Ganador: <span className={winnerTeamNumber === 1 ? 'text-blue-600' : 'text-gray-700'}>
                  Equipo {winnerTeamNumber === 1 ? 'Azul' : 'Blanco'}
                </span>
              </p>
            </div>
            <span className="text-6xl">🏆</span>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Winner Team */}
          <div className={`p-6 rounded-lg ${winnerTeamNumber === 1 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 border-2 border-gray-500'}`}>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600 mb-2">
                {winnerTeamNumber === 1 ? '🏆 Ganador' : 'Perdedor'}
              </p>
              <p className={`text-lg font-bold mb-2 ${winnerTeamNumber === 1 ? 'text-blue-600' : 'text-gray-700'}`}>
                Equipo {winnerTeamNumber === 1 ? 'Azul' : 'Blanco'}
              </p>
              <p className="text-4xl font-bold text-gray-800">{winnerTeam?.score || 0}</p>
              <p className="text-xs text-gray-500 mt-1">puntos</p>
              {winnerTeam && winnerTeam.categoriesCompleted.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-1">Categorías:</p>
                  <p className="text-sm font-semibold">{winnerTeam.categoriesCompleted.length}/4</p>
                </div>
              )}
            </div>
          </div>

          {/* Loser Team */}
          <div className={`p-6 rounded-lg ${winnerTeamNumber === 2 ? 'bg-gray-100 border-2 border-gray-500' : 'bg-blue-100 border-2 border-blue-500'}`}>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600 mb-2">
                {winnerTeamNumber === 2 ? '🏆 Ganador' : 'Perdedor'}
              </p>
              <p className={`text-lg font-bold mb-2 ${winnerTeamNumber === 2 ? 'text-gray-700' : 'text-blue-600'}`}>
                Equipo {winnerTeamNumber === 2 ? 'Blanco' : 'Azul'}
              </p>
              <p className="text-4xl font-bold text-gray-800">{loserTeam?.score || 0}</p>
              <p className="text-xs text-gray-500 mt-1">puntos</p>
              {loserTeam && loserTeam.categoriesCompleted.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-1">Categorías:</p>
                  <p className="text-sm font-semibold">{loserTeam.categoriesCompleted.length}/4</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Game Stats */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-center text-gray-600">
            <span className="font-semibold">Total de rondas jugadas:</span> {totalRounds}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleBackToLobby}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all"
          >
            Volver al Lobby
          </button>
        </div>
      </div>
    </div>
  );
}
