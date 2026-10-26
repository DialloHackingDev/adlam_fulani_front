import React, { useState, useEffect } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { register } from 'swiper/element/bundle';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Register Swiper modules
register();

const SimilarArticles = ({ categoryId, currentArticleId }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimilarArticles();
  }, [categoryId, currentArticleId]);

  const fetchSimilarArticles = async () => {
    try {
      setLoading(true);
      // Simuler l'appel API - remplacer avec le vrai appel
      const response = await fetch(`/api/articles/similar?categoryId=${categoryId}&excludeId=${currentArticleId}&limit=6`);
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-2xl font-bold text-black mb-6">
          𞤃𞤢𞤦𞤢𞤤𞤫 𞤸𞤮𞥄𞤤𞤭𞥄𞤲
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-black">
          𞤃𞤢𞤦𞤢𞤤𞤫 𞤸𞤮𞥄𞤤𞤭𞥄𞤲
        </h3>
        
        <div className="flex space-x-2">
          <button
            className="similar-prev bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-50 transition-colors"
            aria-label="Article précédent"
          >
            <HiChevronRight className="h-5 w-5" />
          </button>
          <button
            className="similar-next bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-50 transition-colors"
            aria-label="Article suivant"
          >
            <HiChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        navigation={{
          prevEl: '.similar-prev',
          nextEl: '.similar-next',
        }}
        pagination={{
          clickable: true,
          el: '.similar-pagination',
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="similar-articles-swiper"
      >
        {articles.map((article) => (
          <SwiperSlide key={article._id}>
            <Link
              to={`/articles/${article.slug}`}
              className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              {/* Image */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 overflow-hidden">
                {article.coverImage ? (
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-4xl">📄</span>
                  </div>
                )}
              </div>

              {/* Contenu */}
              <div className="p-6">
                {/* Catégorie */}
                <div className="mb-3">
                  <span className="inline-block bg-black text-white text-xs px-2 py-1 rounded">
                    {article.category}
                  </span>
                </div>

                {/* Titre */}
                <h4 className="font-bold text-black mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h4>

                {/* Extrait */}
                {article.excerpt && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}

                {/* Métadonnées */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {formatDate(article.publishedAt || article.createdAt)}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      ❤️ {article.likes || 0}
                    </span>
                    <span className="flex items-center">
                      ⏱️ {Math.ceil(article.content?.length / 1000) || 5} 𞤣𞤢𞤳
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="text-gray-400 text-xs">
                        +{article.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination */}
      <div className="similar-pagination mt-6 flex justify-center"></div>
    </div>
  );
};

export default SimilarArticles;
