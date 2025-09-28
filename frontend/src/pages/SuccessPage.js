import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCodeDisplay from '../components/QRCodeDisplay';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurantId, restaurantUrl, plan } = location.state || {};

  if (!restaurantId) {
    navigate('/');
    return null;
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('¡URL copiada al portapapeles!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#f4f6fa' }}>
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Felicitaciones! Tu MenuQR está listo
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Tu restaurante ya tiene su menú digital funcionando. Compartí esta información con el dueño:
          </p>

          {/* QR Code Display */}
          <div className="bg-white rounded-xl p-6 mb-8 text-center">
            <h3 className="text-lg font-bold mb-4" style={{ color: '#1a4fa3' }}>
              🎯 Código QR para las mesas
            </h3>
            <div className="flex justify-center mb-4">
              <QRCodeDisplay 
                value={restaurantUrl}
                size={200}
              />
            </div>
            <p className="text-sm text-gray-600">
              Imprimí este QR y ponelo en las mesas del restaurante
            </p>
          </div>

          {/* Restaurant Info Box */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Información del Restaurante</h2>
            
            <div className="space-y-4">
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">ID del Restaurante:</label>
                <div className="bg-white border rounded-lg p-3 flex items-center justify-between">
                  <span className="font-mono text-sm">{restaurantId}</span>
                  <button 
                    onClick={() => copyToClipboard(restaurantId)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de tu Menú:</label>
                <div className="bg-white border rounded-lg p-3 flex items-center justify-between">
                  <span className="font-mono text-sm break-all">{restaurantUrl}</span>
                  <button 
                    onClick={() => copyToClipboard(restaurantUrl)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap ml-2"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Contratado:</label>
                <div className="bg-white border rounded-lg p-3">
                  <span className="font-semibold text-green-600">Plan {plan} - $2.990/mes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/esquina-pompeya')}
              className="block w-full text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-all"
              style={{ backgroundColor: '#1a4fa3' }}
            >
              🔗 Ver Menú Digital de Esquina Pompeya
            </button>
            
            <button
              onClick={() => navigate('/admin/login')}
              className="block w-full border-2 border-blue-600 text-blue-600 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              👤 Acceder al Panel de Administración
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="block w-full text-gray-600 py-3 rounded-lg font-medium hover:text-gray-800 transition-colors"
            >
              ← Volver al inicio
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl text-left">
            <h3 className="font-bold text-blue-900 mb-2">📋 Próximos pasos:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>1. Compartí la URL con el dueño del restaurante</li>
              <li>2. El dueño puede acceder al panel de admin para personalizar</li>
              <li>3. Imprimí el código QR y ponelo en las mesas</li>
              <li>4. Los clientes escanean y ven el menú al instante</li>
            </ul>
          </div>

          {/* Demo Badge */}
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-yellow-100 rounded-full">
            <span className="text-yellow-800 text-sm font-medium">
              🚧 Demo - Integración con MercadoPago próximamente
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;