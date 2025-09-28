const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        restaurantName: true,
        restaurantId: true,
        createdAt: true,
        isActive: true
      }
    });

    console.log('\n=== USUARIOS REGISTRADOS ===');
    if (users.length === 0) {
      console.log('No hay usuarios registrados');
    } else {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Restaurante: ${user.restaurantName}`);
        console.log(`   ID Restaurante: ${user.restaurantId}`);
        console.log(`   URL: http://localhost:3000/${user.restaurantId}`);
        console.log(`   Creado: ${user.createdAt.toLocaleString('es-AR')}`);
        console.log(`   Estado: ${user.isActive ? 'Activo' : 'Inactivo'}`);
      });
    }
    console.log('\n=========================\n');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showUsers();