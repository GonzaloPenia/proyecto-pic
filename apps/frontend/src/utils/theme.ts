/**
 * Configuración centralizada de colores del tema de la aplicación.
 * Cambiar estos valores actualizará los colores en toda la aplicación.
 */
export const theme = {
  colors: {
    primary: '#1d265c',     // Color principal (azul)
    secondary: 'white',     // Color secundario (blanco)
    text: {
      primary: '#1d265c',   // Texto en color primario
      secondary: 'white',   // Texto en color secundario
      disabled: '#999',     // Texto/fondo deshabilitado
      error: '#c00',        // Color de error
    },
    background: {
      primary: '#1d265c',   // Fondo principal
      secondary: 'white',   // Fondo secundario
      error: '#fee',        // Fondo de error
    },
    border: {
      primary: '#1d265c',   // Borde principal
      secondary: 'white',   // Borde secundario
      error: '#fcc',        // Borde de error
    }
  }
} as const;
