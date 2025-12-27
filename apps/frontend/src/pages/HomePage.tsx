import { Link } from 'react-router-dom';
import { theme } from '../utils';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.colors.background.primary,
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ color: theme.colors.text.secondary, fontSize: '3rem', marginBottom: '1rem' }}>Bienvenido a Pictionary Online</h1>
      <p style={{ color: theme.colors.text.secondary, fontSize: '1.2rem', marginBottom: '3rem' }}>Juega Pictionary con tus amigos en tiempo real</p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: '600',
            background: theme.colors.background.secondary,
            color: theme.colors.text.primary,
            border: `2px solid ${theme.colors.border.secondary}`,
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}>
            Iniciar Sesión
          </button>
        </Link>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: '600',
            background: theme.colors.background.primary,
            color: theme.colors.text.secondary,
            border: `2px solid ${theme.colors.border.secondary}`,
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}>
            Registrarse
          </button>
        </Link>
      </div>
    </div>
  );
}
