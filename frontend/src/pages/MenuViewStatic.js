import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MenuView = () => {
  const { restaurantId } = useParams();
  const [loading, setLoading] = useState(false);

  // Mock data para Esquina Pompeya (sin API calls)
  const mockMenuData = {
    restaurant: {
      name: "Esquina Pompeya",
      logo: null,
      description: "Pizzas artesanales y comidas caseras"
    },
    categories: [
      {
        id: 1,
        name: "🍕 Pizzas",
        color: "#e74c3c",
        items: [
          { id: 1, name: "Pizza Napolitana", price: 3500, description: "Salsa de tomate, muzzarella, tomate, albahaca" },
          { id: 2, name: "Pizza Muzzarella", price: 3200, description: "Salsa de tomate, muzzarella" },
          { id: 3, name: "Pizza Especial", price: 4200, description: "Salsa de tomate, muzzarella, jamón, morrones, aceitunas" }
        ]
      },
      {
        id: 2,
        name: "🥟 Empanadas",
        color: "#f39c12",
        items: [
          { id: 4, name: "Empanadas de Carne", price: 250, description: "Carne cortada a cuchillo, cebolla, huevo, aceitunas" },
          { id: 5, name: "Empanadas de Pollo", price: 250, description: "Pollo desmenuzado, cebolla, morrones" },
          { id: 6, name: "Empanadas de Jamón y Queso", price: 230, description: "Jamón cocido y queso" }
        ]
      },
      {
        id: 3,
        name: "🥗 Ensaladas",
        color: "#27ae60",
        items: [
          { id: 7, name: "Ensalada Mixta", price: 1800, description: "Lechuga, tomate, cebolla, zanahoria" },
          { id: 8, name: "Ensalada Caesar", price: 2200, description: "Lechuga, pollo grillado, croutones, queso parmesano" }
        ]
      },
      {
        id: 4,
        name: "🍹 Bebidas",
        color: "#3498db",
        items: [
          { id: 9, name: "Coca Cola 500ml", price: 800, description: "Gaseosa" },
          { id: 10, name: "Agua Mineral 500ml", price: 600, description: "Agua sin gas" },
          { id: 11, name: "Cerveza Quilmes", price: 1200, description: "Cerveza 473ml" }
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
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {mockMenuData.restaurant.name}
            </h1>
            <p className="text-gray-600">{mockMenuData.restaurant.description}</p>
            
            {/* Badge de demo */}
            <div className="mt-4 inline-flex items-center px-3 py-1 bg-blue-100 rounded-full">
              <span className="text-blue-800 text-sm font-medium">
                🚀 Demo MenuQR - ¡Tu restaurante puede verse así!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menú */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {mockMenuData.categories.map((category) => (
          <div key={category.id} className="mb-12">
            {/* Nombre de categoría */}
            <div className="mb-6">
              <h2 
                className="text-2xl font-bold mb-2 pb-2 border-b-2"
                style={{ color: category.color, borderColor: category.color }}
              >
                {category.name}
              </h2>
            </div>

            {/* Items de la categoría */}
            <div className="grid gap-4">
              {category.items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <span className="text-xl font-bold text-green-600">
                        ${item.price.toLocaleString()}
                      </span>
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