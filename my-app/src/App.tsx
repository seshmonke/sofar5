import "./App.css"
import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { loadFromLocalStorage } from './store/cartSlice'
import { HomePage } from './pages/HomePage'
import { CategoryPage } from './pages/CategoryPage'
import { CartPage } from './pages/CartPage'
import { ProductPage } from './pages/ProductPage'
import { CartModal } from './components/CartModal'

function App() {
  const dispatch = useAppDispatch();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItemsCount = useAppSelector((state) => state.cart.items.length);

  useEffect(() => {
    dispatch(loadFromLocalStorage());
  }, [dispatch]);

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
                <Link className="nav-link text-light" to="/category/sale">SALE</Link>
              </li>
            </ul>
          </div>

          <button
            className="btn btn-light ms-auto position-relative"
            onClick={() => setIsCartOpen(true)}
            style={{ marginRight: '10px' }}
          >
            🛒 Корзина
            {cartItemsCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
                style={{ transform: 'translate(-50%, -50%)' }}
              >
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<CartPage />} />
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
