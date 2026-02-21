import { Link, useNavigate } from 'react-router-dom';
import { HiShoppingCart, HiStar, HiEye, HiHeart, HiLockClosed } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getImageUrl, apiService } from '../services/apiService';

const EbookCard = ({ ebook, featured = false }) => {
  const { addToCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login', { state: { from: `/ebooks/${ebook.slug}` } });
      return;
    }
    
    // Si l'ebook est gratuit, l'ajouter à la bibliothèque puis rediriger
    if (ebook.price === 0) {
      try {
        await apiService.checkout.addFreeEbook(ebook._id);
        navigate(`/ebook-reader/${ebook._id}`);
      } catch (error) {
        console.error('Error adding free ebook:', error);
        navigate(`/ebook-reader/${ebook._id}`);
      }
      return;
    }
    
    await addToCart(String(ebook._id));
  };

  const handleReadClick = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login', { state: { from: `/ebooks/${ebook.slug}` } });
      return;
    }
    
    // Si l'ebook est gratuit, l'ajouter à la bibliothèque puis rediriger
    if (ebook.price === 0) {
      try {
        await apiService.checkout.addFreeEbook(ebook._id);
        navigate(`/ebook-reader/${ebook._id}`);
      } catch (error) {
        console.error('Error adding free ebook:', error);
        navigate(`/ebook-reader/${ebook._id}`);
      }
      return;
    }
    
    navigate(`/ebooks/${ebook.slug}`);
  };

  const formatPrice = (price) => {
    if (price === 0) return '𞤀𞤦𞤫𞤧𞤫';
    return new Intl.NumberFormat('ar', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };



  return (
    <div className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100 ${
      featured ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
    }`}>
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center">
            <HiStar className="h-3 w-3 mr-1" />
            𞤑𞤫𞤧𞤢𞤲𞤣𞤫
          </div>
        </div>
      )}

      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {getImageUrl(ebook.coverImage) ? (
          <img
            src={getImageUrl(ebook.coverImage)}
            alt={ebook.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><div class="text-center"><div class="text-6xl mb-2">📚</div><p class="text-sm">𞤐𞤮 𞤸𞤮𞤼𞤮</p></div></div>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-2">📚</div>
              <p className="text-sm">𞤐𞤮 𞤸𞤮𞤼𞤮</p>
            </div>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={handleReadClick}
            className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-black px-6 py-3 rounded-full font-medium flex items-center space-x-2 space-x-reverse"
            dir="rtl"
          >
            {!user && <HiLockClosed className="h-4 w-4 ml-2" />}
            <span>{user ? '𞤑𞤢𞤪𞤢𞤲' : '𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤑𞤢𞤪𞤢𞤲'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6" dir="rtl">
        {/* Category */}
        <div className="mb-3">
          <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
            {ebook.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-black mb-2 line-clamp-2 group-hover:text-gray-800 transition-colors text-lg leading-tight">
          {ebook.title}
        </h3>

        {/* Author */}
        <p className="text-sm text-gray-600 mb-3 flex items-center">
          <span className="ml-1">𞤫</span>
          <span className="font-medium">{ebook.author || '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤 𞤀𞤣𞤤𞤢𞤥'}</span>
        </p>

        {/* Rating and Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 space-x-reverse">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <HiStar
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(ebook.rating || 4.5)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({ebook.reviewsCount || Math.floor(Math.random() * 50) + 10})
            </span>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse text-xs text-gray-500">
            <div className="flex items-center">
              <HiEye className="h-3 w-3 ml-1" />
              <span>{ebook.views || Math.floor(Math.random() * 1000) + 100}</span>
            </div>
            <div className="flex items-center">
              <HiHeart className="h-3 w-3 ml-1" />
              <span>{ebook.likes || Math.floor(Math.random() * 50) + 5}</span>
            </div>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-black">
            {formatPrice(ebook.price || 0)}
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/btn"
              title={ebook.price === 0 ? '𞤑𞤢𞤪𞤢𞤲 𞤔𞤮𞤲𞤭' : (user ? '𞤑𞤢𞤦𞤢𞤤 𞤫 𞤨𞤢𞤲𞤭𞤴𞤫' : '𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤧𞤢𞤴𞤢𞤲')}
            >
              {!user ? (
                <HiLockClosed className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              ) : (
                <HiShoppingCart className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
              )}
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>{ebook.pages || Math.floor(Math.random() * 200) + 50} 𞤊𞤢𞤤𞤫</span>
          <span>{ebook.language || '𞤊𞤵𞤤𞤢𞤪'}</span>
          <span>{ebook.publishYear || '2024'}</span>
        </div>
      </div>
    </div>
  );
};

export default EbookCard;