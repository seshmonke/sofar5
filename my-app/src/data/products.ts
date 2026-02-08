export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Футболка базовая",
    price: 1299,
    image: "https://via.placeholder.com/300x400/D44040/FFFFFF?text=Футболка",
  },
  {
    id: 2,
    name: "Джинсы классические",
    price: 3499,
    image: "https://via.placeholder.com/300x400/D44040/FFFFFF?text=Джинсы"
  },
  {
    id: 3,
    name: "Пиджак деловой",
    price: 5999,
    image: "https://via.placeholder.com/300x400/D44040/FFFFFF?text=Пиджак"
  },
  {
    id: 4,
    name: "Шапка зимняя",
    price: 899,
    image: "https://via.placeholder.com/300x400/D44040/FFFFFF?text=Шапка"
  },
  {
    id: 5,
    name: "Ремень кожаный",
    price: 1599,
    image: "https://via.placeholder.com/300x400/D44040/FFFFFF?text=Ремень"
  },
  {
    id: 6,
    name: "Очки солнцезащитные",
    price: 2299,
    image: "https://via.placeholder.com/300x400/D44040/FFFFFF?text=Очки"
  },
  {
    id: 7,
    name: "Кроссовки спортивные",
    price: 4499,
    image: "https://via.placeholder.com/300x400/D44040/FFFFFF?text=Кроссовки"
  },
  {
    id: 8,
    name: "Рюкзак городской",
    price: 2999,
    image: "https://via.placeholder.com/300x400/D44040/FFFFFF?text=Рюкзак"
  }
];
