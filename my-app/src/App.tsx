import "./App.css"
import { products } from "./data/products"

// function TgData() {
//   console.log("ОКНО ОКНААА", window.Telegram?.WebApp);

//   return <footer>
//     <pre>{JSON.stringify(window.Telegram?.WebApp, null, 2)}</pre>
//   </footer>
// }

function App() {

  return (
    <div className="d-flex flex-column min-vh-100 sofia-sans-condensed-font text-left">
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
                <a className="nav-link text-light" href="#">Новое</a>
              </li>


              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-light" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Одежда
                </a>
                <ul className="dropdown-menu bg-danger border-0" id="dropdown1">
                  <li><a className="dropdown-item text-light" href="#">Футболки</a></li>
                  <li><a className="dropdown-item text-light" href="#">Джинсы</a></li>
                  <li><a className="dropdown-item text-light" href="#">Пиджаки</a></li>
                </ul>
              </li>


              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-light" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Аксессуары
                </a>
                <ul className="dropdown-menu bg-danger border-0" id="dropdown2">
                  <li><a className="dropdown-item text-light" href="#">Шапки</a></li>
                  <li><a className="dropdown-item text-light" href="#">Ремни</a></li>
                  <li><a className="dropdown-item text-light" href="#">Очки</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="#">SALE</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container border border-5">
        <div className="container"> testing </div>


      </div>

      <main className="flex-grow-1 py-4">
        <div className="container">
          <div className="row g-3">
            {products.map((product) => (
              <div key={product.id} className="col-6 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <img 
                    src={product.image} 
                    className="card-img-top" 
                    alt={product.name}
                    style={{ objectFit: 'cover', height: '250px' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fs-6">{product.name}</h5>
                    <div className="mt-auto">
                      <p className="fw-bold fs-5 mb-2 text-danger">{product.price} ₽</p>
                      <button className="btn btn-danger w-100">Купить</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-dark text-light py-5 mt-auto text-center fs-1">
        <div className="container-fluid">
          ТУТ БУДЕТ ФУТЕР
        </div>
      </footer>


    </div>
  )
}

export default App
