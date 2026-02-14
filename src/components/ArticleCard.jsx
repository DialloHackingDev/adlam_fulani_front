import { Link } from 'react-router-dom';
import { HiHeart, HiCalendar, HiUser, HiEye } from 'react-icons/hi';
import { getImageUrl } from '../services/apiService';

const ArticleCard = ({ article }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  return (
    <article className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative">
        {getImageUrl(article.coverImage) ? (
          <img
            src={getImageUrl(article.coverImage)}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-medium ${getImageUrl(article.coverImage) ? 'hidden' : 'flex'}`}>
          <div className="text-center">
            <div className="text-4xl mb-2">📰</div>
            <div>𞤐𞤮 𞤢𞤣𞤢𞤲𞤭 𞤸𞤮𞤶𞤢</div>
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className="inline-block bg-black/80 backdrop-blur-sm text-white px-3 py-1 text-xs font-medium rounded-full">
            {getCategoryName(article.category)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6" dir="rtl">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors leading-tight">
          <Link to={`/articles/${article.slug}`} className="hover:underline">
            {article.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
          {article.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center space-x-1 space-x-reverse">
              <HiCalendar className="h-3 w-3" />
              <span>{formatDate(article.publishedAt || article.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <HiUser className="h-3 w-3" />
              <span>{article.author?.name || 'Auteur inconnu'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="flex items-center space-x-1 space-x-reverse">
              <HiEye className="h-3 w-3" />
              <span>{article.views || 0}</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <HiHeart className="h-3 w-3 text-red-500" />
              <span>{article.likes || 0}</span>
            </div>
          </div>
        </div>

        {/* Read More Link */}
        <div className="pt-4 border-t border-gray-100">
          <Link
            to={`/articles/${article.slug}`}
            className="inline-flex items-center text-black font-medium hover:text-gray-700 transition-colors group/link"
          >
            <span>𞤔𞤢𞤲𞤢𞤲 𞤀𞤣𞤢𞤲𞤭</span>
            <svg className="w-4 h-4 mr-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;