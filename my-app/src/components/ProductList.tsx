import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/cartSlice';

interface ProductListProps {
  onAddToCart?: () => void;
}

export function ProductList({ onAddToCart }: ProductListProps) {
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector((state) => state.category.selectedCategory);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleAddToCart = (product: typeof products[0]) => {
    dispatch(addToCart(product));
    onAddToCart?.();
  };

  return (
    <div className="row g-3">
      {filteredProducts.map((product) => (
        <div key={product.id} className="col-6 col-lg-3">
          <div className="card h-100 shadow-sm">
            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img 
                src={product.image} 
                className="card-img-top" 
                alt={product.name}
                style={{ objectFit: 'cover', height: '250px', cursor: 'pointer' }}
              />
            </Link>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title fs-6">{product.name}</h5>
              <div className="mt-auto">
                <p className="fw-bold fs-5 mb-2 text-danger">{product.price} ₽</p>
                <button 
                  className="btn btn-danger w-100"
                  onClick={() => handleAddToCart(product)}
                >
                  Купить
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
