const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Datos del menú Esquina Pompeya
const esquinaPompeyaData = {
  user: {
    name: 'Juan Carlos Pérez',
    email: 'admin@esquinapompeya.com',
    password: '123456',
    restaurantName: 'Esquina Pompeya',
    restaurantId: 'esquina-pompeya'
  },
  menu: {
    description: 'Restobar & Parrilla tradicional con auténtica cocina casera',
    contact: '4918-8815 - AV. FERNANDEZ LA CRUZ 1100 - WhatsApp: 11-2857-9746',
    categories: [
      { name: 'Entradas', description: 'Para empezar', position: 0, isActive: true },
      { name: 'Sandwiches Fríos', description: 'Opciones frías', position: 1, isActive: true },
      { name: 'Sandwiches Calientes', description: 'Opciones calientes', position: 2, isActive: true },
      { name: 'Frituras', description: 'Milanesas y supremas', position: 3, isActive: true },
      { name: 'Ensaladas', description: 'Frescas y especiales', position: 4, isActive: true },
      { name: 'Parrilla', description: 'Todos los precios incluyen guarnición', position: 5, isActive: true },
      { name: 'Tortillas', description: 'Tortillas y omelets', position: 6, isActive: true },
      { name: 'Cocina', description: 'Platos caseros', position: 7, isActive: true },
      { name: 'Pastas', description: 'Pastas caseras con salsas', position: 8, isActive: true },
      { name: 'De Mar', description: 'Pescados y mariscos', position: 9, isActive: true },
      { name: 'Platos Fríos de Mar', description: 'Opciones frías del mar', position: 10, isActive: true },
      { name: 'Postres', description: 'Dulces caseros', position: 11, isActive: true },
      { name: 'Helados', description: 'Helados artesanales', position: 12, isActive: true },
      { name: 'Promociones', description: 'Ofertas especiales', position: 13, isActive: true }
    ],
    items: [
      // ENTRADAS
      {
        name: 'Picada para 1',
        categoryName: 'Entradas',
        price: 10000,
        position: 0,
        isAvailable: true
      },
      {
        name: 'Matambre casero c/ rusa',
        categoryName: 'Entradas',
        price: 10000,
        position: 1,
        isAvailable: true
      },
      {
        name: 'Lengua a la vinagreta c/ rusa',
        categoryName: 'Entradas',
        price: 9000,
        position: 2,
        isAvailable: true
      },
      {
        name: 'Mayonesa de ave',
        categoryName: 'Entradas',
        price: 10000,
        position: 3,
        isAvailable: true
      },
      {
        name: 'Mayonesa de atún',
        categoryName: 'Entradas',
        price: 10000,
        position: 4,
        isAvailable: true
      },
      {
        name: 'Pechuga a la criolla c/ rusa',
        categoryName: 'Entradas',
        price: 11000,
        position: 5,
        isAvailable: true
      },
      
      // SANDWICHES FRÍOS
      {
        name: 'Francés Jamón y queso',
        categoryName: 'Sandwiches Fríos',
        price: 6000,
        position: 0,
        isAvailable: true
      },
      {
        name: 'Francés salame y queso',
        categoryName: 'Sandwiches Fríos',
        price: 6000,
        position: 1,
        isAvailable: true
      },
      {
        name: 'Francés J. crudo y queso',
        categoryName: 'Sandwiches Fríos',
        price: 7000,
        position: 2,
        isAvailable: true
      },
      {
        name: 'Sw de matambre casero',
        categoryName: 'Sandwiches Fríos',
        price: 7000,
        position: 3,
        isAvailable: true
      },
      {
        name: 'Pebete',
        categoryName: 'Sandwiches Fríos',
        price: 5000,
        description: 'Versión simple del francés',
        position: 4,
        isAvailable: true
      },
      
      // SANDWICHES CALIENTES
      {
        name: 'Sw. Milanesa simple',
        categoryName: 'Sandwiches Calientes',
        price: 5000,
        position: 0,
        isAvailable: true
      },
      {
        name: 'Sw. Milanesa LyT',
        categoryName: 'Sandwiches Calientes',
        price: 6000,
        description: 'Con lechuga y tomate',
        position: 1,
        isAvailable: true
      },
      {
        name: 'Sw. Milanesa completo',
        categoryName: 'Sandwiches Calientes',
        price: 7000,
        position: 2,
        isAvailable: true
      },
      {
        name: 'Sw. Milanesa napolitana',
        categoryName: 'Sandwiches Calientes',
        price: 7000,
        position: 3,
        isAvailable: true
      },
      {
        name: 'Hamburguesa simple',
        categoryName: 'Sandwiches Calientes',
        price: 8000,
        position: 4,
        isAvailable: true
      },
      {
        name: 'Hamburguesa Completa',
        categoryName: 'Sandwiches Calientes',
        price: 9000,
        position: 5,
        isAvailable: true
      },
      
      // FRITURAS
      {
        name: 'Milanesa de ternera sola',
        categoryName: 'Frituras',
        price: 7000,
        position: 0,
        isAvailable: true,
        description: 'Todos los platos pueden ser acompañados por: Puré de papas / Puré de calabaza / Fritas / Papas al horno'
      },
      {
        name: 'Milanesa c/ fritas',
        categoryName: 'Frituras',
        price: 9000,
        position: 1,
        isAvailable: true
      },
      {
        name: 'Milanesa completa',
        categoryName: 'Frituras',
        price: 10000,
        position: 2,
        isAvailable: true
      },
      {
        name: 'Milanesa Napolitana sola',
        categoryName: 'Frituras',
        price: 12000,
        position: 3,
        isAvailable: true
      },
      {
        name: 'Milanesa Napolitana con fritas',
        categoryName: 'Frituras',
        price: 7000,
        position: 4,
        isAvailable: true
      },
      {
        name: 'Suprema sola',
        categoryName: 'Frituras',
        price: 11000,
        position: 5,
        isAvailable: true
      },
      {
        name: 'Suprema c/ fritas',
        categoryName: 'Frituras',
        price: 14000,
        position: 6,
        isAvailable: true
      },
      {
        name: 'Suprema completa',
        categoryName: 'Frituras',
        price: 14000,
        position: 7,
        isAvailable: true
      },
      {
        name: 'Suprema Napolitana con fritas',
        categoryName: 'Frituras',
        price: 14000,
        position: 8,
        isAvailable: true
      },
      {
        name: 'Milanesa "ESQUINA" p/ 2',
        categoryName: 'Frituras',
        price: 30000,
        description: 'Queso timbo, jamón crudo, rúcula, parmesano, aceitunas',
        position: 9,
        isAvailable: true
      },

      // PARRILLA
      {
        name: 'Asado de tira',
        categoryName: 'Parrilla',
        price: 15000,
        position: 0,
        isAvailable: true,
        description: 'Todos los precios son con guarnición: fritas'
      },
      {
        name: 'Bife de chorizo',
        categoryName: 'Parrilla',
        price: 15000,
        position: 1,
        isAvailable: true
      },
      {
        name: 'Bife c/ lomo',
        categoryName: 'Parrilla',
        price: 15000,
        position: 2,
        isAvailable: true
      },
      {
        name: 'Bife cuadril',
        categoryName: 'Parrilla',
        price: 15000,
        position: 3,
        isAvailable: true
      },
      {
        name: 'Costillas cerdo (2)',
        categoryName: 'Parrilla',
        price: 10000,
        position: 4,
        isAvailable: true
      },
      {
        name: 'Bondiola',
        categoryName: 'Parrilla',
        price: 15000,
        position: 5,
        isAvailable: true
      },
      {
        name: 'Riñones provenzal',
        categoryName: 'Parrilla',
        price: 9000,
        position: 6,
        isAvailable: true
      },
      
      // PASTAS
      {
        name: 'Spaghettis c/ tuco',
        categoryName: 'Pastas',
        price: 6000,
        position: 0,
        isAvailable: true
      },
      {
        name: 'Spaghettis c/ s. mixta',
        categoryName: 'Pastas',
        price: 7000,
        position: 1,
        isAvailable: true
      },
      {
        name: 'Spaghettis c/ bolognesa',
        categoryName: 'Pastas',
        price: 8000,
        position: 2,
        isAvailable: true
      },
      {
        name: 'Spaghettis c/ estofado',
        categoryName: 'Pastas',
        price: 10000,
        position: 3,
        isAvailable: true
      },
      {
        name: 'Ñoquis caseros c/ tuco',
        categoryName: 'Pastas',
        price: 6000,
        position: 4,
        isAvailable: true
      },
      {
        name: 'Ñoquis caseros c/ bolognesa',
        categoryName: 'Pastas',
        price: 9000,
        position: 5,
        isAvailable: true
      },
      {
        name: 'Ravioles c/ tuco',
        categoryName: 'Pastas',
        price: 9000,
        position: 6,
        isAvailable: true
      },
      {
        name: 'Ravioles c/ bolognesa',
        categoryName: 'Pastas',
        price: 12000,
        position: 7,
        isAvailable: true
      },
      
      // POSTRES
      {
        name: 'Flan casero solo',
        categoryName: 'Postres',
        price: 2000,
        position: 0,
        isAvailable: true
      },
      {
        name: 'Flan casero c/ crema o dulce',
        categoryName: 'Postres',
        price: 3000,
        position: 1,
        isAvailable: true
      },
      {
        name: 'Flan casero mixto',
        categoryName: 'Postres',
        price: 3500,
        position: 2,
        isAvailable: true
      },
      {
        name: 'Budín de pan casero',
        categoryName: 'Postres',
        price: 2000,
        position: 3,
        isAvailable: true
      },
      {
        name: 'Budín de pan casero c/ crema o dulce',
        categoryName: 'Postres',
        price: 3000,
        position: 4,
        isAvailable: true
      },
      {
        name: 'Ensalada de frutas',
        categoryName: 'Postres',
        price: 4000,
        position: 5,
        isAvailable: true
      },
      {
        name: 'Ensalada c/ crema',
        categoryName: 'Postres',
        price: 5500,
        position: 6,
        isAvailable: true
      },
      {
        name: 'Queso y dulce',
        categoryName: 'Postres',
        price: 5500,
        position: 7,
        isAvailable: true
      },

      // HELADOS
      {
        name: 'Bocha de helado',
        categoryName: 'Helados',
        price: 4000,
        position: 0,
        isAvailable: true
      },
      {
        name: 'Almendrado',
        categoryName: 'Helados',
        price: 5000,
        position: 1,
        isAvailable: true
      }
    ],
    settings: {
      showPrices: true,
      showImages: true,
      showDescriptions: true,
      currency: '$',
      language: 'es'
    },
    theme: {
      colors: '#8B4513,#D2691E,#F5F5DC,#2F2F2F'
    }
  }
};

const createEsquinaPompeyaMenu = async () => {
  try {
    console.log('🚀 Creando menú de Esquina Pompeya...');
    
    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({ 
      where: { restaurantId: 'esquina-pompeya' }
    });
    
    if (existingUser) {
      console.log('⚠️ El restaurante Esquina Pompeya ya existe');
      return;
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(esquinaPompeyaData.user.password, 12);

    // Crear todo en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear usuario
      const user = await tx.user.create({
        data: {
          name: esquinaPompeyaData.user.name,
          email: esquinaPompeyaData.user.email,
          password: hashedPassword,
          restaurantName: esquinaPompeyaData.user.restaurantName,
          restaurantId: esquinaPompeyaData.user.restaurantId,
          role: 'ADMIN'
        }
      });

      console.log('✅ Usuario creado');

      // Crear menú
      const menu = await tx.menu.create({
        data: {
          restaurantId: esquinaPompeyaData.user.restaurantId,
          restaurantName: esquinaPompeyaData.user.restaurantName,
          description: esquinaPompeyaData.menu.description,
          contact: esquinaPompeyaData.menu.contact,
          themeColors: esquinaPompeyaData.menu.theme.colors,
          welcomeMessage: `¡Bienvenido a ${esquinaPompeyaData.user.restaurantName}!`,
          showPrices: esquinaPompeyaData.menu.settings.showPrices,
          ownerId: user.id
        }
      });

      console.log('✅ Menú creado');

      // Crear categorías
      const createdCategories = [];
      for (const categoryData of esquinaPompeyaData.menu.categories) {
        const category = await tx.category.create({
          data: {
            name: categoryData.name,
            description: categoryData.description,
            position: categoryData.position,
            isActive: categoryData.isActive,
            menuId: menu.id
          }
        });
        createdCategories.push(category);
      }

      console.log('✅ Categorías creadas:', createdCategories.length);

      // Crear mapeo de nombres de categoría a IDs
      const categoryMap = {};
      createdCategories.forEach(cat => {
        categoryMap[cat.name] = cat.id;
      });

      // Crear items
      let itemsCreated = 0;
      for (const itemData of esquinaPompeyaData.menu.items) {
        const categoryId = categoryMap[itemData.categoryName];
        if (categoryId) {
          await tx.menuItem.create({
            data: {
              name: itemData.name,
              description: itemData.description || null,
              price: itemData.price,
              position: itemData.position,
              isAvailable: itemData.isAvailable,
              categoryId: categoryId
            }
          });
          itemsCreated++;
        }
      }

      console.log('✅ Items creados:', itemsCreated);

      return { user, menu, categoriesCount: createdCategories.length, itemsCount: itemsCreated };
    });
    
    console.log(`
🎉 ¡Menú de Esquina Pompeya creado exitosamente!
    
📋 Estadísticas:
- Categorías: ${result.categoriesCount}
- Productos: ${result.itemsCount}
- URL pública: http://localhost:3000/${esquinaPompeyaData.user.restaurantId}
- Panel admin: http://localhost:3000/admin/login
  - Email: ${esquinaPompeyaData.user.email}
  - Password: ${esquinaPompeyaData.user.password}
    `);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  createEsquinaPompeyaMenu()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { createEsquinaPompeyaMenu, esquinaPompeyaData };