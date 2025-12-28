import { DrawerView } from './DrawerView';
import { GuesserView } from './GuesserView';
import { SpectatorView } from './SpectatorView';
import { useGameState } from '../../hooks/useGameState';

interface GameContainerProps {
  onRollDice: () => void;
  onMarkGuessed: () => void;
  isRolling: boolean;
}

export function GameContainer({ onRollDice, onMarkGuessed, isRolling }: GameContainerProps) {
  const {
    isDrawer,
    isGuesser,
    isSpectator,
    currentWord,
    category,
    timeRemaining,
    currentDrawer,
    currentGuesser,
  } = useGameState();

  if (isDrawer) {
    return (
      <DrawerView
        word={currentWord}
        category={category}
        timeRemaining={timeRemaining}
        onRollDice={onRollDice}
        isRolling={isRolling}
        guesserUsername={currentGuesser?.username || 'Desconocido'}
      />
    );
  }

  if (isGuesser) {
    return (
      <GuesserView
        category={category}
        timeRemaining={timeRemaining}
        onMarkGuessed={onMarkGuessed}
        drawerUsername={currentDrawer?.username || 'Desconocido'}
        hasWord={currentWord !== null}
      />
    );
  }

  if (isSpectator) {
    return (
      <SpectatorView
        category={category}
        timeRemaining={timeRemaining}
        drawerUsername={currentDrawer?.username || 'Desconocido'}
        guesserUsername={currentGuesser?.username || 'Desconocido'}
        hasWord={currentWord !== null}
      />
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500">Cargando...</p>
    </div>
  );
}
