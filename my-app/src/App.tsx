import "./App.css"
import { Routes, Route, Link } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { CategoryPage } from './pages/CategoryPage'

function App() {
  return (
    <div className="d-flex flex-column min-vh-100 sofia-sans-condensed-font text-left">
      <nav className="navbar navbar-expand-lg bg-danger">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="mx-auto">
            <Link to="/" className="navbar-brand text-light">ASSORTI</Link>
          </div>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link text-light" to="/">Все товары</Link>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-light" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Одежда
                </a>
                <ul className="dropdown-menu bg-danger border-0" id="dropdown1">
                  <li><Link className="dropdown-item text-light" to="/category/tshirts">Футболки</Link></li>
                  <li><Link className="dropdown-item text-light" to="/category/jeans">Джинсы</Link></li>
                  <li><Link className="dropdown-item text-light" to="/category/jackets">Пиджаки</Link></li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-light" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Аксессуары
                </a>
                <ul className="dropdown-menu bg-danger border-0" id="dropdown2">
                  <li><Link className="dropdown-item text-light" to="/category/hats">Шапки</Link></li>
                  <li><Link className="dropdown-item text-light" to="/category/belts">Ремни</Link></li>
                  <li><Link className="dropdown-item text-light" to="/category/glasses">Очки</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="#">SALE</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
      </Routes>

      <footer className="bg-dark text-light py-5 mt-auto text-center fs-1">
        <div className="container-fluid">
          ТУТ БУДЕТ ФУТЕР
        </div>
      </footer>
    </div>
  )
}

export default App