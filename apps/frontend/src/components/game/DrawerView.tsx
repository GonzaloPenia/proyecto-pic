import { Timer } from './Timer';
import { DiceRoller } from './DiceRoller';
import type { WordCategory } from '../../contexts/GameContext';

interface DrawerViewProps {
  word: string | null;
  category: WordCategory | null;
  timeRemaining: number;
  onRollDice: () => void;
  isRolling: boolean;
  guesserUsername: string;
}

export function DrawerView({
  word,
  category,
  timeRemaining,
  onRollDice,
  isRolling,
  guesserUsername,
}: DrawerViewProps) {
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-2">¡Tu turno de dibujar!</h2>
        <p className="text-gray-600">
          Tu compañero <span className="font-semibold">{guesserUsername}</span> debe adivinar
        </p>
      </div>

      <div className="flex gap-8 items-start">
        {/* Dice Roller */}
        <DiceRoller
          onRoll={onRollDice}
          isRolling={isRolling}
          category={category}
          disabled={category !== null}
        />

        {/* Timer */}
        {word && <Timer timeRemaining={timeRemaining} />}
      </div>

      {/* Word Display */}
      {word && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-xl shadow-2xl">
          <p className="text-sm uppercase tracking-wide mb-2 opacity-90">Tu palabra es:</p>
          <p className="text-5xl font-bold">{word}</p>
        </div>
      )}

      {!word && category && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-700 font-medium">
            Esperando la palabra... Se asignará automáticamente
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-100 p-6 rounded-lg max-w-2xl">
        <h3 className="font-bold text-lg mb-3 text-gray-800">Instrucciones:</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">1.</span>
            {!category && <span>Haz clic en "Tirar Dado" para obtener una categoría</span>}
            {category && !word && <span>Espera a que se asigne una palabra automáticamente</span>}
            {word && <span>Dibuja la palabra en una hoja de papel</span>}
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">2.</span>
            <span>NO digas la palabra en voz alta ni escribas letras</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">3.</span>
            <span>Tu compañero presionará "¡Adiviné!" cuando sepa la respuesta</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">4.</span>
            <span>¡Tienes {timeRemaining} segundos!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
