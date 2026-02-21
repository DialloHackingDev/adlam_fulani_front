import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { apiService, getImageUrl } from '../services/apiService';

const EbooksBanner = () => {
  const [ebooks, setEbooks] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const response = await apiService.ebooks.getAll({ limit: 5 });
        const ebooksData = response.data.data?.ebooks || response.data.ebooks || [];
        setEbooks(ebooksData);
      } catch (error) {
        console.error('Error fetching ebooks:', error);
        setEbooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEbooks();
  }, []);

  useEffect(() => {
    if (ebooks.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % ebooks.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [ebooks.length]);

  if (loading) {
    return (
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-gray-900 to-gray-800 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!ebooks.length) {
    return (
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-2">📚</div>
          <p className="text-sm">𞤐𞤮 𞤃𞤫𞤧𞤮 𞤸𞤮𞤶𞤢</p>
        </div>
      </div>
    );
  }

  const currentEbook = ebooks[currentSlide];
  const coverImage = getImageUrl(currentEbook.coverImage);

  return (
    <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="absolute inset-0">
        {coverImage ? (
          <img
            src={coverImage}
            alt={currentEbook.title}
            className="w-full h-full object-cover"
            onError={(e) => e.target.style.display = 'none'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <div className="text-8xl">📚</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl text-right" dir="rtl">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1 text-xs font-medium rounded-full border border-white/30 mb-3">
              📚 𞤃𞤫𞤧𞤮
            </span>
            <h2 className="text-xl md:text-3xl font-bold text-white mb-3 leading-tight line-clamp-2">
              {currentEbook.title}
            </h2>
            <p className="text-sm md:text-base text-gray-200 mb-2">
              {currentEbook.author}
            </p>
            {currentEbook.price > 0 ? (
              <p className="text-lg font-bold text-white mb-4">
                {currentEbook.price.toLocaleString()} 𞤊𞤪𞤢𞤲𞤳
              </p>
            ) : (
              <p className="text-lg font-bold text-green-400 mb-4">𞤊𞤢𞤤𞤢𞤲</p>
            )}
            <Link
              to={`/library/${currentEbook._id}`}
              className="inline-flex items-center bg-white text-black px-4 py-2 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-all"
            >
              <span>𞤔𞤢𞤲𞤢𞤲</span>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {ebooks.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + ebooks.length) % ebooks.length)}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all"
          >
            <HiChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % ebooks.length)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all"
          >
            <HiChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 space-x-reverse">
            {ebooks.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EbooksBanner;
