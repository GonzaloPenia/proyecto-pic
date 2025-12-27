import { useAuth } from '../contexts';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/common';
import { theme } from '../utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: theme.colors.background.primary,
        padding: '2rem'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: theme.colors.text.secondary }}>Pingonary</h1>
          <p style={{ marginTop: '0.5rem', color: theme.colors.text.secondary }}>
            Bienvenido, <strong style={{ color: theme.colors.text.secondary }}>{user?.username}</strong>!
          </p>
        </div>

      <div>
        <h2 style={{ color: theme.colors.text.secondary }}>Elije un modo de juego:</h2>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginTop: '1rem' }}>
          {/* Botón a la izquierda */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.95rem', color: theme.colors.text.secondary }}>
              Todos en este dispositivo
            </p>
            <button
              style={{
                padding: '14px 24px',
                fontSize: '16px',
                fontWeight: '600',
                width: '250px',
                backgroundColor: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                border: `2px solid ${theme.colors.border.secondary}`,
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Jugar!
            </button>
          </div>

          {/* Botones a la derecha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.95rem', color: theme.colors.text.secondary }}>
              Cada uno en su dispositivo
            </p>
            <button
              onClick={() => navigate('/create-room')}
              style={{
                padding: '14px 24px',
                fontSize: '16px',
                fontWeight: '600',
                width: '250px',
                backgroundColor: theme.colors.background.primary,
                color: theme.colors.text.secondary,
                border: `2px solid ${theme.colors.border.secondary}`,
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Crear Sala Nueva
            </button>

            <button
              onClick={() => navigate('/join-room')}
              style={{
                padding: '14px 24px',
                fontSize: '16px',
                fontWeight: '600',
                width: '250px',
                backgroundColor: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                border: `2px solid ${theme.colors.border.secondary}`,
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Unirse a Sala
            </button>
          </div>
        </div>

        <p style={{ marginTop: '1rem', color: theme.colors.text.secondary, fontSize: '0.875rem' }}>
          Para mejorar la experiencia de juego recomendamos la opcion "Cada uno en su dispositivo".

        </p>
        <p style={{ color: theme.colors.text.secondary, fontSize: '0.875rem' }}>
          Estas opciones estarán disponibles en la próxima fase del desarrollo.
        </p>
      </div>
      </div>
    </>
  );
}
