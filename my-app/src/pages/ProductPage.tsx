import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products, DELIVERY_INFO } from '../data/products';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/cartSlice';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const product = products.find(p => p.id === Number(id));

  // Автоматически выбираем размер, если он один
  useEffect(() => {
    if (product && product.sizes.length === 1) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <main className="flex-grow-1 py-4">
        <div className="container">
          <div className="alert alert-danger" role="alert">
            Товар не найден
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Вернуться на главную
          </button>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ product, size: selectedSize }));
    setIsAdded(true);
    
    // Возвращаем кнопку в исходное состояние через 2 секунды
    setTimeout(() => {
      setIsAdded(false);
    }, 600);
  };

  return (
    <main className="flex-grow-1 py-4">
      <div className="container">
        <button 
          className="btn btn-outline-secondary mb-4"
          onClick={() => navigate(-1)}
        >
          ← Назад
        </button>

        <div className="row g-4">
          {/* Фото товара */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <img 
                src={product.image} 
                className="card-img-top" 
                alt={product.name}
                style={{ objectFit: 'cover', height: '500px' }}
              />
            </div>
          </div>

          {/* Информация о товаре */}
          <div className="col-lg-6">
            <h1 className="mb-3">{product.name}</h1>
            
            {/* Цена */}
            <div className="mb-4">
              <p className="fs-3 fw-bold text-danger">{product.price} ₽</p>
            </div>

            {/* Описание */}
            <div className="mb-4">
              <h5>Описание</h5>
              <p className="text-muted">{product.description}</p>
            </div>

            {/* Размеры */}
            <div className="mb-4">
              <h5>Размер</h5>
              <div className="d-flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`btn ${
                      selectedSize === size
                        ? 'btn-danger'
                        : 'btn-outline-danger'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Состав */}
            <div className="mb-4">
              <h5>Состав</h5>
              <div className="card bg-light border-0">
                <div className="card-body">
                  {Object.entries(product.composition).map(([material, percentage]) => (
                    <div key={material} className="d-flex justify-content-between mb-2">
                      <span>{material}</span>
                      <strong>{percentage}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Доставка */}
            <div className="mb-4">
              <h5>Доставка и возврат</h5>
              <div className="alert alert-info mb-0">
                {DELIVERY_INFO}
              </div>
            </div>

            {/* Кнопка добавления в корзину */}
            <button 
              className={`btn btn-lg w-100 add-to-cart-btn ${isAdded ? 'btn-added' : 'btn-danger'}`}
              onClick={handleAddToCart}
              disabled={!selectedSize || isAdded}
              style={{
                transition: 'all 0.3s ease'
              }}
            >
              {isAdded ? 'Добавлено' : 'Добавить в корзину'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
