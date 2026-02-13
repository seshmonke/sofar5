import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AssortiShop API',
      version: '1.0.0',
      description: 'API документация для асортиментного магазина',
      contact: {
        name: 'AssortiShop Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'http://localhost:3001',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Уникальный идентификатор категории',
              example: 'cuid123abc',
            },
            name: {
              type: 'string',
              description: 'Название категории',
              example: 'Электроника',
            },
            slug: {
              type: 'string',
              description: 'URL-friendly название',
              example: 'elektronika',
            },
            description: {
              type: 'string',
              description: 'Описание категории',
              example: 'Электронные товары и гаджеты',
            },
            image: {
              type: 'string',
              description: 'URL изображения категории',
              example: 'https://example.com/images/electronics.jpg',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата последнего обновления',
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Уникальный идентификатор продукта',
              example: 'cuid456def',
            },
            name: {
              type: 'string',
              description: 'Название продукта',
              example: 'Смартфон Samsung Galaxy S21',
            },
            slug: {
              type: 'string',
              description: 'URL-friendly название',
              example: 'smartfon-samsung-galaxy-s21',
            },
            description: {
              type: 'string',
              description: 'Описание продукта',
              example: 'Мощный смартфон с отличной камерой',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Цена продукта',
              example: 49999.99,
            },
            image: {
              type: 'string',
              description: 'URL изображения продукта',
              example: 'https://example.com/images/samsung-s21.jpg',
            },
            stock: {
              type: 'integer',
              description: 'Количество на складе',
              example: 15,
            },
            categoryId: {
              type: 'string',
              description: 'ID категории',
              example: 'cuid123abc',
            },
            category: {
              $ref: '#/components/schemas/Category',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата последнего обновления',
            },
          },
          required: ['id', 'name', 'price', 'categoryId'],
        },
        PaginatedProducts: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Product',
              },
            },
            total: {
              type: 'integer',
              description: 'Общее количество продуктов',
              example: 50,
            },
            page: {
              type: 'integer',
              description: 'Текущая страница',
              example: 1,
            },
            limit: {
              type: 'integer',
              description: 'Количество элементов на странице',
              example: 10,
            },
            totalPages: {
              type: 'integer',
              description: 'Общее количество страниц',
              example: 5,
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
            },
            message: {
              type: 'string',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Ошибка при обработке запроса',
            },
            statusCode: {
              type: 'integer',
              example: 400,
            },
          },
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
