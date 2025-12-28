import { Timer } from './Timer';
import type { WordCategory } from '../../contexts/GameContext';

interface SpectatorViewProps {
  category: WordCategory | null;
  timeRemaining: number;
  drawerUsername: string;
  guesserUsername: string;
  hasWord: boolean;
}

const categoryNames: Record<WordCategory, string> = {
  acciones: 'Acciones',
  objetos: 'Objetos',
  refranes: 'Refranes',
  costumbres: 'Costumbres',
};

export function SpectatorView({
  category,
  timeRemaining,
  drawerUsername,
  guesserUsername,
  hasWord,
}: SpectatorViewProps) {
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-purple-600 mb-2">Observando el turno</h2>
        <p className="text-gray-600">Espera tu turno para jugar</p>
      </div>

      {/* Timer */}
      {hasWord && <Timer timeRemaining={timeRemaining} />}

      {/* Current Turn Info */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Turno actual:</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
            <span className="text-gray-600">Dibujante:</span>
            <span className="font-bold text-blue-600">{drawerUsername}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded">
            <span className="text-gray-600">Adivinador:</span>
            <span className="font-bold text-green-600">{guesserUsername}</span>
          </div>
          {category && (
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
              <span className="text-gray-600">Categoría:</span>
              <span className="font-bold text-purple-600">{categoryNames[category]}</span>
            </div>
          )}
        </div>
      </div>

      {!category && (
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded max-w-md">
          <p className="text-blue-700 font-medium text-center">
            Esperando que {drawerUsername} tire el dado...
          </p>
        </div>
      )}

      {/* Info */}
      <div className="bg-gray-100 p-6 rounded-lg max-w-2xl">
        <h3 className="font-bold text-lg mb-3 text-gray-800 text-center">
          ¿Qué puedes hacer?
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>Observa cómo juegan tus compañeros de equipo</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>Presta atención a las técnicas de dibujo</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>Tu turno llegará pronto en la rotación</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>Anima a tu equipo y disfruta el juego</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
