import "./App.css"

function TgData() {
  console.log("ОКНО ОКНААА", window.Telegram?.WebApp);

  return <footer>
    <pre>{JSON.stringify(window.Telegram?.WebApp, null, 2)}</pre>
  </footer>
}

function App() {

  return (
    <div className="sofia-sans-condensed-font text-left">
      <nav className="navbar navbar-expand-lg bg-danger">
        <div className="container-fluid">

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="mx-auto">
            <a href="#" className="navbar-brand text-light">ASSORTI</a>
          </div>







          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#">Новое</a>
              </li>


              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Одежда
                </a>
                <ul className="dropdown-menu bg-danger border-0" id="dropdown1">
                  <li><a className="dropdown-item" href="#">Футболки</a></li>
                  <li><a className="dropdown-item" href="#">Джинсы</a></li>
                  <li><a className="dropdown-item" href="#">Пиджаки</a></li>
                </ul>
              </li>


              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Аксессуары
                </a>
                <ul className="dropdown-menu bg-danger border-0" id="dropdown2">
                  <li><a className="dropdown-item" href="#">Шапки</a></li>
                  <li><a className="dropdown-item" href="#">Ремни</a></li>
                  <li><a className="dropdown-item" href="#">Очки</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">SALE</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>


      <div className="container border border-5">
        <div className="container"> testing </div>


      </div>

    </div>
  )
}

export default App
