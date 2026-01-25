import { Link } from 'react-router-dom';
import { HiShoppingCart, HiStar } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

const EbookCard = ({ ebook }) => {
  const { addToCart, loading } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(ebook._id);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Construire l'URL complète pour l'image
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-book.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
      <Link to={`/library/${ebook.slug}`} className="block">
        {/* Cover Image */}
        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={getImageUrl(ebook.coverImage)}
            alt={ebook.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-4" dir="rtl">
          {/* Title */}
          <h3 className="font-bold text-black mb-2 line-clamp-2 group-hover:text-gray-800 transition-colors">
            {ebook.title}
          </h3>

          {/* Author */}
          <p className="text-sm text-gray-600 mb-2">
            𞤫 𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤 {ebook.author}
          </p>

          {/* Rating */}
          {ebook.rating && (
            <div className="flex items-center space-x-1 space-x-reverse mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <HiStar
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(ebook.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({ebook.reviewsCount || 0})
              </span>
            </div>
          )}

          {/* Category */}
          <div className="mb-3">
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 text-xs">
              {ebook.category}
            </span>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-black">
              {formatPrice(ebook.price)}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="bg-black text-white p-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiShoppingCart className="h-4 w-4" />
            </button>
          </div>

          {/* Pages count */}
          {ebook.pages && (
            <div className="mt-2 text-xs text-gray-500">
              {ebook.pages} 𞤊𞤢𞤤𞤫
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default EbookCard;