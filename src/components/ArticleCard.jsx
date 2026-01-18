import { Link } from 'react-router-dom';
import { HiHeart, HiCalendar, HiUser } from 'react-icons/hi';

const ArticleCard = ({ article }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
      {/* Image */}
      <div className="aspect-video overflow-hidden">
        <img
          src={article.coverImage || '/placeholder-image.jpg'}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-6" dir="rtl">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block bg-black text-white px-3 py-1 text-sm font-medium">
            {article.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-black mb-3 line-clamp-2 group-hover:text-gray-800 transition-colors">
          <Link to={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
          {article.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center space-x-1 space-x-reverse">
              <HiCalendar className="h-4 w-4" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <HiUser className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 space-x-reverse">
            <HiHeart className="h-4 w-4 text-red-500" />
            <span>{article.likesCount || 0}</span>
          </div>
        </div>

        {/* Read More Link */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            to={`/articles/${article.slug}`}
            className="text-black font-medium hover:underline transition-all duration-200"
          >
            𞤔𞤢𞤲𞤢𞤲 𞤀𞤣𞤢𞤲𞤭 ←
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;