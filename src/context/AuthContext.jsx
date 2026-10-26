import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import { clearAccountData } from '../utils/offlineStore';

// Dernier profil connu : permet de rester connecté sans réseau
const USER_KEY = 'user';

const readCachedUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true
  });

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await apiService.auth.getProfile();
        // Réponse API : { status, data: { user } }
        const user = response.data.data.user;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      }
    } catch (error) {
      const cachedUser = readCachedUser();
      if (!error.response && cachedUser) {
        // Pas de réseau : la session reste ouverte avec le dernier profil connu
        dispatch({ type: 'LOGIN_SUCCESS', payload: cachedUser });
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem(USER_KEY);
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Pas de chargement global pendant la connexion : la page garde son formulaire
  // affiché et gère son propre état d'envoi. Les erreurs remontent à l'appelant.
  const login = useCallback(async (email, password) => {
    const response = await apiService.auth.login({ email, password });
    const { token, data } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });

    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await apiService.auth.register({ name, email, password });
    const { token, data } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });

    return data.user;
  }, []);

  const logout = useCallback(() => {
    apiService.auth.logout().catch(() => {});
    localStorage.removeItem('token');
    localStorage.removeItem(USER_KEY);
    // Livres et données du compte retirés de l'appareil
    clearAccountData();
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};