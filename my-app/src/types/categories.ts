export type ProductCategory = 
  | 'all'          // Все товары
  | 'tshirts'      // Футболки
  | 'jeans'        // Джинсы
  | 'jackets'      // Пиджаки
  | 'hats'         // Шапки
  | 'belts'        // Ремни
  | 'glasses'      // Очки
  | 'shoes'        // Кроссовки
  | 'bags';        // Рюкзаки

export const categoryNames: Record<ProductCategory, string> = {
  all: 'Все товары',
  tshirts: 'Футболки',
  jeans: 'Джинсы',
  jackets: 'Пиджаки',
  hats: 'Шапки',
  belts: 'Ремни',
  glasses: 'Очки',
  shoes: 'Кроссовки',
  bags: 'Рюкзаки'
};