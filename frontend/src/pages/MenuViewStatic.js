import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MenuView = () => {
  const { restaurantId } = useParams();
  const [loading, setLoading] = useState(false);

  // Mock data para Esquina Pompeya (sin API calls) - Diseño realista
  const mockMenuData = {
    restaurant: {
      name: "ESQUINA POMPEYA",
      subtitle: "Pizzas Artesanales & Comidas Caseras",
      description: "Desde 1995 - Barrio de Pompeya",
      phone: "11-4567-8901",
      address: "Av. Sáenz 1234, CABA"
    },
    categories: [
      {
        id: 1,
        name: "🍕 PIZZAS ARTESANALES",
        color: "#8B4513",
        description: "Masa madre fermentada 48hs",
        items: [
          { 
            id: 1, 
            name: "NAPOLITANA", 
            price: 3800, 
            description: "Salsa de tomate San Marzano, muzzarella, tomate fresco, albahaca, aceite de oliva extra virgen",
            popular: true
          },
          { 
            id: 2, 
            name: "MUZZARELLA", 
            price: 3500, 
            description: "Salsa de tomate, muzzarella de primera calidad, orégano",
            popular: false
          },
          { 
            id: 3, 
            name: "FUGAZZETTA", 
            price: 4200, 
            description: "Cebolla caramelizada, muzzarella, aceitunas verdes, orégano",
            popular: false
          },
          { 
            id: 4, 
            name: "ESPECIAL DE LA CASA", 
            price: 4800, 
            description: "Salsa de tomate, muzzarella, jamón cocido, morrones asados, aceitunas negras, huevo",
            popular: true
          }
        ]
      },
      {
        id: 2,
        name: "🥟 EMPANADAS CASERAS",
        color: "#CD853F",
        description: "Masa artesanal, horneadas",
        items: [
          { id: 5, name: "CARNE CORTADA A CUCHILLO", price: 280, description: "Carne vacuna, cebolla, huevo duro, aceitunas verdes, comino" },
          { id: 6, name: "POLLO Y VERDEO", price: 280, description: "Pollo desmenuzado, cebolla de verdeo, morrones, especias" },
          { id: 7, name: "JAMÓN Y QUESO", price: 260, description: "Jamón cocido de primera, queso cremoso" },
          { id: 8, name: "HUMITA", price: 270, description: "Choclo, cebolla, queso cremoso, albahaca" },
          { id: 9, name: "CAPRESE", price: 290, description: "Tomate, muzzarella, albahaca fresca" }
        ]
      },
      {
        id: 3,
        name: "🥗 ENSALADAS FRESCAS",
        color: "#228B22",
        description: "Ingredientes del día",
        items: [
          { id: 10, name: "MIXTA POMPEYA", price: 2200, description: "Mix de verdes, tomate, zanahoria, huevo duro, aceitunas" },
          { id: 11, name: "CAESAR CON POLLO", price: 2800, description: "Lechuga romana, pollo grillado, croutones caseros, parmesano, aderezo caesar" },
          { id: 12, name: "CAPRESE", price: 2500, description: "Tomate, muzzarella de búfala, albahaca, aceite de oliva, aceto balsámico" }
        ]
      },
      {
        id: 4,
        name: "� PARRILLA & CARNES",
        color: "#8B0000",
        description: "A la parrilla",
        items: [
          { id: 13, name: "BIFE DE CHORIZO", price: 4500, description: "350g, con papas fritas o ensalada" },
          { id: 14, name: "MILANESA NAPOLITANA", price: 3800, description: "Con jamón, tomate, muzzarella y papas fritas" },
          { id: 15, name: "PARRILLADA PARA DOS", price: 7200, description: "Chorizo, morcilla, vacío, pollo, papas y ensalada" }
        ]
      },
      {
        id: 5,
        name: "🍹 BEBIDAS",
        color: "#4169E1",
        description: "Frías y calientes",
        items: [
          { id: 16, name: "COCA COLA", price: 900, description: "500ml" },
          { id: 17, name: "AGUA MINERAL", price: 700, description: "500ml sin gas" },
          { id: 18, name: "QUILMES", price: 1400, description: "Cerveza 473ml" },
          { id: 19, name: "FERNET CON COCA", price: 1800, description: "Fernet Branca" },
          { id: 20, name: "VINO TINTO", price: 2200, description: "Copa - Luigi Bosca Malbec" }
        ]
      },
      {
        id: 6,
        name: "🍮 POSTRES CASEROS",
        color: "#FF69B4",
        description: "Elaboración propia",
        items: [
          { id: 21, name: "FLAN CASERO", price: 1200, description: "Con dulce de leche y crema" },
          { id: 22, name: "TIRAMISU", price: 1500, description: "Receta italiana tradicional" },
          { id: 23, name: "HELADO", price: 1000, description: "2 bochas a elección" }
        ]
      }
    ]
  };

  useEffect(() => {
    // Simular carga
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando menú...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del restaurante */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg border-b-4 border-amber-600">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            {/* Logo/Nombre principal */}
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-amber-800 mb-2 tracking-wider" 
                  style={{ fontFamily: 'serif' }}>
                {mockMenuData.restaurant.name}
              </h1>
              <div className="w-24 h-1 bg-amber-600 mx-auto mb-3"></div>
              <h2 className="text-xl text-amber-700 font-medium mb-2">
                {mockMenuData.restaurant.subtitle}
              </h2>
              <p className="text-amber-600 font-medium">
                {mockMenuData.restaurant.description}
              </p>
            </div>
            
            {/* Info de contacto */}
            <div className="flex justify-center items-center space-x-6 text-sm text-amber-700 mb-4">
              <div className="flex items-center">
                <span className="mr-1">📞</span>
                <span>{mockMenuData.restaurant.phone}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">📍</span>
                <span>{mockMenuData.restaurant.address}</span>
              </div>
            </div>
            
            {/* Badge de demo */}
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
              <span className="text-blue-800 text-sm font-medium">
                🚀 Demo MenuQR - ¡Tu restaurante puede verse así de profesional!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menú */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {mockMenuData.categories.map((category) => (
          <div key={category.id} className="mb-12">
            {/* Nombre de categoría con diseño mejorado */}
            <div className="mb-8 text-center">
              <h2 
                className="text-3xl font-bold mb-3 pb-3 inline-block px-6"
                style={{ 
                  color: category.color, 
                  borderBottom: `3px solid ${category.color}`,
                  fontFamily: 'serif'
                }}
              >
                {category.name}
              </h2>
              {category.description && (
                <p className="text-gray-600 italic text-lg mt-2">
                  {category.description}
                </p>
              )}
            </div>

            {/* Items de la categoría con diseño más elegante */}
            <div className="grid gap-6">
              {category.items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 relative">
                  {/* Badge "Popular" si corresponde */}
                  {item.popular && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ⭐ POPULAR
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-wide" style={{ fontFamily: 'serif' }}>
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-gray-600 text-base leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div 
                        className="text-2xl font-bold px-4 py-2 rounded-lg text-white shadow-md"
                        style={{ backgroundColor: category.color }}
                      >
                        ${item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">QR</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MenuQR</span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            ¿Te gusta cómo se ve? Tu restaurante puede tener su menú digital así de fácil.
          </p>
          
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            🚀 Crear mi MenuQR - $2.990/mes
          </a>
          
          <p className="text-xs text-gray-500 mt-4">
            Powered by MenuQR - Menús digitales para restaurantes
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuView;