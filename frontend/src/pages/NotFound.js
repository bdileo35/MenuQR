import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
            <Search className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Página no encontrada
          </h1>
          <p className="text-gray-600 mb-8">
            Lo sentimos, no pudimos encontrar la página que estás buscando. 
            Puede que el enlace esté incorrecto o la página haya sido movida.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.history.back()}
            className="btn-outline w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver atrás
          </button>
          
          <Link
            to="/"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Ir al inicio
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          ¿Tienes un restaurante? 
          <Link 
            to="/admin/register" 
            className="text-primary-600 hover:text-primary-700 ml-1"
          >
            Crea tu menú digital
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;