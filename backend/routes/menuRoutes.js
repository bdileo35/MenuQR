const express = require('express');
const router = express.Router();
const {
  getMenuById,
  getMenuByRestaurantId,
  createMenu,
  updateMenu,
  deleteMenu,
  getMenuCategories,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Rutas públicas - para visualización del menú
router.get('/restaurant/:restaurantId', getMenuByRestaurantId);
router.get('/:id', getMenuById);
router.get('/:id/categories', getMenuCategories);

// Rutas protegidas - para administradores
router.use(protect); // Todas las rutas siguientes requieren autenticación

// CRUD de menús completos
router.post('/', adminOnly, upload.single('logo'), createMenu);
router.put('/:id', adminOnly, upload.single('logo'), updateMenu);
router.delete('/:id', adminOnly, deleteMenu);

// CRUD de items del menú
router.post('/:id/items', adminOnly, upload.single('image'), addMenuItem);
router.put('/:id/items/:itemId', adminOnly, upload.single('image'), updateMenuItem);
router.delete('/:id/items/:itemId', adminOnly, deleteMenuItem);

module.exports = router;