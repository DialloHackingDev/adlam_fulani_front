import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { apiService } from '../services/apiService';

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

const ArticlesBanner = () => {
  const [articles, setArticles] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await apiService.articles.getAll({ limit: 5 });
        const articlesData = response.data.data?.articles || response.data.articles || [];
        setArticles(articlesData);
      } catch (error) {
        console.error('Error fetching articles:', error);
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
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [articles.length]);

  if (loading) {
    return (
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-gray-900 to-gray-800 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-2">📰</div>
          <p className="text-sm">𞤐𞤮 𞤢𞤣𞤢𞤲𞤭 𞤸𞤮𞤶𞤢</p>
        </div>
      </div>
    );
  }

  const currentArticle = articles[currentSlide];

  return (
    <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="absolute inset-0">
        {currentArticle.coverImage ? (
          <img
            src={currentArticle.coverImage}
            alt={currentArticle.title}
            className="w-full h-full object-cover"
            onError={(e) => e.target.style.display = 'none'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <div className="text-8xl">📰</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl text-right" dir="rtl">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1 text-xs font-medium rounded-full border border-white/30 mb-3">
              {getCategoryName(currentArticle.category)}
            </span>
            <h2 className="text-xl md:text-3xl font-bold text-white mb-3 leading-tight line-clamp-2">
              {currentArticle.title}
            </h2>
            <p className="text-sm md:text-base text-gray-200 mb-4 line-clamp-2">
              {currentArticle.excerpt}
            </p>
            <Link
              to={`/articles/${currentArticle.slug}`}
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

      {articles.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length)}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all"
          >
            <HiChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % articles.length)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all"
          >
            <HiChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 space-x-reverse">
            {articles.map((_, index) => (
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

export default ArticlesBanner;
