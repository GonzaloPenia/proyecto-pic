import { useEffect, useState } from 'react';
import { theme } from '../../utils';

interface HourglassProps {
  /**
   * Duración del temporizador en segundos
   * Si es undefined, el reloj girará infinitamente sin countdown
   */
  duration?: number;
  /**
   * Callback que se ejecuta cuando el tiempo se agota
   */
  onTimeout?: () => void;
  /**
   * Tamaño del reloj en píxeles
   */
  size?: number;
  /**
   * Mostrar el tiempo restante debajo del reloj
   */
  showTimer?: boolean;
}

export default function Hourglass({
  duration,
  onTimeout,
  size = 60,
  showTimer = false
}: HourglassProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (duration === undefined) {
      // Modo infinito: solo rotar continuamente
      const rotationInterval = setInterval(() => {
        setRotation(prev => (prev + 180) % 360);
      }, 2000);

      return () => clearInterval(rotationInterval);
    } else {
      // Modo countdown
      setTimeRemaining(duration);

      const countdownInterval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === undefined || prev <= 0) {
            clearInterval(countdownInterval);
            if (prev === 0 && onTimeout) {
              onTimeout();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Rotar el reloj cada 2 segundos
      const rotationInterval = setInterval(() => {
        setRotation(prev => (prev + 180) % 360);
      }, 2000);

      return () => {
        clearInterval(countdownInterval);
        clearInterval(rotationInterval);
      };
    }
  }, [duration, onTimeout]);

  const formatTime = (seconds: number | undefined): string => {
    if (seconds === undefined) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    }}>
      <div style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 1s ease-in-out'
      }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Marco superior */}
          <rect x="20" y="10" width="60" height="8" fill={theme.colors.text.primary} rx="2" />

          {/* Parte superior del reloj */}
          <path
            d="M 30 18 L 40 45 L 60 45 L 70 18 Z"
            fill={theme.colors.text.primary}
            opacity="0.2"
          />

          {/* Arena superior */}
          <path
            d="M 35 20 L 42 40 L 58 40 L 65 20 Z"
            fill={theme.colors.text.primary}
            opacity="0.6"
          >
            {duration !== undefined && (
              <animate
                attributeName="opacity"
                from="0.6"
                to="0.1"
                dur={`${duration}s`}
                fill="freeze"
              />
            )}
          </path>

          {/* Cuello del reloj */}
          <ellipse cx="50" cy="50" rx="8" ry="5" fill={theme.colors.text.primary} />

          {/* Parte inferior del reloj */}
          <path
            d="M 30 82 L 40 55 L 60 55 L 70 82 Z"
            fill={theme.colors.text.primary}
            opacity="0.2"
          />

          {/* Arena inferior */}
          <path
            d="M 35 80 L 42 60 L 58 60 L 65 80 Z"
            fill={theme.colors.text.primary}
            opacity="0.1"
          >
            {duration !== undefined && (
              <animate
                attributeName="opacity"
                from="0.1"
                to="0.6"
                dur={`${duration}s`}
                fill="freeze"
              />
            )}
          </path>

          {/* Marco inferior */}
          <rect x="20" y="82" width="60" height="8" fill={theme.colors.text.primary} rx="2" />

          {/* Borde exterior */}
          <path
            d="M 30 18 L 40 45 L 40 55 L 30 82 M 70 18 L 60 45 L 60 55 L 70 82"
            stroke={theme.colors.text.primary}
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {showTimer && timeRemaining !== undefined && (
        <div style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: timeRemaining <= 10 ? '#dc3545' : theme.colors.text.primary,
          fontFamily: 'monospace'
        }}>
          {formatTime(timeRemaining)}
        </div>
      )}
    </div>
  );
}
