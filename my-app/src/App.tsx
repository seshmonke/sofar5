import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  try { console.log('Тест окна TMA', window.Telegram) } catch (error) {console.log('Ошибка', error)};
  

  const [telegramData, setTelegramData] = useState(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      try {
        const parsedData = JSON.parse(window.Telegram.WebApp.initData);
        setTelegramData(parsedData);
      } catch (error) {
        console.error('Ошибка парсинга данных Telegram:', error);
      }
    }
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {telegramData && (
        <div>
          <h2>Данные Telegram:</h2>
          <pre>{JSON.stringify(telegramData, null, 2)}</pre>
        </div>
      )}
    </>
  )
}

export default App
