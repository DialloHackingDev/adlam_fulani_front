import { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload, loading: false };
    case 'SET_COUNT':
      return { ...state, count: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.ebookId === action.payload.ebookId ? action.payload : item
        )
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.ebookId !== action.payload)
      };
    case 'CLEAR_CART':
      return { ...state, items: [], count: 0 };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    count: 0,
    loading: false
  });

  const addToCart = async (ebookId, quantity = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await cartAPI.addToCart(ebookId, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeFromCart = async (ebookId) => {
    try {
      await cartAPI.removeItem(ebookId);
      dispatch({ type: 'REMOVE_ITEM', payload: ebookId });
      await fetchCartCount();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      dispatch({ type: 'SET_CART', payload: response.data.items || [] });
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchCartCount = async () => {
    try {
      // Ne pas faire d'appel si pas de token
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'SET_COUNT', payload: 0 });
        return;
      }
      
      const response = await cartAPI.getCount();
      dispatch({ type: 'SET_COUNT', payload: response.data.count || 0 });
    } catch (error) {
      // Ignorer les erreurs 401 (non authentifié)
      if (error.response?.status !== 401) {
        console.error('Error fetching cart count:', error);
      }
      dispatch({ type: 'SET_COUNT', payload: 0 });
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      removeFromCart,
      clearCart,
      fetchCart,
      fetchCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};