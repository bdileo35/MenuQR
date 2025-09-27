import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    // Simular proceso de compra - FORCE DEPLOY
    setTimeout(() => {
      // Generar ID único para el restaurante
      const restaurantId = 'esquina-pompeya-' + Date.now();
      const restaurantUrl = `https://esquina-pompeya.menuqr-beta.vercel.app`;
      
      // Redirigir a página de éxito con los datos
      navigate('/success', { 
        state: { 
          restaurantId, 
          restaurantUrl,
          plan: selectedPlan 
        }
      });
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">QR</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">MenuQR</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#planes" className="text-gray-600 hover:text-blue-600 font-medium">Planes</a>
              <a href="#demo" className="text-gray-600 hover:text-blue-600 font-medium">Demo</a>
              <a href="#contacto" className="text-gray-600 hover:text-blue-600 font-medium">Contacto</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Menús Digitales QR para tu <span className="text-blue-600">Restaurante</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transforma tu carta física en un menú digital interactivo. Tus clientes escanean el QR y ven tu menú actualizado al instante.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('planes').scrollIntoView()}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Empezar Ahora - $2.990/mes
            </button>
            <a 
              href="https://esquina-pompeya.menuqr-beta.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              Ver Demo: Esquina Pompeya
            </a>
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="max-w-7xl mx-auto px-4 py-16" id="demo">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ve cómo queda tu menú</h2>
          <p className="text-lg text-gray-600">Ejemplo real: Restaurante Esquina Pompeya</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-center">📱 Menú Digital</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-lg text-blue-600">🍕 Pizzas</h4>
                  <p className="text-gray-600 text-sm">Napolitana, Muzzarella, Especial</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-lg text-green-600">🥗 Ensaladas</h4>
                  <p className="text-gray-600 text-sm">Caesar, Mixta, Caprese</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-lg text-orange-600">🍹 Bebidas</h4>
                  <p className="text-gray-600 text-sm">Gaseosas, Jugos, Agua</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 inline-block">
              <h3 className="text-xl font-bold mb-4">Código QR</h3>
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-32 h-32 bg-black bg-opacity-10 rounded grid grid-cols-8 gap-1 p-2">
                  {[...Array(64)].map((_, i) => (
                    <div key={i} className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'} rounded-sm`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">Los clientes escanean<br/>y ven tu menú</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4 py-16" id="planes">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Plan Simple, Precio Justo</h2>
          <p className="text-lg text-gray-600">Todo lo que necesitas para digitalizar tu restaurante</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border-4 border-blue-500 relative">
            <div className="bg-blue-500 text-white text-center py-2 rounded-t-xl">
              <span className="font-semibold">🔥 MÁS POPULAR</span>
            </div>
            
            <div className="p-8">
              <h3 className="text-2xl font-bold text-center mb-2">Plan Básico</h3>
              <div className="text-center mb-6">
                <span className="text-5xl font-bold text-blue-600">$2.990</span>
                <span className="text-gray-600">/mes</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Menú digital con QR personalizado</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>URL personalizada (turestaurante.menuqr.app)</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Actualización de precios en tiempo real</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Tu logo y colores de marca</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Diseño responsive (móvil/tablet)</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Soporte técnico incluido</span>
                </li>
              </ul>
              
              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Procesando compra...
                  </div>
                ) : (
                  'Empezar Ahora - Pago Simulado'
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                * Demo simulado - Integración con MercadoPago próximamente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegir MenuQR?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Setup en 5 minutos</h3>
              <p className="text-gray-600">Comprás, recibís tu URL personalizada y ya tenés tu menú QR funcionando</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Sin costos ocultos</h3>
              <p className="text-gray-600">Un solo pago mensual. Todo incluido. Sin sorpresas en la factura</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Experiencia móvil perfecta</h3>
              <p className="text-gray-600">Diseñado para que tus clientes naveguen fácil desde cualquier celular</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">QR</span>
            </div>
            <span className="text-xl font-bold">MenuQR</span>
          </div>
          <p className="text-gray-400 mb-4">La forma más simple de digitalizar tu restaurante</p>
          <p className="text-sm text-gray-500">
            © 2025 MenuQR. Hecho en Argentina 🇦🇷
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;