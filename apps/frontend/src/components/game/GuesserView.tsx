import { Timer } from './Timer';
import type { WordCategory } from '../../contexts/GameContext';

interface GuesserViewProps {
  category: WordCategory | null;
  timeRemaining: number;
  onMarkGuessed: () => void;
  drawerUsername: string;
  hasWord: boolean;
}

const categoryNames: Record<WordCategory, string> = {
  acciones: 'Acciones',
  objetos: 'Objetos',
  refranes: 'Refranes',
  costumbres: 'Costumbres',
};

export function GuesserView({
  category,
  timeRemaining,
  onMarkGuessed,
  drawerUsername,
  hasWord,
}: GuesserViewProps) {
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-2">¡Tu turno de adivinar!</h2>
        <p className="text-gray-600">
          <span className="font-semibold">{drawerUsername}</span> está dibujando
        </p>
      </div>

      {/* Timer */}
      {hasWord && <Timer timeRemaining={timeRemaining} />}

      {/* Category Display */}
      {category && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-2">Categoría:</p>
          <p className="text-3xl font-bold text-gray-800">{categoryNames[category]}</p>
        </div>
      )}

      {!category && (
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-blue-700 font-medium">
            Esperando que {drawerUsername} tire el dado...
          </p>
        </div>
      )}

      {/* Guess Button */}
      {hasWord && (
        <button
          onClick={onMarkGuessed}
          className="px-12 py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all"
        >
          ¡Adiviné!
        </button>
      )}

      {/* Instructions */}
      <div className="bg-gray-100 p-6 rounded-lg max-w-2xl">
        <h3 className="font-bold text-lg mb-3 text-gray-800">Instrucciones:</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">1.</span>
            <span>Observa el dibujo que hace tu compañero en papel</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">2.</span>
            <span>La palabra pertenece a la categoría: {category ? categoryNames[category] : '...'}</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">3.</span>
            <span>Cuando sepas la respuesta, presiona el botón "¡Adiviné!"</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">4.</span>
            <span>Comunica tu respuesta a los demás jugadores para validar</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
