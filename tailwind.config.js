/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src-tauri/**/*.{html,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'ios-gray': '#F2F2F7',
        'ios-blue': '#007AFF',
        'ios-red': '#FF3B30',
        'ios-green': '#34C759',
      }
    },
  },
  plugins: [],
}
