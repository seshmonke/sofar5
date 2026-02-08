import { products } from '../data/products';
import { useAppSelector } from '../store/hooks';

export function ProductList() {
  const selectedCategory = useAppSelector((state) => state.category.selectedCategory);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="row g-3">
      {filteredProducts.map((product) => (
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
  );
}