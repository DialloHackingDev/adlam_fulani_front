import { HiHeart, HiUser, HiEye, HiNewspaper, HiArrowRight } from 'react-icons/hi';
import { getImageUrl } from '../services/apiService';
import { formatDate, formatNumber, getCategoryLabel } from '../utils/format';
import ContentCard from './ContentCard';

const ArticleCard = ({ article }) => {
  const meta = [
    article.author?.name && { icon: HiUser, label: article.author.name },
    { icon: HiEye, label: formatNumber(article.views) },
    { icon: HiHeart, label: formatNumber(article.likes), className: '[&>svg]:text-red-500' }
  ].filter(Boolean);

  return (
    <ContentCard
      to={`/articles/${article.slug}`}
      image={getImageUrl(article.coverImage)}
      imageAlt={article.title}
      fallbackIcon={HiNewspaper}
      badge={getCategoryLabel(article.category)}
      featured={article.featured}
      featuredLabel="𞤑𞤫𞤧𞤢𞤲𞤣𞤫"
      title={article.title}
      subtitle={article.excerpt}
      meta={meta}
      footer={
        <>
          <time dateTime={article.publishedAt || article.createdAt} className="text-xs text-gray-500">
            {formatDate(article.publishedAt || article.createdAt)}
          </time>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900">
            <span>𞤔𞤢𞤲𞤢𞤲 𞤀𞤣𞤢𞤲𞤭</span>
            <HiArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </>
      }
    />
  );
};

export default ArticleCard;
