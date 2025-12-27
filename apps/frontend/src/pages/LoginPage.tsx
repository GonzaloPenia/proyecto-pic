import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import { theme } from '../utils';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!username || !password) {
      setLocalError('Por favor completa todos los campos');
      return;
    }

    try {
      await login({ username, password });
      // Redirigir al dashboard después del login exitoso
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.colors.background.primary,
      padding: '20px'
    }}>
      <div style={{
        background: theme.colors.background.secondary,
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        maxWidth: '400px',
        width: '100%'
      }}>
      <h1 style={{
        textAlign: 'center',
        color: theme.colors.text.primary,
        marginBottom: '20px'
      }}>Iniciar Sesión</h1>

      {(error || localError) && (
        <div style={{
          padding: '1rem',
          backgroundColor: theme.colors.background.error,
          border: `1px solid ${theme.colors.border.error}`,
          borderRadius: '4px',
          marginTop: '1rem',
          color: theme.colors.text.error
        }}>
          {error || localError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}
      >
        <div>
          <label htmlFor="username" style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: theme.colors.text.primary
          }}>
            Usuario
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingresa tu usuario"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: `2px solid ${theme.colors.border.primary}`,
              borderRadius: '5px',
              color: theme.colors.text.primary,
              backgroundColor: theme.colors.background.secondary
            }}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: theme.colors.text.primary
          }}>
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: `2px solid ${theme.colors.border.primary}`,
              borderRadius: '5px',
              color: theme.colors.text.primary,
              backgroundColor: theme.colors.background.secondary
            }}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            marginTop: '1rem',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            background: isLoading ? theme.colors.text.disabled : theme.colors.background.secondary,
            color: theme.colors.text.primary,
            border: `2px solid ${theme.colors.border.primary}`,
            borderRadius: '5px',
            transition: 'all 0.3s'
          }}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: theme.colors.text.primary }}>
        ¿No tienes cuenta? <Link to="/register" style={{ color: theme.colors.text.primary, fontWeight: '600', textDecoration: 'underline' }}>Regístrate aquí</Link>
      </p>
      </div>
    </div>
  );
}
