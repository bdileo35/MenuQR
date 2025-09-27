import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Páginas públicas
import LandingPage from './pages/LandingPage';
import SuccessPage from './pages/SuccessPage';
import MenuViewStatic from './pages/MenuViewStatic';
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
              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/success" element={<SuccessPage />} />
              
              {/* Vista de menú por restaurante */}
              <Route path="/menu/:restaurantId" element={<MenuViewStatic />} />
              
              {/* Demo directo de Esquina Pompeya */}
              <Route path="/esquina-pompeya" element={<MenuViewStatic />} />
              
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