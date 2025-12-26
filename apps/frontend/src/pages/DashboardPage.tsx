import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1>Dashboard</h1>
          <p style={{ marginTop: '0.5rem', color: '#666' }}>
            Bienvenido, <strong>{user?.username}</strong>!
          </p>
          <p style={{ fontSize: '0.875rem', color: '#999' }}>
            {user?.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginTop: 0 }}>Información de la Cuenta</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <p><strong>ID:</strong> {user?.id}</p>
          <p><strong>Usuario:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Estado:</strong> {user?.isActive ? 'Activo' : 'Inactivo'}</p>
          <p><strong>Miembro desde:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>

      <div>
        <h2>Opciones del Juego:</h2>
        <ul style={{ marginTop: '1rem', listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <button
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
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <button
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
          </li>
        </ul>
        <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.875rem' }}>
          Estas opciones estarán disponibles en la próxima fase del desarrollo.
        </p>
      </div>
    </div>
  );
}
