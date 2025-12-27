import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket, useAuth } from '../contexts';
import { roomsService } from '../services/rooms.service';

interface Player {
  userId: string;
  username: string;
  email?: string;
}

interface TeamAssignment {
  userId: string;
  username: string;
  teamId: string | null;
  teamNumber: 1 | 2 | null;
  teamName: string | null;
}

const LobbyPage = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { socket, joinRoom, leaveRoom, assignTeamsRandom, isConnected } = useSocket();
  const { user } = useAuth();

  const [room, setRoom] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<TeamAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [playerCount, setPlayerCount] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(8);

  const isHost = room?.hostId === user?.id;

  useEffect(() => {
    const loadRoom = async () => {
      if (!roomCode) {
        navigate('/dashboard');
        return;
      }

      try {
        const roomData = await roomsService.getRoomByCode(roomCode);
        setRoom(roomData);
        setMaxPlayers(roomData.maxPlayers);
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading room:', err);
        setError('Sala no encontrada');
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomCode, navigate]);

  useEffect(() => {
    if (!socket || !isConnected || !roomCode) return;

    const handleJoinRoom = async () => {
      try {
        await joinRoom(roomCode);
        console.log('Joined WebSocket room');
      } catch (err: any) {
        console.error('Error joining WebSocket room:', err);
        setError(err.message);
      }
    };

    handleJoinRoom();

    // Event listeners
    const handlePlayerJoined = (data: any) => {
      console.log('Player joined:', data);
      setPlayerCount(data.playerCount);
      setMaxPlayers(data.maxPlayers);

      // Agregar jugador a la lista si no existe
      setPlayers((prev) => {
        const exists = prev.some(p => p.userId === data.userId);
        if (exists) return prev;
        return [...prev, {
          userId: data.userId,
          username: data.username,
          email: data.email
        }];
      });
    };

    const handlePlayerLeft = (data: any) => {
      console.log('Player left:', data);
      setPlayerCount(data.playerCount);

      // Remover jugador de la lista
      setPlayers((prev) => prev.filter(p => p.userId !== data.userId));
      setTeams((prev) => prev.filter(t => t.userId !== data.userId));
    };

    const handleTeamsAssigned = (data: any) => {
      console.log('Teams assigned:', data);
      setTeams(data.participants);
    };

    socket.on('player_joined', handlePlayerJoined);
    socket.on('player_left', handlePlayerLeft);
    socket.on('teams_assigned', handleTeamsAssigned);

    // Cleanup
    return () => {
      socket.off('player_joined', handlePlayerJoined);
      socket.off('player_left', handlePlayerLeft);
      socket.off('teams_assigned', handleTeamsAssigned);

      leaveRoom(roomCode).catch(console.error);
    };
  }, [socket, isConnected, roomCode, joinRoom, leaveRoom]);

  const handleAssignTeamsRandom = async () => {
    if (!roomCode) return;

    try {
      await assignTeamsRandom(roomCode);
    } catch (err: any) {
      console.error('Error assigning teams:', err);
      setError(err.message);
    }
  };

  const handleLeaveRoom = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '24px' }}>Cargando...</div>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#c33', marginBottom: '20px' }}>{error}</h2>
          <button
            onClick={handleLeaveRoom}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const team1 = teams.filter(t => t.teamNumber === 1);
  const team2 = teams.filter(t => t.teamNumber === 2);
  const unassignedPlayers = players.filter(p => !teams.some(t => t.userId === p.userId));

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          borderBottom: '2px solid #eee',
          paddingBottom: '20px'
        }}>
          <div>
            <h1 style={{ margin: 0, marginBottom: '10px' }}>Sala de Espera</h1>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#667eea',
                letterSpacing: '6px'
              }}>
                {roomCode}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {playerCount}/{maxPlayers} jugadores
              </div>
              {isHost && (
                <span style={{
                  background: '#28a745',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  HOST
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleLeaveRoom}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Salir
          </button>
        </div>

        {/* Status de conexión */}
        <div style={{
          marginBottom: '20px',
          padding: '12px',
          background: isConnected ? '#d4edda' : '#f8d7da',
          color: isConnected ? '#155724' : '#721c24',
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          {isConnected ? '✓ Conectado al servidor' : '⚠ Desconectado del servidor'}
        </div>

        {/* Jugadores sin asignar */}
        {unassignedPlayers.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px' }}>Jugadores en espera ({unassignedPlayers.length})</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '10px'
            }}>
              {unassignedPlayers.map((player) => (
                <div
                  key={player.userId}
                  style={{
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: '5px',
                    border: '2px solid #ddd'
                  }}
                >
                  <div style={{ fontWeight: '600' }}>{player.username}</div>
                  {player.userId === user?.id && (
                    <span style={{ fontSize: '12px', color: '#667eea' }}>(Tú)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Equipos */}
        {teams.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px' }}>Equipos Asignados</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Equipo Azul */}
              <div style={{
                padding: '20px',
                background: '#e3f2fd',
                borderRadius: '10px',
                border: '3px solid #2196f3'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>
                  Equipo Azul ({team1.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {team1.map((player) => (
                    <div
                      key={player.userId}
                      style={{
                        padding: '10px',
                        background: 'white',
                        borderRadius: '5px',
                        fontWeight: '500'
                      }}
                    >
                      {player.username}
                      {player.userId === user?.id && (
                        <span style={{ marginLeft: '8px', color: '#2196f3' }}>(Tú)</span>
                      )}
                    </div>
                  ))}
                  {team1.length === 0 && (
                    <div style={{ color: '#999', fontStyle: 'italic' }}>Sin jugadores</div>
                  )}
                </div>
              </div>

              {/* Equipo Blanco */}
              <div style={{
                padding: '20px',
                background: '#f5f5f5',
                borderRadius: '10px',
                border: '3px solid #9e9e9e'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#616161' }}>
                  Equipo Blanco ({team2.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {team2.map((player) => (
                    <div
                      key={player.userId}
                      style={{
                        padding: '10px',
                        background: 'white',
                        borderRadius: '5px',
                        fontWeight: '500'
                      }}
                    >
                      {player.username}
                      {player.userId === user?.id && (
                        <span style={{ marginLeft: '8px', color: '#616161' }}>(Tú)</span>
                      )}
                    </div>
                  ))}
                  {team2.length === 0 && (
                    <div style={{ color: '#999', fontStyle: 'italic' }}>Sin jugadores</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Acciones del host */}
        {isHost && (
          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '20px',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '10px'
          }}>
            <button
              onClick={handleAssignTeamsRandom}
              disabled={players.length < 2}
              style={{
                flex: 1,
                padding: '14px',
                background: players.length < 2 ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: players.length < 2 ? 'not-allowed' : 'pointer'
              }}
            >
              Asignar Equipos Aleatoriamente
            </button>
            <button
              disabled={teams.length === 0 || team1.length === 0 || team2.length === 0}
              style={{
                flex: 1,
                padding: '14px',
                background: (teams.length === 0 || team1.length === 0 || team2.length === 0) ? '#ccc' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (teams.length === 0 || team1.length === 0 || team2.length === 0) ? 'not-allowed' : 'pointer'
              }}
            >
              Comenzar Juego
            </button>
          </div>
        )}

        {error && teams.length === 0 && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: '#f8d7da',
            color: '#721c24',
            borderRadius: '5px'
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LobbyPage;
