import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomsService } from '../services/rooms.service';

const JoinRoomPage = () => {
  const [roomCode, setRoomCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!roomCode.trim()) {
      setError('Por favor ingresa un código de sala');
      setLoading(false);
      return;
    }

    try {
      const room = await roomsService.joinRoom(roomCode.toUpperCase());
      console.log('Joined room:', room);

      // Navegar al lobby
      navigate(`/lobby/${room.roomCode}`);
    } catch (err: any) {
      console.error('Error joining room:', err);
      setError(err.response?.data?.message || 'Error al unirse a la sala');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333'
        }}>
          Unirse a una Sala
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#555'
            }}>
              Código de la sala
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Ej: ABC123"
              maxLength={6}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '20px',
                fontWeight: '600',
                textAlign: 'center',
                letterSpacing: '4px',
                textTransform: 'uppercase'
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              marginBottom: '20px',
              background: '#fee',
              color: '#c33',
              borderRadius: '5px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !roomCode.trim()}
            style={{
              width: '100%',
              padding: '14px',
              background: (loading || !roomCode.trim()) ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (loading || !roomCode.trim()) ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s'
            }}
          >
            {loading ? 'Uniéndose...' : 'Unirse'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              width: '100%',
              padding: '14px',
              background: 'transparent',
              color: '#667eea',
              border: '2px solid #667eea',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '10px',
              transition: 'all 0.3s'
            }}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoomPage;
