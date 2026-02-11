import { useAppDispatch, useAppSelector } from '../store/hooks';
import { removeFromCart, updateQuantity } from '../store/cartSlice';
import { Link } from 'react-router-dom';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const dispatch = useAppDispatch();
  const { items, totalPrice } = useAppSelector((state) => state.cart);

  const handleRemove = (id: number, size: string) => {
    dispatch(removeFromCart({ id, size }));
  };

  const handleQuantityChange = (id: number, quantity: number, size: string) => {
    dispatch(updateQuantity({ id, quantity, size }));
  };

  return (
    <div
      className={`modal fade ${isOpen ? 'show' : ''}`}
      style={{ display: isOpen ? 'block' : 'none' }}
      tabIndex={-1}
      role="dialog"
      aria-labelledby="cartModalLabel"
      aria-hidden={!isOpen}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header bg-danger text-light">
            <h5 className="modal-title" id="cartModalLabel">
              Корзина
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {items.length === 0 ? (
              <p className="text-center text-muted py-4">Корзина пуста</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Товар</th>
                      <th>Размер</th>
                      <th>Цена</th>
                      <th>Количество</th>
                      <th>Сумма</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={`${item.id}-${item.size}`}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                            />
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td>{item.size}</td>
                        <td>{item.price} ₽</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1, item.size)
                              }
                            >
                              −
                            </button>
                            <span style={{ minWidth: '30px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1, item.size)
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="fw-bold">
                          {item.price * item.quantity} ₽
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemove(item.id, item.size)}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="modal-footer bg-light border-top">
            <div className="w-100 d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted">Итого:</span>
                <h5 className="mb-0 text-danger fw-bold">{totalPrice} ₽</h5>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Продолжить покупки
                </button>
                {items.length > 0 && (
                  <Link
                    to="/checkout"
                    className="btn btn-danger"
                    onClick={onClose}
                  >
                    Оформить заказ
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
