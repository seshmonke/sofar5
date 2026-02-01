import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

function App() {
  const [count, setCount] = useState(0)
  console.log('ОКНО ОКНААА', window.Telegram?.WebApp);

  return (
    <>
      <header></header>
      <main></main>
      <footer>
        <pre>{JSON.stringify(window.Telegram?.WebApp, null, 2)}</pre>
      </footer>
    </>
  )
}

export default App
