import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Páginas públicas
import MenuView from './pages/MenuView';
import NotFound from './pages/NotFound';

// Páginas administrativas
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';
import AdminDashboard from './pages/admin/Dashboard';
import MenuEditor from './pages/admin/MenuEditor';

// Componentes de layout
import ProtectedRoute from './components/ProtectedRoute';
import Notification from './components/Notification';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<MenuView />} />
              <Route path="/:restaurantId" element={<MenuView />} />
              
              {/* Rutas administrativas */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/register" element={<Register />} />
              
              {/* Rutas protegidas */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/menu" 
                element={
                  <ProtectedRoute>
                    <MenuEditor />
                  </ProtectedRoute>
                } 
              />
              
              {/* Ruta alternativa para edición con ID de restaurante */}
              <Route path="/editar/:restaurantId" element={<Login />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Notificaciones globales */}
            <Notification />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;