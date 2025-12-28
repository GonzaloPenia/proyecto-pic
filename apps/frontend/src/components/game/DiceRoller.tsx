import type { WordCategory } from '../../contexts/GameContext';

interface DiceRollerProps {
  onRoll: () => void;
  isRolling: boolean;
  category: WordCategory | null;
  disabled?: boolean;
}

const categoryNames: Record<WordCategory, string> = {
  acciones: 'Acciones',
  objetos: 'Objetos',
  refranes: 'Refranes',
  costumbres: 'Costumbres',
};

const categoryColors: Record<WordCategory, string> = {
  acciones: 'bg-red-500',
  objetos: 'bg-green-500',
  refranes: 'bg-purple-500',
  costumbres: 'bg-orange-500',
};

export function DiceRoller({ onRoll, isRolling, category, disabled }: DiceRollerProps) {
  const handleRoll = () => {
    if (!disabled && !isRolling) {
      onRoll();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-700">Categoría</h3>

      {/* Dice animation */}
      <div
        className={`w-32 h-32 rounded-xl shadow-xl flex items-center justify-center text-white text-2xl font-bold transition-all duration-500 ${
          isRolling
            ? 'animate-spin bg-gradient-to-br from-blue-400 to-purple-600'
            : category
            ? categoryColors[category]
            : 'bg-gray-400'
        }`}
      >
        {isRolling ? (
          <div className="text-4xl">?</div>
        ) : category ? (
          <div className="text-center">
            <div className="text-sm">Categoría</div>
            <div className="text-lg font-bold">{categoryNames[category]}</div>
          </div>
        ) : (
          <div className="text-4xl">🎲</div>
        )}
      </div>

      {!category && !isRolling && (
        <button
          onClick={handleRoll}
          disabled={disabled || isRolling}
          className={`px-8 py-3 rounded-lg font-bold text-white transition-all ${
            disabled || isRolling
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }`}
        >
          {isRolling ? 'Tirando dado...' : 'Tirar Dado'}
        </button>
      )}

      {category && !isRolling && (
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">{categoryNames[category]}</p>
          <p className="text-sm text-gray-500">¡Dibuja una palabra de esta categoría!</p>
        </div>
      )}
    </div>
  );
}
