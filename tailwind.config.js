/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        windows: '#0078D7'
      },
      fontFamily: {
        sans: ['Segoe UI Variable', 'Segoe UI', 'Noto Sans SC', 'PingFang SC', 'sans-serif']
      },
      boxShadow: {
        tile: '0 10px 30px rgba(15, 23, 42, 0.22)'
      }
    }
  },
  plugins: []
}
