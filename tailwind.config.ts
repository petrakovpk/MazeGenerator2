import type { Config } from 'tailwindcss'

const config: Config & { daisyui?: any } = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["cupcake"], // Только тема cupcake
    darkTheme: "cupcake", // Принудительно cupcake даже в темном режиме
    base: true, // Базовые стили
    styled: true, // Стилизованные компоненты
    utils: true, // Утилиты
    prefix: "", // Без префикса
    logs: true, // Логи для дебага
  },
}

export default config 