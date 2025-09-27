import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, setAuthData, clearAuthData, getStoredUser, isLoggedIn } from '../services/api';

const AuthContext = createContext();

// Estados de autenticación
const initialState = {
  user: getStoredUser(),
  isAuthenticated: isLoggedIn(),
  loading: false,
  error: null,
};

// Reducer para manejar las acciones de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      if (isLoggedIn()) {
        try {
          dispatch({ type: 'AUTH_START' });
          const response = await authAPI.getProfile();
          dispatch({ 
            type: 'AUTH_SUCCESS', 
            payload: { user: response.data.user } 
          });
        } catch (error) {
          console.error('Error verificando autenticación:', error);
          dispatch({ 
            type: 'AUTH_ERROR', 
            payload: 'Sesión expirada' 
          });
          clearAuthData();
        }
      }
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      setAuthData(token, user);
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user } 
      });
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  // Función para registrarse
  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      setAuthData(token, user);
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { user } 
      });
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al registrarse';
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    clearAuthData();
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  // Función para actualizar perfil
  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      const updatedUser = response.data.user;
      
      // Actualizar localStorage
      setAuthData(localStorage.getItem('token'), updatedUser);
      
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: updatedUser 
      });
      
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al actualizar perfil';
      return { success: false, error: errorMessage };
    }
  };

  // Función para cambiar contraseña
  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al cambiar contraseña';
      return { success: false, error: errorMessage };
    }
  };

  // Limpiar errores
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;