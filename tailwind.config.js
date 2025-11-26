/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta inspirada en GitHub Light Theme
        canvas: {
          default: '#ffffff',
          subtle: '#f6f8fa', // Fondo de headers/barras laterales
          inset: '#f6f8fa',
        },
        border: {
          default: '#d0d7de', // Borde gris clásico
          muted: '#d8dee4',
        },
        fg: {
          default: '#24292f', // Texto principal (casi negro)
          muted: '#57606a', // Texto secundario (gris)
          subtle: '#6e7781',
        },
        // Color de acento (puedes cambiar este verde por el que quieras)
        accent: {
          DEFAULT: '#0969da', // GitHub Blue (para enlaces/botones)
          fg: '#ffffff',
        },
        success: {
          DEFAULT: '#2da44e', // GitHub Green (para acciones positivas/completado)
          subtle: '#dafbe1',
        }
      },
      // Sombra estilo tarjeta de GitHub
      boxShadow: {
        'gh': '0 1px 3px rgba(27,31,36,0.12)',
      }
    },
  },
  plugins: [],
}