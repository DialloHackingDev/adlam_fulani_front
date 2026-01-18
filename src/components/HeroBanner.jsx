import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { articlesAPI } from '../services/api';

const HeroBanner = () => {
  const [articles, setArticles] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        const response = await articlesAPI.getFeatured();
        setArticles(response.data.articles || []);
      } catch (error) {
        console.error('Error fetching featured articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, []);

  useEffect(() => {
    if (articles.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % articles.length);
      }, 5000);
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
      <div className="relative h-96 bg-gray-100 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (!articles.length) {
    return null;
  }

  const currentArticle = articles[currentSlide];

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentArticle.coverImage || '/placeholder-image.jpg'}
          alt={currentArticle.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl text-right" dir="rtl">
            {/* Category Badge */}
            <div className="inline-block mb-4">
              <span className="bg-white text-black px-3 py-1 text-sm font-medium">
                {currentArticle.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {currentArticle.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg text-gray-200 mb-6 line-clamp-3">
              {currentArticle.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex items-center space-x-6 space-x-reverse text-gray-300 mb-8">
              <span>{new Date(currentArticle.createdAt).toLocaleDateString('ar')}</span>
              <span>𞤫 𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤 {currentArticle.author}</span>
              <span>❤️ {currentArticle.likesCount || 0}</span>
            </div>

            {/* CTA Button */}
            <Link
              to={`/articles/${currentArticle.slug}`}
              className="inline-block bg-white text-black px-8 py-3 font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              𞤔𞤢𞤲𞤢𞤲 𞤃𞤢𞤦𞤢𞤤
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {articles.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          >
            <HiChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          >
            <HiChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {articles.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 space-x-reverse">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;