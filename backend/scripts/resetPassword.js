const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetPassword() {
  try {
    const email = 'esquinapompeya@gmail.com'; // Usuario más reciente
    const newPassword = 'admin123'; // Contraseña fácil de recordar

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    console.log('🔑 CREDENCIALES ACTUALIZADAS:');
    console.log(`Email: ${email}`);
    console.log(`Contraseña: ${newPassword}`);
    console.log(`Restaurante: ${user.restaurantName}`);
    console.log(`ID: ${user.restaurantId}`);
    console.log('\n🚀 Ya puedes acceder en: http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();