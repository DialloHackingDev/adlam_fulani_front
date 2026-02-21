import { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '../services/apiService';

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
      console.log('Adding to cart:', { ebookId, quantity, type: typeof ebookId });
      await apiService.cart.add({ ebookId, quantity });
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeFromCart = async (ebookId) => {
    try {
      await apiService.cart.remove(ebookId);
      dispatch({ type: 'REMOVE_ITEM', payload: ebookId });
      await fetchCart(); // Recharger le panier complet
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await apiService.cart.clear();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiService.cart.get();
      const cartData = response.data.data || response.data;
      dispatch({ type: 'SET_CART', payload: cartData.items || [] });
      dispatch({ type: 'SET_COUNT', payload: cartData.totalItems || 0 });
    } catch (error) {
      console.error('Error fetching cart:', error);
      // En cas d'erreur, initialiser avec un panier vide
      dispatch({ type: 'SET_CART', payload: [] });
      dispatch({ type: 'SET_COUNT', payload: 0 });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'SET_COUNT', payload: 0 });
        return;
      }
      const response = await apiService.cart.getCount();
      const count = response.data.data?.count || response.data.count || 0;
      dispatch({ type: 'SET_COUNT', payload: count });
    } catch (error) {
      console.error('Error fetching cart count:', error);
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