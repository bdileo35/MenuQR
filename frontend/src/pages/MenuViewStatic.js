import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MenuView = () => {
  const { restaurantId } = useParams();
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('platos-del-dia');

  // Datos con estructura EP y estilo QRing
  const mockMenuData = {
    restaurant: {
      name: "ESQUINA POMPEYA",
      description: "Parrilla y comidas caseras en el corazón de Pompeya",
      subtitle: "Tradición familiar desde 1985",
      phone: "+54 11 1234-5678",
      whatsapp: "5491112345678",
      address: "Av. Gral. Francisco Fernández de la Cruz 1100, Pompeya, CABA",
      googleMapsUrl: "https://goo.gl/maps/example",
      logo: "🏠" // Reemplazar por logo real
    },
    categories: [
      { id: 'platos-del-dia', name: 'Platos del Día', icon: '🍽️' },
      { id: 'promos', name: 'Promos', icon: '🎯' },
      { id: 'entradas', name: 'Entradas', icon: '🥗' },
      { id: 'principales', name: 'Principales', icon: '🥩' },
      { id: 'postres', name: 'Postres', icon: '🍰' },
      { id: 'bebidas', name: 'Bebidas', icon: '🥤' }
    ],
    specialOffers: {
      platosDelDia: [
        {
          id: 1,
          name: "Bife de Chorizo con Papas",
          description: "Jugoso bife a la parrilla con papas españolas y ensalada mixta",
          price: 8900,
          originalPrice: 10500,
          imageUrl: "/images/bife-chorizo.jpg",
          available: true,
          special: "HOY"
        },
        {
          id: 2,
          name: "Milanesa Napolitana",
          description: "Milanesa de ternera con salsa, jamón, queso y papas fritas",
          price: 7200,
          originalPrice: 8200,
          imageUrl: "/images/milanesa.jpg",
          available: true,
          special: "HOY"
        }
      ],
      promos: [
        {
          id: 1,
          title: "Promo Pareja",
          description: "2 Milanesas + 2 Empanadas + 2 Bebidas + Postre para compartir",
          price: 14900,
          originalPrice: 17800,
          imageUrl: "/images/promo-pareja.jpg"
        },
        {
          id: 2,
          title: "Promo Familiar",
          description: "Parrillada para 4 + Ensalada + Pan + 4 Bebidas + 2 Postres",
          price: 24900,
          originalPrice: 29800,
          imageUrl: "/images/promo-familiar.jpg"
        },
        {
          id: 3,
          title: "Almuerzo Express",
          description: "Plato del día + Bebida + Café",
          price: 6900,
          originalPrice: 8200,
          imageUrl: "/images/almuerzo-express.jpg"
        }
      ]
    },
    menuItems: {
      entradas: [
        { 
          id: 1, 
          name: "Empanadas de Carne", 
          price: 1200, 
          description: "Empanadas caseras rellenas de carne cortada a cuchillo",
          imageUrl: "/images/empanadas-carne.jpg"
        },
        { 
          id: 2, 
          name: "Provoleta", 
          price: 2800, 
          description: "Queso provolone a la plancha con orégano",
          imageUrl: "/images/provoleta.jpg"
        }
      ],
      principales: [
        { 
          id: 1, 
          name: "Asado de Tira", 
          price: 7800, 
          description: "Costillas de res a la parrilla, tiernas y sabrosas",
          imageUrl: "/images/asado-tira.jpg"
        },
        { 
          id: 2, 
          name: "Pollo a la Parrilla", 
          price: 6200, 
          description: "Medio pollo marinado con hierbas",
          imageUrl: "/images/pollo-parrilla.jpg"
        }
      ],
      postres: [
        { 
          id: 1, 
          name: "Flan Casero", 
          price: 2200, 
          description: "Flan tradicional con dulce de leche y crema",
          imageUrl: "/images/flan.jpg"
        }
      ],
      bebidas: [
        { 
          id: 1, 
          name: "Gaseosa", 
          price: 1200, 
          description: "Coca-Cola, Sprite, Fanta (lata 354ml)",
          imageUrl: "/images/gaseosas.jpg"
        },
        { 
          id: 2, 
          name: "Cerveza Quilmes", 
          price: 2200, 
          description: "Cerveza Quilmes en botella 1L",
          imageUrl: "/images/cerveza.jpg"
        }
      ]
    }
  };

  const formatPrice = (price) => {
    return `$${price.toLocaleString('es-AR')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando menú...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header con Logo, Descripción y Contacto */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Logo y Título */}
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">{mockMenuData.restaurant.logo}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {mockMenuData.restaurant.name}
            </h1>
            <p className="text-lg text-gray-600 mb-1">{mockMenuData.restaurant.description}</p>
            <p className="text-sm text-gray-500">{mockMenuData.restaurant.subtitle}</p>
          </div>

          {/* Información de Contacto */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
            <a 
              href={mockMenuData.restaurant.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              style={{ color: '#1a4fa3' }}
            >
              <span>📍</span>
              <span>{mockMenuData.restaurant.address}</span>
            </a>
            <a 
              href={`https://wa.me/${mockMenuData.restaurant.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
              style={{ color: '#25D366' }}
            >
              <span>📱</span>
              <span>{mockMenuData.restaurant.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navegación de Categorías - Scroll Horizontal */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            {mockMenuData.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-colors whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: activeCategory === category.id ? '#1a4fa3' : undefined
                }}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Platos del Día */}
        {activeCategory === 'platos-del-dia' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🍽️ Platos del Día</h2>
              <p className="text-gray-600">Nuestras especialidades de hoy con precios especiales</p>
            </div>
            
            <div className="grid gap-4">
              {mockMenuData.specialOffers.platosDelDia.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden border">
                  <div className="flex">
                    <div className="w-24 h-24 bg-gray-200 flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-2xl">
                        🍽️
                      </div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                          {item.special}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-green-600">{formatPrice(item.price)}</span>
                        <span className="text-sm text-gray-400 line-through">{formatPrice(item.originalPrice)}</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Promos */}
        {activeCategory === 'promos' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🎯 Promociones</h2>
              <p className="text-orange-600 font-medium bg-orange-50 inline-block px-4 py-2 rounded-full">
                ✨ Todas las promos incluyen bebida y postre
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockMenuData.specialOffers.promos.map((promo) => (
                <div key={promo.id} className="bg-white rounded-lg shadow-md overflow-hidden border">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-4xl">
                    🎯
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{promo.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{promo.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-green-600">{formatPrice(promo.price)}</span>
                      <span className="text-sm text-gray-400 line-through">{formatPrice(promo.originalPrice)}</span>
                    </div>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full mt-2 inline-block">
                      Ahorro: {formatPrice(promo.originalPrice - promo.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categorías Regulares */}
        {activeCategory !== 'platos-del-dia' && activeCategory !== 'promos' && mockMenuData.menuItems[activeCategory] && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {mockMenuData.categories.find(cat => cat.id === activeCategory)?.icon} {' '}
                {mockMenuData.categories.find(cat => cat.id === activeCategory)?.name}
              </h2>
            </div>
            
            <div className="grid gap-4">
              {mockMenuData.menuItems[activeCategory].map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden border">
                  <div className="flex">
                    <div className="w-24 h-24 bg-gray-200 flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl">
                        🍽️
                      </div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <span className="text-xl font-bold" style={{ color: '#1a4fa3' }}>
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-8 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Powered by <span className="font-semibold" style={{ color: '#1a4fa3' }}>MenuQR</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuView;