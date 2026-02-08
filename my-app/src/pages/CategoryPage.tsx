import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProductList } from '../components/ProductList';
import { useAppDispatch } from '../store/hooks';
import { setCategory } from '../store/categorySlice';
import { categoryNames } from '../types/categories';
import type { ProductCategory } from '../types/categories';

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (category && category in categoryNames) {
      dispatch(setCategory(category as ProductCategory));
    }
  }, [category, dispatch]);

  const categoryName = category && category in categoryNames 
    ? categoryNames[category as ProductCategory] 
    : 'Категория';

  return (
    <main className="flex-grow-1 py-4">
      <div className="container">
        <h1 className="mb-4">{categoryName}</h1>
        <ProductList />
      </div>
    </main>
  );
}