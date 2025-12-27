/**
 * Archivo barrel para exportaciones centralizadas de contextos.
 * Facilita las importaciones permitiendo importar múltiples contextos desde un solo lugar.
 *
 * Ejemplo de uso:
 * import { useAuth, useSocket } from '../contexts';
 */

export { AuthProvider, useAuth } from './AuthContext';
export { SocketProvider, useSocket } from './SocketContext';
