import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'
import './index.css'

// Принудительно устанавливаем тему cupcake
// document.documentElement.setAttribute('data-theme', 'cupcake')

// Дебаг информация о теме DaisyUI
setTimeout(() => {
  console.log('🎨 Тема DaisyUI проверка:')
  console.log('data-theme атрибут:', document.documentElement.getAttribute('data-theme'))
  console.log('CSS переменные:')
  const styles = getComputedStyle(document.documentElement)
  console.log('  --p (primary):', styles.getPropertyValue('--p'))
  console.log('  --s (secondary):', styles.getPropertyValue('--s'))
  console.log('  --a (accent):', styles.getPropertyValue('--a'))
  console.log('  --b1 (base-100):', styles.getPropertyValue('--b1'))
  console.log('  --bc (base-content):', styles.getPropertyValue('--bc'))
  
  // Проверяем характерные цвета cupcake
  console.log('🧁 Цвета темы cupcake должны быть пастельными:')
  console.log('  Primary должен быть розово-фиолетовым')
  console.log('  Secondary должен быть нежно-розовым')
  console.log('  Accent должен быть мятно-зеленым')
}, 1000)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
) 