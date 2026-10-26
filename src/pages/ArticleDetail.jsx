import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  HiArrowLeft,
  HiHeart,
  HiOutlineHeart,
  HiShare,
  HiClock,
  HiEye,
  HiArrowUp,
  HiBookmark,
  HiOutlineBookmark,
  HiLink,
  HiNewspaper,
  HiChat
} from 'react-icons/hi';
import { apiService, getImageUrl } from '../services/apiService';
import { formatDate, formatNumber, getCategoryLabel } from '../utils/format';
import ArticleComments from '../components/ArticleComments';

const BOOKMARKS_KEY = 'bookmarkedArticles';

// Favoris conservés dans le navigateur du lecteur (confort personnel)
const readBookmarks = () => {
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) || [];
  } catch {
    return [];
  }
};

const getReadingTime = (html = '') => {
  const words = html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const getInitial = (name = '') => name.trim().charAt(0).toUpperCase() || '𞤀';

const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copied, setCopied] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const loadRelated = useCallback(async (current) => {
    try {
      const [byCategory, recent] = await Promise.all([
        apiService.articles.getByCategory(current.category, { limit: 4 }),
        apiService.articles.getRecent(6)
      ]);
      const seen = new Set([current._id]);
      const list = [...(byCategory.data.data?.articles || []), ...(recent.data.data?.articles || [])]
        .filter(a => !seen.has(a._id) && seen.add(a._id));
      setRelated(list.slice(0, 3));
    } catch {
      setRelated([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const response = await apiService.articles.getBySlug(slug);
        const data = response.data.data.article;
        if (cancelled) return;

        setArticle(data);
        setLikesCount(data.likes || 0);
        setBookmarked(readBookmarks().includes(data._id));
        window.scrollTo(0, 0);
        loadRelated(data);

        // État du like pour ce visiteur (connecté ou anonyme)
        apiService.likes.getArticleLikes(data._id)
          .then(res => {
            if (cancelled) return;
            setLiked(res.data.data.liked);
            setLikesCount(res.data.data.totalLikes);
          })
          .catch(() => {});
      } catch (error) {
        if (error.response?.status === 404) navigate('/articles');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [slug, navigate, loadRelated]);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount(c => c + (wasLiked ? -1 : 1));
    try {
      const res = await apiService.articles.toggleLike(article._id);
      const result = res.data.data;
      setLiked(Boolean(result.liked));
      if (typeof result.totalLikes === 'number') setLikesCount(result.totalLikes);
    } catch {
      setLiked(wasLiked);
      setLikesCount(c => c + (wasLiked ? 1 : -1));
    }
  };

  // Confirmation visible de chaque action (partage, favori)
  const notify = (message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Arrivée directe (lien partagé, nouvel onglet) : pas de page précédente dans le site
  const handleBack = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate('/articles');
  };

  const handleBookmark = () => {
    const list = readBookmarks();
    const next = bookmarked ? list.filter(id => id !== article._id) : [...list, article._id];
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
    } catch {
      // Stockage indisponible (navigation privée) : l'état reste local à la page
    }
    setBookmarked(!bookmarked);
    notify(bookmarked ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      notify('Lien copié');
    } catch {
      // Presse-papiers refusé : proposer le lien à copier à la main
      window.prompt('Copiez le lien de l\'article :', window.location.href);
    }
  };

  const handleShare = async () => {
    // Partage natif (téléphone) sinon copie du lien (ordinateur)
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text: article.excerpt, url: window.location.href });
      } catch {
        // Partage annulé par l'utilisateur
      }
    } else {
      copyLink();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-[55vh] animate-pulse bg-gray-200" />
        <div className="mx-auto max-w-3xl space-y-4 px-5 py-10">
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 animate-pulse rounded bg-gray-100" />
          <div className="h-4 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">𞤃𞤢𞤦𞤢𞤤 𞤧𞤢𞤦𞤢𞤲𞤢𞤲</h2>
          <Link to="/articles" className="text-black hover:underline">𞤪𞤵𞤼𞤢𞤲 𞤫 𞤃𞤢𞤦𞤢𞤤𞤫</Link>
        </div>
      </div>
    );
  }

  const cover = getImageUrl(article.coverImage);
  const published = article.publishedAt || article.createdAt;
  const authorName = article.author?.name || '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤 𞤀𞤣𞤤𞤢𞤥';
  const shareUrl = encodeURIComponent(window.location.href);

  const authorCard = (
    <section className="rounded-2xl border border-gray-100 p-5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.12)]">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-black text-lg font-bold text-white">
          {getInitial(authorName)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-gray-900">{authorName}</p>
          <p className="text-sm text-gray-500">{formatDate(published)}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-5">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(article.title)}%20${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-0 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-0 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Facebook
        </a>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex min-h-0 items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900"
        >
          <HiLink className="h-4 w-4" aria-hidden="true" />
          {copied ? '✓' : '𞤂𞤭𞤲𞤳 𞤳𞤮𞤨𞤭'}
        </button>
      </div>
    </section>
  );

  const iconButtonBase =
    'flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-colors ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-white';
  const iconButton = `${iconButtonBase} bg-black/30 text-white hover:bg-black/50`;
  // Bouton à l'état actif (article en favori) : blanc plein, bien visible sur l'image
  const iconButtonActive = `${iconButtonBase} bg-white text-black hover:bg-white/90`;

  return (
    <div className="min-h-screen bg-white">
      {/* Progression de lecture */}
      <div className="fixed left-0 top-0 z-50 h-1 w-full" aria-hidden="true">
        <div className="h-full bg-rose-500 transition-[width] duration-150" style={{ width: `${readingProgress}%` }} />
      </div>

      {/* En-tête visuel */}
      <header className="relative">
        <div className="relative h-[60vh] min-h-[420px] max-h-[720px] w-full overflow-hidden bg-gray-900">
          {cover ? (
            <img src={cover} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Barre d'actions sur l'image */}
          <div className="absolute inset-x-0 top-0">
            <div className="mx-auto flex w-full items-center justify-between px-5 py-5 sm:px-8 lg:px-12 xl:px-16">
              <button type="button" onClick={handleBack} className={iconButton} aria-label="Retour" title="Retour">
                <HiArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleShare} className={iconButton} aria-label="Partager" title="Partager">
                  <HiShare className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={handleBookmark}
                  title={bookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  className={bookmarked ? iconButtonActive : iconButton}
                  aria-label={bookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  aria-pressed={bookmarked}
                >
                  {bookmarked ? <HiBookmark className="h-5 w-5" /> : <HiOutlineBookmark className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Titre */}
          <div className="absolute inset-x-0 bottom-0">
            <div className="w-full px-5 pb-12 sm:px-8 sm:pb-16 lg:px-12 xl:px-16">
              <Link
                to="/articles"
                className="inline-block min-h-0 min-w-0 rounded-full bg-rose-500 px-3.5 py-1 text-xs font-semibold text-white shadow-lg shadow-rose-500/30 transition-colors hover:bg-rose-600"
              >
                {getCategoryLabel(article.category)}
              </Link>
              <h1 className="mt-4 max-w-5xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {article.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/75">
                <time dateTime={published}>{formatDate(published)}</time>
                <span aria-hidden="true">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <HiClock className="h-4 w-4" aria-hidden="true" />
                  {formatNumber(getReadingTime(article.content))} 𞤣𞤢𞤳𞤭𞤳𞤢
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton j'aime flottant, à cheval sur l'image */}
        <div className="relative w-full px-5 sm:px-8 lg:px-12 xl:px-16">
          <button
            type="button"
            onClick={handleLike}
            aria-label={liked ? 'Je n\'aime plus' : 'J\'aime'}
            aria-pressed={liked}
            className={`absolute -top-7 right-5 flex sm:right-8 lg:right-12 xl:right-16 h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-300 ${
              liked ? 'bg-rose-500 shadow-rose-500/40' : 'bg-gray-900 shadow-black/30'
            }`}
          >
            {liked ? <HiHeart className="h-6 w-6" /> : <HiOutlineHeart className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile/tablette : une colonne. Ordinateur : article + barre latérale collante */}
      <div className="w-full px-5 pb-20 sm:px-8 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14 lg:px-12 xl:px-16">
        <main className="mx-auto w-full min-w-0 max-w-3xl lg:mx-0 lg:max-w-none">
          {/* Auteur et statistiques */}
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-5 pr-16 lg:pr-0">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-black text-sm font-bold text-white">
                {getInitial(authorName)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{authorName}</p>
                <p className="text-xs text-gray-500">{formatDate(published)}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <HiHeart className={`h-5 w-5 ${liked ? 'text-rose-500' : 'text-gray-300'}`} aria-hidden="true" />
                {formatNumber(likesCount)}
              </span>
              <a href="#comments" className="inline-flex min-h-0 min-w-0 items-center gap-1.5 transition-colors hover:text-gray-900">
                <HiChat className="h-5 w-5 text-gray-300" aria-hidden="true" />
                {formatNumber(commentsCount)}
              </a>
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                <HiEye className="h-5 w-5 text-gray-300" aria-hidden="true" />
                {formatNumber(article.views)}
              </span>
            </div>
          </div>

          {/* Chapeau */}
          {article.excerpt && (
            <p className="mt-8 text-xl leading-relaxed text-gray-600 lg:text-2xl lg:leading-relaxed">{article.excerpt}</p>
          )}

          {/* Corps de l'article : direction déduite du contenu (Adlam RTL, français LTR) */}
          <article className="article-body mt-8" dir="auto" dangerouslySetInnerHTML={{ __html: article.content }} />

          {/* Mots-clés */}
          {article.tags?.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">#{tag}</span>
              ))}
            </div>
          )}

          {/* Carte auteur : ici sur mobile/tablette, dans la barre latérale sur ordinateur */}
          <div className="mt-12 lg:hidden">{authorCard}</div>

          <ArticleComments articleId={article._id} onCountChange={setCommentsCount} />
        </main>

        <aside className="mx-auto mt-14 w-full max-w-3xl lg:mx-0 lg:mt-0 lg:pt-8">
          <div className="space-y-10 lg:sticky lg:top-8">
            <div className="hidden lg:block">{authorCard}</div>

            {/* Articles similaires */}
            {related.length > 0 && (
              <section>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">𞤃𞤢𞤦𞤢𞤤𞤫</h2>
                <ul className="divide-y divide-gray-100">
                  {related.map(item => (
                    <li key={item._id}>
                      <Link to={`/articles/${item.slug}`} className="group flex items-center gap-4 py-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 lg:h-16 lg:w-16">
                          {getImageUrl(item.coverImage) ? (
                            <img
                              src={getImageUrl(item.coverImage)}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <HiNewspaper className="h-7 w-7 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold leading-snug text-gray-900 line-clamp-2 transition-colors group-hover:text-rose-600 lg:text-sm">
                            {item.title}
                          </p>
                          {/* Segments isolés : l'Adlam (RTL) n'inverse pas l'ordre de la date */}
                          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                            <span>{getCategoryLabel(item.category)}</span>
                            <span aria-hidden="true">·</span>
                            <time dateTime={item.publishedAt || item.createdAt}>{formatDate(item.publishedAt || item.createdAt)}</time>
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </aside>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg auth-enter">
          {toast}
        </div>
      )}

      {/* Retour en haut */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Retour en haut"
        className={`fixed bottom-6 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-lg transition-all duration-300 hover:bg-gray-800 ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <HiArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ArticleDetail;
