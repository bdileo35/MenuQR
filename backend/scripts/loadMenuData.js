const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function loadEsquinaPompeyaMenu() {
  try {
    console.log('🍽️  Cargando datos reales de Esquina Pompeya...');

    // Buscar el usuario y menú de Esquina Pompeya
    const user = await prisma.user.findUnique({
      where: { email: 'esquinapompeya@gmail.com' }
    });

    if (!user) {
      console.error('❌ Usuario no encontrado. Ejecuta primero el checkout.');
      return;
    }

    const menu = await prisma.menu.findFirst({
      where: { ownerId: user.id }
    });

    if (!menu) {
      console.error('❌ Menú no encontrado.');
      return;
    }

    // Obtener categorías existentes
    const categories = await prisma.category.findMany({
      where: { menuId: menu.id }
    });

    const entreCategory = categories.find(cat => cat.name === 'Entradas');
    const mainCategory = categories.find(cat => cat.name === 'Principales');
    const dessertCategory = categories.find(cat => cat.name === 'Postres');
    const drinkCategory = categories.find(cat => cat.name === 'Bebidas');

    // Datos reales de Esquina Pompeya
    const menuItems = [
      // ENTRADAS
      {
        name: 'Empanadas de Carne',
        description: 'Empanadas caseras rellenas de carne cortada a cuchillo, cebolla y especias',
        price: 1200,
        menuId: menu.id,
        categoryId: entreCategory.id,
        position: 0,
        isAvailable: true,
        isVegetarian: false
      },
      {
        name: 'Empanadas de Pollo',
        description: 'Empanadas con pollo desmenuzado, cebolla y pimientos',
        price: 1200,
        menuId: menu.id,
        categoryId: entreCategory.id,
        position: 1,
        isAvailable: true,
        isVegetarian: false
      },
      {
        name: 'Empanadas de Verdura',
        description: 'Empanadas vegetarianas con acelga, ricota y cebolla',
        price: 1100,
        menuId: menu.id,
        categoryId: entreCategory.id,
        position: 2,
        isAvailable: true,
        isVegetarian: true
      },
      {
        name: 'Provoleta',
        description: 'Queso provolone a la plancha con orégano y aceite de oliva',
        price: 2800,
        menuId: menu.id,
        categoryId: entreCategory.id,
        position: 3,
        isAvailable: true,
        isVegetarian: true
      },
      {
        name: 'Tabla de Fiambres',
        description: 'Selección de fiambres, quesos y aceitunas para compartir',
        price: 4500,
        menuId: menu.id,
        categoryId: entreCategory.id,
        position: 4,
        isAvailable: true,
        isVegetarian: false
      },

      // PRINCIPALES
      {
        name: 'Bife de Chorizo',
        description: 'Jugoso bife de chorizo a la parrilla con guarnición a elección',
        price: 8900,
        menuId: menu.id,
        categoryId: mainCategory.id,
        position: 0,
        isAvailable: true,
        isVegetarian: false
      },
      {
        name: 'Asado de Tira',
        description: 'Costillas de res a la parrilla, tiernas y sabrosas',
        price: 7800,
        menuId: menu.id,
        categoryId: mainCategory.id,
        position: 1,
        isAvailable: true,
        isVegetarian: false
      },
      {
        name: 'Pollo a la Parrilla',
        description: 'Medio pollo marinado con hierbas y a la parrilla',
        price: 6200,
        menuId: menu.id,
        categoryId: mainCategory.id,
        position: 2,
        isAvailable: true,
        isVegetarian: false
      },
      {
        name: 'Milanesa Napolitana',
        description: 'Milanesa de ternera con salsa, jamón, queso y papas fritas',
        price: 7200,
        menuId: menu.id,
        categoryId: mainCategory.id,
        position: 3,
        isAvailable: true,
        isVegetarian: false
      },
      {
        name: 'Pasta del Día',
        description: 'Consultar por nuestras opciones de pasta casera',
        price: 5800,
        menuId: menu.id,
        categoryId: mainCategory.id,
        position: 4,
        isAvailable: true,
        isVegetarian: true
      },
      {
        name: 'Pizza Margherita',
        description: 'Pizza artesanal con mozzarella, tomate y albahaca',
        price: 4900,
        menuId: menu.id,
        categoryId: mainCategory.id,
        position: 5,
        isAvailable: true,
        isVegetarian: true
      },

      // POSTRES
      {
        name: 'Flan Casero',
        description: 'Flan tradicional con dulce de leche y crema',
        price: 2200,
        menuId: menu.id,
        categoryId: dessertCategory.id,
        position: 0,
        isAvailable: true,
        isVegetarian: true
      },
      {
        name: 'Tiramisu',
        description: 'Postre italiano con café, mascarpone y cacao',
        price: 2800,
        menuId: menu.id,
        categoryId: dessertCategory.id,
        position: 1,
        isAvailable: true,
        isVegetarian: true
      },
      {
        name: 'Helado Artesanal',
        description: 'Tres bochas de helado artesanal (sabores a elección)',
        price: 2500,
        menuId: menu.id,
        categoryId: dessertCategory.id,
        position: 2,
        isAvailable: true,
        isVegetarian: true
      },

      // BEBIDAS
      {
        name: 'Agua Mineral',
        description: 'Agua mineral sin gas o con gas 500ml',
        price: 800,
        menuId: menu.id,
        categoryId: drinkCategory.id,
        position: 0,
        isAvailable: true,
        isVegetarian: true
      },
      {
        name: 'Gaseosa',
        description: 'Coca-Cola, Sprite, Fanta (lata 354ml)',
        price: 1200,
        menuId: menu.id,
        categoryId: drinkCategory.id,
        position: 1,
        isAvailable: true,
        isVegetarian: true
      },
      {
        name: 'Cerveza Quilmes',
        description: 'Cerveza Quilmes en botella 1L',
        price: 2200,
        menuId: menu.id,
        categoryId: drinkCategory.id,
        position: 2,
        isAvailable: true,
        isVegetarian: true
      },
      {
        name: 'Vino Tinto',
        description: 'Vino tinto de la casa (copa)',
        price: 1800,
        menuId: menu.id,
        categoryId: drinkCategory.id,
        position: 3,
        isAvailable: true,
        isVegetarian: true
      },
      {
        name: 'Café Expreso',
        description: 'Café expreso tradicional',
        price: 900,
        menuId: menu.id,
        categoryId: drinkCategory.id,
        position: 4,
        isAvailable: true,
        isVegetarian: true
      },
      {
        name: 'Jugo Natural',
        description: 'Jugo de naranja recién exprimido',
        price: 1500,
        menuId: menu.id,
        categoryId: drinkCategory.id,
        position: 5,
        isAvailable: true,
        isVegetarian: true
      }
    ];

    // Limpiar items existentes
    await prisma.menuItem.deleteMany({
      where: { categoryId: { in: categories.map(cat => cat.id) } }
    });

    // Insertar nuevos items
    await prisma.menuItem.createMany({
      data: menuItems
    });

    // Actualizar configuración del menú
    await prisma.menu.update({
      where: { id: menu.id },
      data: {
        restaurantName: 'Esquina Pompeya',
        description: 'Parrilla y comidas caseras en el corazón de Pompeya',
        primaryColor: '#1a4fa3',
        secondaryColor: '#ffffff',
        backgroundColor: '#f8fafc',
        textColor: '#1f2937',
        fontFamily: 'Inter',
        contactPhone: '+54 11 1234-5678',
        contactEmail: 'esquinapompeya@gmail.com',
        contactAddress: 'Av. Gral. Francisco Fernández de la Cruz 1100, Pompeya, CABA',
        showPrices: true,
        showImages: true,
        showDescriptions: true,
        currency: 'ARS',
        language: 'es'
      }
    });

    console.log('✅ Datos cargados exitosamente!');
    console.log('\n📍 Información del restaurante:');
    console.log(`   - Nombre: Esquina Pompeya`);
    console.log(`   - Items cargados: ${menuItems.length}`);
    console.log(`   - URL del menú: http://localhost:3000/${user.restaurantId}`);
    console.log(`   - Panel admin: http://localhost:3000/admin/login`);
    console.log('\n🔑 Credenciales:');
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Contraseña: admin123`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

loadEsquinaPompeyaMenu();