import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1>Pingonary</h1>
          <p style={{ marginTop: '0.5rem', color: '#666' }}>
            Bienvenido, <strong>{user?.username}</strong>!
          </p>
        </div>

      <div>
        <h2>Elije un modo de juego:</h2>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginTop: '1rem' }}>
          {/* Botón naranja a la izquierda */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.95rem' }}>
              Todos en este dispositivo
            </p>
            <button
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                width: '250px',
                backgroundColor: '#fa8023ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Jugar!
            </button>
          </div>

          {/* Botones verde y azul a la derecha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.95rem' }}>
              Cada uno en su dispositivo
            </p>
            <button
              onClick={() => navigate('/create-room')}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                width: '250px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Crear Sala Nueva
            </button>

            <button
              onClick={() => navigate('/join-room')}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                width: '250px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Unirse a Sala
            </button>
          </div>
        </div>

        <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.875rem' }}>
          Para mejorar la experiencia de juego recomendamos la opcion "Cada uno en su dispositivo".

        </p>
          Estas opciones estarán disponibles en la próxima fase del desarrollo.
      </div>
      </div>
    </>
  );
}
