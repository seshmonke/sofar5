import { useEffect } from 'react';
import { ProductList } from '../components/ProductList';
import { useAppDispatch } from '../store/hooks';
import { setCategory } from '../store/categorySlice';

export function HomePage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCategory('all'));
  }, [dispatch]);

  return (
    <main className="flex-grow-1 py-4">
      <div className="container">
        <h1 className="mb-4">Все товары</h1>
        <ProductList />
      </div>
    </main>
  );
}