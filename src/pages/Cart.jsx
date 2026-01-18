import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiTrash, HiShoppingBag } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, loading, fetchCart, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 space-x-reverse p-4 border border-gray-200">
                  <div className="w-20 h-28 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16" dir="rtl">
            <HiShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤 𞤊𞤢𞤪𞤭
            </h2>
            <p className="text-gray-500 mb-8">
              𞤅𞤢𞤪𞤣𞤭 𞤼𞤭𞤪𞤭𞤣𞤢𞤪 𞤣𞤫𞤬𞤼𞤫 𞤫 𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤 𞤫𞤪𞤭
            </p>
            <Link
              to="/library"
              className="inline-block bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors"
            >
              𞤅𞤢𞤦𞤼𞤮 𞤔𞤢𞤲𞤺𞤮𞤤
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8" dir="rtl">
          <h1 className="text-3xl font-bold text-black">
            🛒 𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤 𞤅𞤢𞤪𞤣𞤭𞤪𞤢𞤤 ({items.length})
          </h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
            >
              𞤊𞤭𞤼𞤢𞤪 𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.ebookId}
                  className="flex items-center space-x-4 space-x-reverse p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  dir="rtl"
                >
                  {/* Book Cover */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.coverImage || '/placeholder-book.jpg'}
                      alt={item.title}
                      className="w-20 h-28 object-cover border border-gray-200"
                    />
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-black mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      𞤫 𞤅𞤢𞤪𞤣𞤭𞤪𞤢𞤤 {item.author}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-black">
                        {formatPrice(item.price)}
                      </div>
                      <div className="text-sm text-gray-500">
                        𞤀𞤣𞤢𞤪𞤭: {item.quantity}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.ebookId)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <HiTrash className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 p-6 sticky top-24" dir="rtl">
              <h3 className="text-lg font-bold text-black mb-4">
                𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤 𞤅𞤢𞤪𞤣𞤭𞤪𞤢𞤤
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">𞤀𞤣𞤢𞤪𞤭 𞤣𞤫𞤬𞤼𞤫:</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤 𞤊𞤢𞤪𞤭𞤣𞤢𞤪𞤭:</span>
                  <span className="font-medium">{formatPrice(calculateTotal())}</span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤 𞤊𞤮𞤼𞤼𞤢𞤪𞤭:</span>
                    <span className="text-lg font-bold text-black">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors mb-4">
                𞤅𞤢𞤪𞤼𞤦𞤢𞤦𞤭𞤪𞤢𞤤 𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤
              </button>

              <Link
                to="/library"
                className="block text-center text-black hover:underline text-sm"
              >
                𞤅𞤢𞤪𞤼𞤦𞤢𞤦𞤭𞤪𞤢𞤤 𞤅𞤢𞤪𞤣𞤭𞤪𞤢𞤤
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;