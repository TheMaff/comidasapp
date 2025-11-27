/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Base (Fondos y Bordes)
        canvas: {
          default: '#ffffff',
          subtle: '#f6f8fa', // Fondo lateral / headers
          inset: '#f6f8fa',
        },
        border: {
          default: '#d0d7de',
          muted: '#d8dee4',
        },
        fg: {
          default: '#24292f', // Texto casi negro
          muted: '#57606a', // Texto gris
        },
        // COLOR PRINCIPAL (VERDE)
        primary: {
          DEFAULT: '#2da44e', // GitHub Green (Success) - Tu color de marca
          hover: '#2c974b',
          bg: '#dafbe1', // Fondo verde muy suave
        },
        // Acentos secundarios
        accent: {
          DEFAULT: '#0969da', // Azul solo para enlaces de texto, no para bloques grandes
        },
        danger: {
          DEFAULT: '#cf222e',
          bg: '#ffebe9'
        }
      },
      boxShadow: {
        'gh': '0 1px 3px rgba(27,31,36,0.12)',
        'header': '0 1px 0 rgba(27,31,36,0.04)', // Sombra sutil solo abajo
      }
    },
  },
  plugins: [],
}