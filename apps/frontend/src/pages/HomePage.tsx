import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Bienvenido a Pictionary Online</h1>
      <p>Juega Pictionary con tus amigos en tiempo real</p>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/login">
          <button style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
            Iniciar Sesión
          </button>
        </Link>
        <Link to="/register">
          <button style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
            Registrarse
          </button>
        </Link>
      </div>
    </div>
  );
}
