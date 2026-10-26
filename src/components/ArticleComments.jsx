import { useState, useEffect, useCallback } from 'react';
import { HiChat, HiHeart, HiOutlineHeart, HiReply, HiFlag, HiCheck } from 'react-icons/hi';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatNumber } from '../utils/format';

const PAGE_SIZE = 10;
const MAX_LENGTH = 1000;
const AUTHOR_KEY = 'commentAuthor';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SORTS = [
  { value: 'newest', label: '𞤀𞤤𞤣𞤭𞤥 𞤴𞤫𞤱𞤮𞥄𞤲' },
  { value: 'popular', label: '𞤀𞤤𞤣𞤭𞤥 𞤆𞤫𞥄𞤪𞤭𞥄𞤲' },
  { value: 'oldest', label: '𞤀𞤤𞤣𞤭𞤥 𞤳𞤵𞤣𞤭𞤥' }
];

const AVATAR_COLORS = ['bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-sky-500', 'bg-violet-500', 'bg-gray-800'];

// Nom et email du visiteur, mémorisés dans son navigateur pour les commentaires suivants
const readSavedAuthor = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTHOR_KEY)) || { name: '', email: '' };
  } catch {
    return { name: '', email: '' };
  }
};

const getAuthorName = (comment) => comment.author?.name || comment.authorName || '𞤃𞤢𞤶𞤭𞤥𞤭𞥄𞤲';

const Avatar = ({ name, size = 'h-10 w-10 text-sm' }) => {
  const color = AVATAR_COLORS[[...name].reduce((sum, ch) => sum + ch.codePointAt(0), 0) % AVATAR_COLORS.length];
  return (
    <div className={`${size} ${color} flex shrink-0 items-center justify-center rounded-full font-bold text-white`}>
      {name.trim().charAt(0).toUpperCase()}
    </div>
  );
};

const timeAgo = (date) => {
  const minutes = Math.floor((Date.now() - new Date(date)) / 60000);
  if (minutes < 1) return '𞤸𞤢𞤤𞤭𞤲𞤣𞤫';
  if (minutes < 60) return `𞤭𞤤𞤭 ${formatNumber(minutes)} 𞤣𞤢𞤳𞤭𞤳𞤢`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `𞤭𞤤𞤭 ${formatNumber(hours)} 𞤧𞤢𞥄𞤢𞥄`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `𞤭𞤤𞤭 ${formatNumber(days)} 𞤴𞤮𞤪𞤭`;
  return formatDate(date);
};

const getErrorMessage = (error) => {
  if (error.response?.status === 429) {
    return 'Trop de commentaires envoyés. Réessayez dans quelques minutes.';
  }
  return error.response?.data?.message || 'Envoi impossible. Vérifiez votre connexion et réessayez.';
};

// Formulaire de commentaire ou de réponse
const CommentForm = ({ articleId, parentId = null, onPosted, onCancel, autoFocus = false }) => {
  const { user } = useAuth();
  const [author, setAuthor] = useState(readSavedAuthor);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const anonymous = !user;
  const trimmed = content.trim();
  const authorValid = !anonymous || (author.name.trim().length >= 2 && EMAIL_PATTERN.test(author.email));
  const canSubmit = trimmed.length >= 3 && authorValid && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError('');
    try {
      await apiService.comments.create({
        content: trimmed,
        articleId,
        parentCommentId: parentId,
        ...(anonymous && { authorName: author.name.trim(), authorEmail: author.email.trim() })
      });
      if (anonymous) {
        try {
          localStorage.setItem(AUTHOR_KEY, JSON.stringify(author));
        } catch {
          // Stockage indisponible : il faudra ressaisir le nom la prochaine fois
        }
      }
      setContent('');
      onPosted();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    'w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-gray-900 placeholder-gray-400 ' +
    'transition-all focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gray-900/10';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {anonymous && (
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={author.name}
            onChange={(e) => setAuthor(a => ({ ...a, name: e.target.value }))}
            placeholder="Nom"
            aria-label="Nom"
            autoComplete="name"
            maxLength={50}
            className={fieldClass}
          />
          <input
            type="email"
            dir="ltr"
            value={author.email}
            onChange={(e) => setAuthor(a => ({ ...a, email: e.target.value }))}
            placeholder="Email (jamais affiché)"
            aria-label="Email (jamais affiché)"
            autoComplete="email"
            maxLength={100}
            className={fieldClass}
          />
        </div>
      )}

      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value.slice(0, MAX_LENGTH)); setError(''); }}
          placeholder={parentId ? '𞤔𞤢𞤤𞤢𞤲𞤣𞤫 𞤪𞤭𞤥𞤢𞥄𞤣𞤭...' : '𞤔𞤢𞤤𞤢𞤲𞤣𞤫 𞤳𞤮𞤥𞤢𞤲𞤼𞤫𞤪𞤫 𞤥𞤢𞤲...'}
          aria-label={parentId ? 'Réponse' : 'Commentaire'}
          rows={parentId ? 2 : 3}
          autoFocus={autoFocus}
          className={`${fieldClass} resize-y pb-7`}
        />
        <span className="pointer-events-none absolute bottom-2 right-3 text-xs text-gray-400" aria-hidden="true">
          {formatNumber(content.length)} / {formatNumber(MAX_LENGTH)}
        </span>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700" dir="auto">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="min-h-0 rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            𞤁𞤫𞥄𞤤𞤢𞤭
          </button>
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex min-h-0 items-center gap-2 rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {submitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />}
          𞤐𞤵𞤦𞤭𞤪𞤫
        </button>
      </div>
    </form>
  );
};

const CommentItem = ({ comment, articleId, liked, onLike, onReplyPosted, isReply = false }) => {
  const [replying, setReplying] = useState(false);
  const [reported, setReported] = useState(false);
  const name = getAuthorName(comment);

  const handleReport = async () => {
    if (!window.confirm('Signaler ce commentaire comme inapproprié ?')) return;
    try {
      await apiService.comments.report(comment._id, {});
      setReported(true);
    } catch {
      // Signalement non enregistré : le bouton reste disponible
    }
  };

  const actionClass = 'inline-flex min-h-0 min-w-0 items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors';

  return (
    <div className="flex gap-3">
      <Avatar name={name} size={isReply ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold text-gray-900">{name}</span>
          <time dateTime={comment.createdAt} className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</time>
        </div>
        <p className="mt-1 whitespace-pre-line break-words leading-relaxed text-gray-700" dir="auto">
          {comment.content}
        </p>

        <div className="-ml-2.5 mt-2 flex flex-wrap items-center gap-1 text-sm text-gray-500">
          <button
            type="button"
            onClick={() => onLike(comment)}
            aria-pressed={liked}
            aria-label={liked ? 'Je n\'aime plus' : 'J\'aime'}
            className={`${actionClass} ${liked ? 'text-rose-600 hover:bg-rose-50' : 'hover:bg-gray-100 hover:text-gray-900'}`}
          >
            {liked ? <HiHeart className="h-4 w-4" /> : <HiOutlineHeart className="h-4 w-4" />}
            {comment.likes > 0 && <span>{formatNumber(comment.likes)}</span>}
          </button>
          {!isReply && (
            <button
              type="button"
              onClick={() => setReplying(r => !r)}
              className={`${actionClass} hover:bg-gray-100 hover:text-gray-900`}
            >
              <HiReply className="h-4 w-4" />
              𞤪𞤭𞤥𞤢𞥄𞤣𞤭
            </button>
          )}
          {reported ? (
            <span className={`${actionClass} text-gray-400`}>
              <HiCheck className="h-4 w-4" />
              𞤅𞤭𞤧𞤼𞤫𞤥 𞤲𞤣𞤫 𞤸𞤢𞤤𞤭 𞤧𞤭𞤲𞤢𞤤𞤭𞥄𞤲
            </span>
          ) : (
            <button
              type="button"
              onClick={handleReport}
              aria-label="Signaler"
              className={`${actionClass} hover:bg-gray-100 hover:text-red-600`}
            >
              <HiFlag className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">𞤔𞤭𞤲𞤢𞤤𞤭𞥄𞤲</span>
            </button>
          )}
        </div>

        {replying && (
          <div className="mt-3">
            <CommentForm
              articleId={articleId}
              parentId={comment._id}
              autoFocus
              onCancel={() => setReplying(false)}
              onPosted={() => { setReplying(false); onReplyPosted(); }}
            />
          </div>
        )}

        {comment.replies?.length > 0 && (
          <div className="mt-4 space-y-4 border-gray-100 ps-4" style={{ borderInlineStartWidth: 2 }}>
            {comment.replies.map(reply => (
              <CommentItem
                key={reply._id}
                comment={reply}
                articleId={articleId}
                liked={reply.__liked}
                onLike={onLike}
                onReplyPosted={onReplyPosted}
                isReply
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ArticleComments = ({ articleId, onCountChange }) => {
  const [comments, setComments] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [mainTotal, setMainTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const fetchComments = useCallback(async (targetPage = 1) => {
    const response = await apiService.comments.getByArticle(articleId, { sort, page: targetPage, limit: PAGE_SIZE });
    const { comments: list, userLikes } = response.data.data;
    const liked = Object.keys(userLikes || {}).map(key => key.replace('Comment_', ''));
    return { list, liked, stats: response.data.stats, total: response.data.pagination?.total || 0 };
  }, [articleId, sort]);

  // Recharge toutes les pages déjà affichées (après un envoi, pour garder la position)
  const reload = useCallback(async (pages = 1) => {
    try {
      setLoadError(false);
      const results = await Promise.all(Array.from({ length: pages }, (_, i) => fetchComments(i + 1)));
      setComments(results.flatMap(r => r.list));
      setLikedIds(new Set(results.flatMap(r => r.liked)));
      setMainTotal(results[0].total);
      onCountChange?.(results[0].stats?.totalComments || 0);
    } catch {
      setLoadError(true);
    }
  }, [fetchComments, onCountChange]);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    reload(1).finally(() => setLoading(false));
  }, [reload]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const { list, liked } = await fetchComments(next);
      setComments(c => [...c, ...list.filter(item => !c.some(existing => existing._id === item._id))]);
      setLikedIds(s => new Set([...s, ...liked]));
      setPage(next);
    } catch {
      setLoadError(true);
    } finally {
      setLoadingMore(false);
    }
  };

  // Mise à jour optimiste du like, corrigée par la réponse du serveur
  const updateLikes = (id, delta) => {
    const apply = (c) => (c._id === id ? { ...c, likes: Math.max(0, (c.likes || 0) + delta) } : c);
    setComments(list => list.map(c => ({ ...apply(c), replies: c.replies?.map(apply) })));
  };

  const handleLike = async (comment) => {
    const wasLiked = likedIds.has(comment._id);
    const toggle = (set, on) => {
      const next = new Set(set);
      if (on) next.add(comment._id); else next.delete(comment._id);
      return next;
    };
    setLikedIds(s => toggle(s, !wasLiked));
    updateLikes(comment._id, wasLiked ? -1 : 1);
    try {
      const res = await apiService.comments.like(comment._id);
      const { liked, totalLikes } = res.data.data;
      setLikedIds(s => toggle(s, liked));
      const apply = (c) => (c._id === comment._id ? { ...c, likes: totalLikes } : c);
      setComments(list => list.map(c => ({ ...apply(c), replies: c.replies?.map(apply) })));
    } catch {
      setLikedIds(s => toggle(s, wasLiked));
      updateLikes(comment._id, wasLiked ? 1 : -1);
    }
  };

  const withLikeState = comments.map(c => ({
    ...c,
    replies: c.replies?.map(r => ({ ...r, __liked: likedIds.has(r._id) }))
  }));

  return (
    <section id="comments" className="mt-14 scroll-mt-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <HiChat className="h-6 w-6 text-gray-400" aria-hidden="true" />
          𞤑𞤮𞤥𞤢𞤲𞤼𞤫𞤪𞤫
        </h2>
        {comments.length > 1 && (
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Trier les commentaires"
            className="min-h-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-gray-900 focus:outline-none"
          >
            {SORTS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        )}
      </div>

      <div className="rounded-2xl border border-gray-100 p-4 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.10)] sm:p-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">𞤀𞤬𞤭𞤲 𞤳𞤮𞤥𞤢𞤲𞤼𞤫𞤪𞤫</h3>
        <CommentForm articleId={articleId} onPosted={() => reload(page)} />
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="space-y-6" aria-hidden="true">
            {[0, 1].map(i => (
              <div key={i} className="flex gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : loadError && comments.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500" dir="auto">
            Impossible de charger les commentaires.{' '}
            <button type="button" onClick={() => reload(1)} className="min-h-0 font-medium text-gray-900 underline">
              Réessayer
            </button>
          </p>
        ) : comments.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 px-6 py-10 text-center">
            <HiChat className="mx-auto mb-3 h-10 w-10 text-gray-300" aria-hidden="true" />
            <p className="text-gray-500">𞤢𞤬𞤭𞤲 𞤳𞤮𞤥𞤢𞤲𞤼𞤫𞤪𞤫 𞤸𞤢𞤤 𞤸𞤫𞤧𞤮𞤲𞤣𞤫. 𞤔𞤵𞤲 𞤤𞤫𞥄𞤳𞤭𞤲𞤣𞤫 𞤢𞤬𞤭𞤲 𞤣𞤭𞤥𞤢𞥄𞤲!</p>
          </div>
        ) : (
          <div className="space-y-7">
            {withLikeState.map(comment => (
              <CommentItem
                key={comment._id}
                comment={comment}
                articleId={articleId}
                liked={likedIds.has(comment._id)}
                onLike={handleLike}
                onReplyPosted={() => reload(page)}
              />
            ))}
          </div>
        )}

        {!loading && comments.length < mainTotal && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="min-h-0 rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 disabled:opacity-50"
            >
              {loadingMore ? '…' : `+ ${formatNumber(mainTotal - comments.length)}`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticleComments;
