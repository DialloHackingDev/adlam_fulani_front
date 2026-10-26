import { useNavigate } from 'react-router-dom';
import { HiShoppingCart, HiLockClosed, HiBookOpen, HiUser, HiTranslate, HiDocumentText } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getImageUrl, apiService } from '../services/apiService';
import { formatNumber, formatPrice, getCategoryLabel, getLanguageLabel } from '../utils/format';
import ContentCard from './ContentCard';

const EbookCard = ({ ebook, featured = false }) => {
  const { addToCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const price = ebook.effectivePrice ?? ebook.price ?? 0;
  const isFree = price === 0;

  const handleAction = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login', { state: { from: `/ebooks/${ebook.slug}` } });
      return;
    }

    // E-book gratuit : l'ajouter à la bibliothèque puis l'ouvrir
    if (isFree) {
      try {
        await apiService.checkout.addFreeEbook(ebook._id);
      } catch {
        // Déjà dans la bibliothèque ou erreur réseau : le lecteur vérifiera l'accès
      }
      navigate(`/ebook-reader/${ebook._id}`);
      return;
    }

    await addToCart(String(ebook._id));
  };

  const meta = [
    { icon: HiUser, label: ebook.author || '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤 𞤀𞤣𞤤𞤢𞤥' },
    ebook.language && { icon: HiTranslate, label: getLanguageLabel(ebook.language) },
    ebook.pageCount > 0 && { icon: HiDocumentText, label: `${formatNumber(ebook.pageCount)} 𞤊𞤢𞤤𞤫` }
  ].filter(Boolean);

  const actionLabel = !user
    ? '𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤑𞤢𞤪𞤢𞤲'
    : isFree ? '𞤑𞤢𞤪𞤢𞤲 𞤔𞤮𞤲𞤭' : '𞤑𞤢𞤦𞤢𞤤 𞤫 𞤨𞤢𞤲𞤭𞤴𞤫';
  const ActionIcon = !user ? HiLockClosed : isFree ? HiBookOpen : HiShoppingCart;

  return (
    <ContentCard
      to={`/ebooks/${ebook.slug}`}
      image={getImageUrl(ebook.coverImage)}
      imageAlt={ebook.title}
      imageFit="contain"
      fallbackIcon={HiBookOpen}
      badge={getCategoryLabel(ebook.category)}
      featured={featured || ebook.featured}
      featuredLabel="𞤑𞤫𞤧𞤢𞤲𞤣𞤫"
      title={ebook.title}
      meta={meta}
      footer={
        <>
          <div className="flex items-baseline gap-2">
            <span className={`text-lg font-bold ${isFree ? 'text-emerald-600' : 'text-gray-900'}`}>
              {formatPrice(price, ebook.currency)}
            </span>
            {ebook.onSale && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(ebook.price, ebook.currency)}</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAction}
            disabled={loading}
            title={actionLabel}
            aria-label={actionLabel}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-all duration-200 hover:scale-105 hover:bg-gray-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-900/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ActionIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </>
      }
    />
  );
};

export default EbookCard;
