import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { menuAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Loading from '../components/Loading';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Globe, 
  Leaf,
  Wheat,
  Flame
} from 'lucide-react';

const MenuView = () => {
  const { restaurantId } = useParams();
  const { showError } = useNotification();
  
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        let response;
        
        if (restaurantId) {
          response = await menuAPI.getMenuByRestaurantId(restaurantId);
        } else {
          // Para el home, mostrar menú demo o redirigir
          throw new Error('ID de restaurante requerido');
        }
        
        setMenu(response.data.menu);
      } catch (error) {
        console.error('Error cargando menú:', error);
        showError('No se pudo cargar el menú. Verifica la URL.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId, showError]);

  const filteredItems = menu?.items?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = menu?.categories?.filter(cat => cat.isActive) || [];
  const groupedItems = {};
  
  filteredItems.forEach(item => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category].push(item);
  });

  const getSpicyIcons = (level) => {
    return Array(level).fill(0).map((_, i) => (
      <Flame key={i} className="w-4 h-4 text-red-500" />
    ));
  };

  if (loading) {
    return <Loading text="Cargando menú..." className="min-h-screen" />;
  }

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Menú no encontrado</h1>
          <p className="text-gray-600">Verifica que la URL sea correcta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Restaurante */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            {menu.logo?.url && (
              <img 
                src={menu.logo.url} 
                alt={menu.restaurantName}
                className="w-16 h-16 rounded-full object-cover shadow-md"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{menu.restaurantName}</h1>
              {menu.description && (
                <p className="text-gray-600 mt-1">{menu.description}</p>
              )}
              
              {/* Información de contacto */}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                {menu.contact?.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{menu.contact.address}</span>
                  </div>
                )}
                {menu.contact?.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${menu.contact.phone}`} className="hover:text-primary-600">
                      {menu.contact.phone}
                    </a>
                  </div>
                )}
                {menu.contact?.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <a href={menu.contact.website} target="_blank" rel="noopener noreferrer" 
                       className="hover:text-primary-600">
                      Sitio web
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white border-b sticky top-[140px] z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 pr-4"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>

          {/* Filtros de categorías */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Todas
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenido del menú */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {Object.keys(groupedItems).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron productos</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="btn-primary mt-4"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {categories
              .filter(cat => groupedItems[cat.name])
              .map((category) => (
                <div key={category._id} className="category-section">
                  <div className="menu-category-header">
                    <div className="flex items-center gap-3">
                      {category.image?.url && (
                        <img 
                          src={category.image.url} 
                          alt={category.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <h2 className="text-xl font-semibold text-gray-900">
                        {category.name}
                      </h2>
                    </div>
                    {category.description && (
                      <p className="text-gray-600 mt-1">{category.description}</p>
                    )}
                  </div>

                  <div className="menu-grid">
                    {groupedItems[category.name]?.map((item) => (
                      <div key={item._id} className="menu-item-card">
                        {item.image?.url && (
                          <div className="aspect-w-16 aspect-h-9 mb-4">
                            <img
                              src={item.image.url}
                              alt={item.name}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        <div className="card-content">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900 flex-1">
                              {item.name}
                              {item.isPopular && (
                                <Star className="w-4 h-4 text-yellow-500 inline ml-2" />
                              )}
                            </h3>
                            {menu.settings?.showPrices && (
                              <div className="text-right ml-4">
                                <span className="font-bold text-primary-600 text-lg">
                                  {menu.settings.currency}{item.price}
                                </span>
                                {item.originalPrice && item.originalPrice > item.price && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    {menu.settings.currency}{item.originalPrice}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {item.description && menu.settings?.showDescriptions && (
                            <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                          )}

                          {/* Indicadores y tiempo de preparación */}
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-3">
                              {item.isVegetarian && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <Leaf className="w-4 h-4" />
                                  <span>Vegetariano</span>
                                </div>
                              )}
                              {item.isVegan && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <Leaf className="w-4 h-4" />
                                  <span>Vegano</span>
                                </div>
                              )}
                              {item.isGlutenFree && (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <Wheat className="w-4 h-4" />
                                  <span>Sin gluten</span>
                                </div>
                              )}
                              {item.spicyLevel > 0 && (
                                <div className="flex items-center gap-1">
                                  {getSpicyIcons(item.spicyLevel)}
                                </div>
                              )}
                            </div>
                            
                            {item.preparationTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{item.preparationTime} min</span>
                              </div>
                            )}
                          </div>

                          {/* Información nutricional */}
                          {menu.settings?.showNutritionalInfo && item.nutritionalInfo?.calories && (
                            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                              <div className="flex gap-4">
                                <span>🔥 {item.nutritionalInfo.calories} cal</span>
                                {item.nutritionalInfo.protein && (
                                  <span>🥩 {item.nutritionalInfo.protein}g proteína</span>
                                )}
                                {item.nutritionalInfo.carbs && (
                                  <span>🍞 {item.nutritionalInfo.carbs}g carbohidratos</span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Alérgenos */}
                          {item.allergens && item.allergens.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-xs text-orange-600">
                                <strong>Contiene:</strong> {item.allergens.join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-500 text-sm">
            Menú digital creado con MenuQR
          </p>
          <div className="flex justify-center gap-4 mt-4">
            {menu.contact?.socialMedia?.instagram && (
              <a 
                href={`https://instagram.com/${menu.contact.socialMedia.instagram}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600"
              >
                Instagram
              </a>
            )}
            {menu.contact?.socialMedia?.facebook && (
              <a 
                href={`https://facebook.com/${menu.contact.socialMedia.facebook}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600"
              >
                Facebook
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MenuView;