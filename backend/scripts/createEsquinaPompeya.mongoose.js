const mongoose = require('mongoose');
const User = require('../models/User');
const Menu = require('../models/Menu');
require('dotenv').config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/menuqr', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📦 MongoDB conectado');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

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
    contact: {
      phone: '4918-8815',
      address: 'AV. FERNANDEZ LA CRUZ 1100',
      whatsapp: '11-2857-9746'
    },
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
        category: 'Entradas',
        price: 10000,
        position: 0,
        isAvailable: true
      },
      {
        name: 'Matambre casero c/ rusa',
        category: 'Entradas',
        price: 10000,
        position: 1,
        isAvailable: true
      },
      {
        name: 'Lengua a la vinagreta c/ rusa',
        category: 'Entradas',
        price: 9000,
        position: 2,
        isAvailable: true
      },
      {
        name: 'Mayonesa de ave',
        category: 'Entradas',
        price: 10000,
        position: 3,
        isAvailable: true
      },
      {
        name: 'Mayonesa de atún',
        category: 'Entradas',
        price: 10000,
        position: 4,
        isAvailable: true
      },
      {
        name: 'Pechuga a la criolla c/ rusa',
        category: 'Entradas',
        price: 11000,
        position: 5,
        isAvailable: true
      },
      
      // SANDWICHES FRÍOS
      {
        name: 'Francés Jamón y queso',
        category: 'Sandwiches Fríos',
        price: 6000,
        position: 0,
        isAvailable: true
      },
      {
        name: 'Francés salame y queso',
        category: 'Sandwiches Fríos',
        price: 6000,
        position: 1,
        isAvailable: true
      },
      {
        name: 'Francés J. crudo y queso',
        category: 'Sandwiches Fríos',
        price: 7000,
        position: 2,
        isAvailable: true
      },
      {
        name: 'Sw de matambre casero',
        category: 'Sandwiches Fríos',
        price: 7000,
        position: 3,
        isAvailable: true
      },
      {
        name: 'Pebete',
        category: 'Sandwiches Fríos',
        price: 5000,
        description: 'Versión simple del francés',
        position: 4,
        isAvailable: true
      },
      
      // SANDWICHES CALIENTES
      {
        name: 'Sw. Milanesa simple',
        category: 'Sandwiches Calientes',
        price: 5000,
        position: 0,
        isAvailable: true
      },
      {
        name: 'Sw. Milanesa LyT',
        category: 'Sandwiches Calientes',
        price: 6000,
        description: 'Con lechuga y tomate',
        position: 1,
        isAvailable: true
      },
      {
        name: 'Sw. Milanesa completo',
        category: 'Sandwiches Calientes',
        price: 7000,
        position: 2,
        isAvailable: true
      },
      {
        name: 'Sw. Milanesa napolitana',
        category: 'Sandwiches Calientes',
        price: 7000,
        position: 3,
        isAvailable: true
      },
      {
        name: 'Hamburguesa simple',
        category: 'Sandwiches Calientes',
        price: 8000,
        position: 4,
        isAvailable: true
      },
      {
        name: 'Hamburguesa Completa',
        category: 'Sandwiches Calientes',
        price: 9000,
        position: 5,
        isAvailable: true
      },
      
      // FRITURAS
      {
        name: 'Milanesa de ternera sola',
        category: 'Frituras',
        price: 7000,
        position: 0,
        isAvailable: true,
        description: 'Todos los platos pueden ser acompañados por: Puré de papas / Puré de calabaza / Fritas / Papas al horno'
      },
      {
        name: 'Milanesa c/ fritas',
        category: 'Frituras',
        price: 9000,
        position: 1,
        isAvailable: true
      },
      {
        name: 'Milanesa completa',
        category: 'Frituras',
        price: 10000,
        position: 2,
        isAvailable: true
      },
      {
        name: 'Milanesa Napolitana sola',
        category: 'Frituras',
        price: 12000,
        position: 3,
        isAvailable: true
      },
      {
        name: 'Milanesa Napolitana con fritas',
        category: 'Frituras',
        price: 7000,
        position: 4,
        isAvailable: true
      },
      {
        name: 'Suprema sola',
        category: 'Frituras',
        price: 11000,
        position: 5,
        isAvailable: true
      },
      {
        name: 'Suprema c/ fritas',
        category: 'Frituras',
        price: 14000,
        position: 6,
        isAvailable: true
      },
      {
        name: 'Suprema completa',
        category: 'Frituras',
        price: 14000,
        position: 7,
        isAvailable: true
      },
      {
        name: 'Suprema Napolitana con fritas',
        category: 'Frituras',
        price: 14000,
        position: 8,
        isAvailable: true
      },
      {
        name: 'Milanesa "ESQUINA" p/ 2',
        category: 'Frituras',
        price: 30000,
        description: 'Queso timbo, jamón crudo, rúcula, parmesano, aceitunas',
        position: 9,
        isAvailable: true,
        isPopular: true
      },

      // PARRILLA
      {
        name: 'Asado de tira',
        category: 'Parrilla',
        price: 15000,
        position: 0,
        isAvailable: true,
        description: 'Todos los precios son con guarnición: fritas'
      },
      {
        name: 'Bife de chorizo',
        category: 'Parrilla',
        price: 15000,
        position: 1,
        isAvailable: true
      },
      {
        name: 'Bife c/ lomo',
        category: 'Parrilla',
        price: 15000,
        position: 2,
        isAvailable: true
      },
      {
        name: 'Bife cuadril',
        category: 'Parrilla',
        price: 15000,
        position: 3,
        isAvailable: true
      },
      {
        name: 'Costillas cerdo (2)',
        category: 'Parrilla',
        price: 10000,
        position: 4,
        isAvailable: true
      },
      {
        name: 'Bondiola',
        category: 'Parrilla',
        price: 15000,
        position: 5,
        isAvailable: true
      },
      {
        name: 'Riñones provenzal',
        category: 'Parrilla',
        price: 9000,
        position: 6,
        isAvailable: true
      },
      
      // PASTAS
      {
        name: 'Spaghettis c/ tuco',
        category: 'Pastas',
        price: 6000,
        position: 0,
        isAvailable: true
      },
      {
        name: 'Spaghettis c/ s. mixta',
        category: 'Pastas',
        price: 7000,
        position: 1,
        isAvailable: true
      },
      {
        name: 'Spaghettis c/ bolognesa',
        category: 'Pastas',
        price: 8000,
        position: 2,
        isAvailable: true
      },
      {
        name: 'Spaghettis c/ estofado',
        category: 'Pastas',
        price: 10000,
        position: 3,
        isAvailable: true
      },
      {
        name: 'Ñoquis caseros c/ tuco',
        category: 'Pastas',
        price: 6000,
        position: 4,
        isAvailable: true
      },
      {
        name: 'Ñoquis caseros c/ bolognesa',
        category: 'Pastas',
        price: 9000,
        position: 5,
        isAvailable: true
      },
      {
        name: 'Ravioles c/ tuco',
        category: 'Pastas',
        price: 9000,
        position: 6,
        isAvailable: true
      },
      {
        name: 'Ravioles c/ bolognesa',
        category: 'Pastas',
        price: 12000,
        position: 7,
        isAvailable: true
      },
      
      // POSTRES
      {
        name: 'Flan casero solo',
        category: 'Postres',
        price: 2000,
        position: 0,
        isAvailable: true
      },
      {
        name: 'Flan casero c/ crema o dulce',
        category: 'Postres',
        price: 3000,
        position: 1,
        isAvailable: true
      },
      {
        name: 'Flan casero mixto',
        category: 'Postres',
        price: 3500,
        position: 2,
        isAvailable: true
      },
      {
        name: 'Budín de pan casero',
        category: 'Postres',
        price: 2000,
        position: 3,
        isAvailable: true
      },
      {
        name: 'Budín de pan casero c/ crema o dulce',
        category: 'Postres',
        price: 3000,
        position: 4,
        isAvailable: true
      },
      {
        name: 'Ensalada de frutas',
        category: 'Postres',
        price: 4000,
        position: 5,
        isAvailable: true
      },
      {
        name: 'Ensalada c/ crema',
        category: 'Postres',
        price: 5500,
        position: 6,
        isAvailable: true
      },
      {
        name: 'Queso y dulce',
        category: 'Postres',
        price: 5500,
        position: 7,
        isAvailable: true
      },

      // HELADOS
      {
        name: 'Bocha de helado',
        category: 'Helados',
        price: 4000,
        position: 0,
        isAvailable: true
      },
      {
        name: 'Almendrado',
        category: 'Helados',
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
      primaryColor: '#8B4513', // Marrón como el menú original
      secondaryColor: '#D2691E',
      backgroundColor: '#F5F5DC',
      textColor: '#2F2F2F'
    }
  }
};

const createEsquinaPompeyaMenu = async () => {
  try {
    await connectDB();
    
    console.log('🚀 Creando menú de Esquina Pompeya...');
    
    // Verificar si ya existe
    const existingUser = await User.findOne({ restaurantId: 'esquina-pompeya' });
    if (existingUser) {
      console.log('⚠️ El restaurante Esquina Pompeya ya existe');
      return;
    }

    // Crear usuario
    const user = new User(esquinaPompeyaData.user);
    await user.save();
    console.log('✅ Usuario creado');

    // Crear menú
    const menu = new Menu({
      ...esquinaPompeyaData.menu,
      restaurantId: 'esquina-pompeya',
      restaurantName: 'Esquina Pompeya',
      owner: user._id
    });
    
    await menu.save();
    console.log('✅ Menú creado');
    
    console.log(`
🎉 ¡Menú de Esquina Pompeya creado exitosamente!
    
📋 Estadísticas:
- Categorías: ${menu.categories.length}
- Productos: ${menu.items.length}
- URL pública: http://localhost:3000/esquina-pompeya
- Panel admin: http://localhost:3000/admin/login
  - Email: ${esquinaPompeyaData.user.email}
  - Password: ${esquinaPompeyaData.user.password}
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  createEsquinaPompeyaMenu();
}

module.exports = { createEsquinaPompeyaMenu, esquinaPompeyaData };