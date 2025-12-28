import type { TeamState, WordCategory } from '../../contexts/GameContext';

interface ScoreBoardProps {
  teams: TeamState[];
  victoryCondition: 'first_to_3' | 'first_to_5' | 'all_categories';
}

const categoryNames: Record<WordCategory, string> = {
  acciones: 'Acciones',
  objetos: 'Objetos',
  refranes: 'Refranes',
  costumbres: 'Costumbres',
};

const allCategories: WordCategory[] = ['acciones', 'objetos', 'refranes', 'costumbres'];

export function ScoreBoard({ teams, victoryCondition }: ScoreBoardProps) {
  const team1 = teams.find((t) => t.teamNumber === 1);
  const team2 = teams.find((t) => t.teamNumber === 2);

  const getVictoryText = () => {
    switch (victoryCondition) {
      case 'first_to_3':
        return 'Primero a 3 puntos';
      case 'first_to_5':
        return 'Primero a 5 puntos';
      case 'all_categories':
        return 'Todas las categorías';
      default:
        return '';
    }
  };

  const renderTeamCard = (team: TeamState | undefined, teamName: string, bgColor: string) => {
    if (!team) return null;

    return (
      <div className={`flex-1 ${bgColor} rounded-lg shadow-lg p-6 text-white`}>
        <h3 className="text-2xl font-bold mb-4">{teamName}</h3>
        <div className="text-5xl font-bold mb-4">{team.score}</div>

        {victoryCondition === 'all_categories' && (
          <div className="mt-4">
            <p className="text-sm mb-2 font-semibold">Categorías completadas:</p>
            <div className="space-y-1">
              {allCategories.map((category) => (
                <div
                  key={category}
                  className={`text-sm p-2 rounded ${
                    team.categoriesCompleted.includes(category)
                      ? 'bg-white bg-opacity-30'
                      : 'bg-black bg-opacity-20'
                  }`}
                >
                  {team.categoriesCompleted.includes(category) ? '✓ ' : '○ '}
                  {categoryNames[category]}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-700">Marcador</h2>
        <p className="text-sm text-gray-500">{getVictoryText()}</p>
      </div>
      <div className="flex gap-4">
        {renderTeamCard(team1, 'Equipo Azul', 'bg-blue-600')}
        {renderTeamCard(team2, 'Equipo Blanco', 'bg-gray-700')}
      </div>
    </div>
  );
}
