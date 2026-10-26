import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { formatDate } from '../utils/format';
import { apiService, getImageUrl } from '../services/apiService';

// Mapper les catégories backend vers affichage Fulani
const getCategoryName = (category) => {
  const categoryMap = {
    'litterature': '𞤀𞤣𞤢𞤦𞤢𞤲',
    'histoire': '𞤚𞤢𞤪𞤭𞤲𞤢𞤤',
    'education': '𞤔𞤢𞤲𞤺𞤢𞤤',
    'culture': '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤',
    'science': '𞤅𞤢𞤲𞤣𞤢𞤲𞤣𞤭',
    'religion': '𞤄𞤭𞤲𞤢𞤤'
  };
  return categoryMap[category] || category;
};

const HeroBanner = () => {
  const [articles, setArticles] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Récupérer tous les articles sans filtre status
        const response = await apiService.articles.getAll({ limit: 5 });
        
        const articlesData = response.data.data?.articles || response.data.articles || [];
        
        if (articlesData.length > 0) {
        }
        
        setArticles(articlesData);
      } catch (error) {
        // Fallback avec des données vides
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    if (articles.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % articles.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [articles.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
  };

  if (loading) {
    return (
      <div className="relative h-96 md:h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <div className="text-lg">𞤔𞤢𞤪𞤭 𞤸𞤢𞤤𞤢𞤲𞤣𞤫...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="relative h-96 md:h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">📰</div>
          <h2 className="text-2xl font-bold mb-2">𞤅𞤢𞤲𞤣𞤭 𞤃𞤢𞤦𞤢𞤤𞤫</h2>
          <p className="text-gray-300">𞤐𞤮 𞤢𞤣𞤢𞤲𞤭 𞤸𞤮𞤶𞤢</p>
        </div>
      </div>
    );
  }

  const currentArticle = articles[currentSlide];

  return (
    <div className="relative h-96 md:h-[600px] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Background Image */}
      <div className="absolute inset-0">
        {currentArticle.coverImage ? (
          <img
            src={getImageUrl(currentArticle.coverImage)}
            alt={currentArticle.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-6xl text-gray-600">📰</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl text-left">
            {/* Category Badge */}
            <div className="inline-block mb-6">
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 text-sm font-medium rounded-full border border-white/30">
                {getCategoryName(currentArticle.category)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {currentArticle.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg md:text-xl text-gray-200 mb-8 line-clamp-3 leading-relaxed max-w-3xl">
              {currentArticle.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex items-center space-x-8 text-gray-300 mb-8 text-sm">
              <span>{formatDate(currentArticle.publishedAt || currentArticle.createdAt)}</span>
              <span>𞤫 𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤 {currentArticle.author?.name || 'Auteur inconnu'}</span>
              <span>❤️ {currentArticle.likes || 0}</span>
              <span>👁️ {currentArticle.views || 0}</span>
            </div>

            {/* CTA Button */}
            <Link
              to={`/articles/${currentArticle.slug}`}
              className="inline-flex items-center bg-white text-black px-8 py-4 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span>𞤔𞤢𞤲𞤢𞤲 𞤃𞤢𞤦𞤢𞤤</span>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {articles.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 border border-white/30"
          >
            <HiChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 border border-white/30"
          >
            <HiChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {articles.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 min-h-0 min-w-0 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;