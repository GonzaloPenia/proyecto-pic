import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomCode: string) => Promise<void>;
  leaveRoom: (roomCode: string) => Promise<void>;
  assignTeamsManually: (roomCode: string, team1UserIds: string[], team2UserIds: string[]) => Promise<void>;
  assignTeamsRandom: (roomCode: string) => Promise<void>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      // Si no hay token, desconectar socket si existe
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Crear conexión de socket con el token
    const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

    const newSocket = io(`${SOCKET_URL}/game`, {
      auth: {
        token: token,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Cleanup al desmontar o cambiar token
    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  const joinRoom = useCallback(async (roomCode: string) => {
    if (!socket) {
      throw new Error('Socket not connected');
    }

    return new Promise<void>((resolve, reject) => {
      socket.emit('join_room', { roomCode }, (response: any) => {
        if (response?.success) {
          console.log('Joined room:', roomCode);
          resolve();
        } else {
          console.error('Failed to join room:', response?.message);
          reject(new Error(response?.message || 'Failed to join room'));
        }
      });
    });
  }, [socket]);

  const leaveRoom = useCallback(async (roomCode: string) => {
    if (!socket) {
      throw new Error('Socket not connected');
    }

    return new Promise<void>((resolve, reject) => {
      socket.emit('leave_room', { roomCode }, (response: any) => {
        if (response?.success) {
          console.log('Left room:', roomCode);
          resolve();
        } else {
          console.error('Failed to leave room:', response?.message);
          reject(new Error(response?.message || 'Failed to leave room'));
        }
      });
    });
  }, [socket]);

  const assignTeamsManually = useCallback(async (
    roomCode: string,
    team1UserIds: string[],
    team2UserIds: string[]
  ) => {
    if (!socket) {
      throw new Error('Socket not connected');
    }

    return new Promise<void>((resolve, reject) => {
      socket.emit('assign_teams', { roomCode, team1UserIds, team2UserIds }, (response: any) => {
        if (response?.success) {
          console.log('Teams assigned manually');
          resolve();
        } else {
          console.error('Failed to assign teams:', response?.message);
          reject(new Error(response?.message || 'Failed to assign teams'));
        }
      });
    });
  }, [socket]);

  const assignTeamsRandom = useCallback(async (roomCode: string) => {
    if (!socket) {
      throw new Error('Socket not connected');
    }

    return new Promise<void>((resolve, reject) => {
      socket.emit('assign_teams_random', { roomCode }, (response: any) => {
        if (response?.success) {
          console.log('Teams assigned randomly');
          resolve();
        } else {
          console.error('Failed to assign teams randomly:', response?.message);
          reject(new Error(response?.message || 'Failed to assign teams randomly'));
        }
      });
    });
  }, [socket]);

  const value: SocketContextType = {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
    assignTeamsManually,
    assignTeamsRandom,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
