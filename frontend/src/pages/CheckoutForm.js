import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    plan: 'basic'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Datos del formulario:', formData);
      
      // Generar ID único para el restaurante
      const restaurantId = formData.restaurantName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-6);

      const restaurantUrl = `https://menu-qr-beta.vercel.app/${restaurantId}`;
      const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();

      // ⚡ CREAR USUARIO REAL EN LA BASE DE DATOS
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.ownerName,
          email: formData.email,
          password: tempPassword,
          restaurantName: formData.restaurantName,
          restaurantId: restaurantId,
          phone: formData.phone,
          address: formData.address,
          plan: formData.plan
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear la cuenta');
      }

      console.log('✅ Usuario creado exitosamente:', result);

      navigate('/success', {
        state: {
          restaurantId,
          restaurantUrl,
          plan: formData.plan,
          restaurantData: formData,
          credentials: {
            email: formData.email,
            password: tempPassword
          }
        }
      });
      
      setLoading(false);

    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la cuenta: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#f4f6fa' }}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="font-bold text-2xl" style={{ color: '#1a4fa3' }}>QR</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Crear tu <span style={{ color: '#1a4fa3' }}>MenuQR</span>
            </h1>
            <p className="text-gray-600">Completá los datos de tu restaurante</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre del restaurante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del restaurante *
              </label>
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: '#1a4fa3' }}
                placeholder="Ej: La Esquina de Pompeya"
              />
            </div>

            {/* Nombre del dueño */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tu nombre completo *
              </label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                placeholder="Ej: Juan Carlos Pérez"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono/WhatsApp *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                placeholder="Ej: +54 11 1234-5678"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                placeholder="tu@email.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Usaremos este email para crear tu cuenta de administrador
              </p>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección del local
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                placeholder="Ej: Av. Sáenz 1234, CABA"
              />
            </div>

            {/* Plan seleccionado */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold" style={{ color: '#1a4fa3' }}>Plan Básico</h3>
                  <p className="text-sm text-gray-600">Menú digital + QR personalizado</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold" style={{ color: '#1a4fa3' }}>$22.990</span>
                  <span className="text-gray-600">/mes</span>
                </div>
              </div>
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              style={{ backgroundColor: '#1a4fa3' }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Procesando pago...
                </div>
              ) : (
                'Pagar y Crear MenuQR - $22.990'
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              🚧 Demo - Integración con MercadoPago próximamente
            </p>
          </form>

          {/* Volver */}
          <button
            onClick={() => navigate('/')}
            className="w-full text-gray-600 py-3 text-center hover:text-gray-800 transition-colors mt-4"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;