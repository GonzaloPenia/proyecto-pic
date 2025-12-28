import { useEffect, useState } from 'react';

interface TimerProps {
  timeRemaining: number;
  totalTime?: number;
}

export function Timer({ timeRemaining, totalTime = 60 }: TimerProps) {
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    setIsWarning(timeRemaining <= 10 && timeRemaining > 0);
  }, [timeRemaining]);

  const progress = (timeRemaining / totalTime) * 100;

  const getTimerColor = () => {
    if (timeRemaining <= 10) return 'text-red-600';
    if (timeRemaining <= 30) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getProgressColor = () => {
    if (timeRemaining <= 10) return 'bg-red-500';
    if (timeRemaining <= 30) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
      <div className="relative w-32 h-32">
        {/* Circular progress */}
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
            className={`${getProgressColor()} transition-all duration-1000`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-4xl font-bold ${getTimerColor()} ${
              isWarning ? 'animate-pulse' : ''
            }`}
          >
            {timeRemaining}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600 font-medium">segundos restantes</p>
    </div>
  );
}
