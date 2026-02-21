import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiTrash, HiShoppingBag, HiArrowLeft } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../services/apiService';

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
    return items.reduce((total, item) => {
      const itemPrice = item.ebook?.price || item.price || 0;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 sm:w-1/4 mb-6 sm:mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-16 h-20 sm:w-20 sm:h-28 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2 sm:space-y-3">
                        <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 h-fit">
                <div className="space-y-4">
                  <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 space-x-reverse text-sm mb-6 sm:mb-8" dir="rtl">
            <Link to="/" className="text-gray-500 hover:text-black transition-colors">
              𞤀𞤧𞤵𞤤
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-black font-medium">𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤</span>
          </nav>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4" dir="rtl">
                𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤 𞤊𞤢𞤪𞤭
              </h2>
              <p className="text-gray-500 mb-8 text-sm sm:text-base" dir="rtl">
                𞤅𞤢𞤪𞤣𞤭 𞤼𞤭𞤪𞤭𞤣𞤢𞤪 𞤣𞤫𞤬𞤼𞤫 𞤫 𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤 𞤫𞤪𞤭
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  to="/ebooks"
                  className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  dir="rtl"
                >
                  <HiArrowLeft className="h-5 w-5 ml-2" />
                  𞤅𞤢𞤦𞤼𞤮 𞤔𞤢𞤲𞤺𞤮𞤤
                </Link>
                <Link
                  to="/articles"
                  className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  dir="rtl"
                >
                  𞤃𞤢𞤦𞤢𞤤𞤫 𞤴𞤮𞤪𞤢𞤲
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 space-x-reverse text-sm mb-6 sm:mb-8" dir="rtl">
          <Link to="/" className="text-gray-500 hover:text-black transition-colors">
            𞤀𞤧𞤵𞤤
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-black font-medium">𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4" dir="rtl">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-2">
              🛍️ 𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤 𞤅𞤢𞤪𞤣𞤭𞤪𞤢𞤤
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {items.length} 𞤣𞤫𞤬𞤼𞤫 𞤫 𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤 𞤪𞤢𞤣𞤢
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center space-x-2 space-x-reverse text-red-600 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium"
            >
              <HiTrash className="h-4 w-4" />
              <span>𞤊𞤭𞤼𞤢𞤪 𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => {
                const ebook = item.ebook || {};
                const title = ebook.title || item.title || 'Titre non disponible';
                const author = ebook.author || item.author || 'Auteur inconnu';
                const price = ebook.price || item.price || 0;
                const coverImage = ebook.coverImage || item.coverImage;
                const imageUrl = getImageUrl(coverImage);
                
                return (
                  <div
                    key={item._id || item.ebookId}
                    className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4 space-x-reverse" dir="rtl">
                      {/* Book Cover */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-20 sm:w-20 sm:h-28 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const parent = e.target.parentElement;
                                if (parent) {
                                  e.target.style.display = 'none';
                                  parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-2xl">📚</div>';
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                              📚
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Book Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-black mb-1 sm:mb-2 line-clamp-2">
                          {title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                          𞤫 𞤅𞤢𞤪𞤣𞤭𞤪𞤢𞤤 {author}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <span className="text-lg sm:text-xl font-bold text-black">
                              {formatPrice(price)}
                            </span>
                            {ebook.discountPrice && ebook.discountPrice < price && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(price)}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <span className="text-xs sm:text-sm text-gray-500">
                              𞤀𞤣𞤢𞤪𞤭: {item.quantity}
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-gray-700">
                              𞤊𞤮𞤼𞤼𞤢𞤪𞤭: {formatPrice(price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => removeFromCart(item._id || item.ebookId)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-all duration-300 group"
                          title="𞤊𞤭𞤼𞤢𞤪 𞤣𞤫𞤬𞤼𞤫"
                        >
                          <HiTrash className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 sticky top-24" dir="rtl">
              <h3 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6 flex items-center">
                📋 𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤 𞤅𞤢𞤪𞤣𞤭𞤪𞤢𞤤
              </h3>

              <div className="space-y-3 sm:space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm sm:text-base">𞤀𞤣𞤢𞤪𞤭 𞤣𞤫𞤬𞤼𞤫:</span>
                  <span className="font-medium text-sm sm:text-base">{items.length}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm sm:text-base">𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤 𞤊𞤢𞤪𞤭𞤣𞤢𞤪𞤭:</span>
                  <span className="font-medium text-sm sm:text-base">{formatPrice(calculateTotal())}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-t-2 border-gray-200">
                  <span className="text-lg sm:text-xl font-bold">𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤 𞤊𞤮𞤼𞤼𞤢𞤪𞤭:</span>
                  <span className="text-lg sm:text-xl font-bold text-black">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Link
                  to="/checkout"
                  className="block w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 sm:py-4 rounded-xl font-medium hover:from-gray-800 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base text-center"
                >
                  💳 𞤅𞤢𞤪𞤼𞤦𞤢𞤦𞤭𞤪𞤢𞤤 𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤
                </Link>

                <Link
                  to="/ebooks"
                  className="block text-center text-black hover:text-gray-600 text-sm sm:text-base font-medium py-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  ← 𞤅𞤢𞤪𞤼𞤦𞤢𞤦𞤭𞤪𞤢𞤤 𞤅𞤢𞤪𞤣𞤭𞤪𞤢𞤤
                </Link>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-2 space-x-reverse text-xs text-gray-500">
                  <span>🔒</span>
                  <span>𞤅𞤢𞤪𞤼𞤦𞤢𞤦𞤭𞤪𞤢𞤤 𞤅𞤢𞤪𞤣𞤭𞤲𞤢𞤤</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;