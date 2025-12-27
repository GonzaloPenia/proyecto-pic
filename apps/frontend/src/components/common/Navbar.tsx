import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      right: 0,
      padding: '1rem 1.5rem',
      zIndex: 1000,
    }}>
      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <span style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.87)',
          }}>
            {user.username}
          </span>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#3d4e70',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: 600,
            color: '#fff',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            transition: 'border-color 0.2s',
          }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
        </button>

        {isDropdownOpen && (
          <div style={{
            position: 'absolute',
            top: '60px',
            right: 0,
            backgroundColor: '#3d4e70',
            borderRadius: '8px',
            padding: '1.5rem',
            minWidth: '300px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.87)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '0.5rem',
            }}>
              Información de la Cuenta
            </h3>

            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <strong style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>ID:</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255, 255, 255, 0.87)', fontSize: '0.9rem' }}>
                  {user.id}
                </p>
              </div>

              <div>
                <strong style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>Usuario:</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255, 255, 255, 0.87)', fontSize: '0.9rem' }}>
                  {user.username}
                </p>
              </div>

              <div>
                <strong style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>Email:</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255, 255, 255, 0.87)', fontSize: '0.9rem' }}>
                  {user.email}
                </p>
              </div>

              <div>
                <strong style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>Estado:</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255, 255, 255, 0.87)', fontSize: '0.9rem' }}>
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </p>
              </div>

              <div>
                <strong style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>Miembro desde:</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255, 255, 255, 0.87)', fontSize: '0.9rem' }}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 500,
                marginTop: '0.5rem',
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
