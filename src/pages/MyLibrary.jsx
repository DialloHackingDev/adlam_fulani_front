import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiBookOpen, HiDownload, HiUser, HiExclamationCircle, HiShieldCheck } from 'react-icons/hi';
import { getImageUrl, apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { formatNumber, getCategoryLabel } from '../utils/format';
import ContentCard from '../components/ContentCard';

// Progression enregistrée par le lecteur (page atteinte et nombre de pages)
const readProgress = (id) => {
  try {
    const page = JSON.parse(localStorage.getItem(`reader:${id}`));
    const total = JSON.parse(localStorage.getItem(`reader:${id}:total`));
    if (!page || !total) return null;
    return { page, total, percent: Math.min(100, Math.round((page / total) * 100)) };
  } catch {
    return null;
  }
};

const MyLibrary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchLibrary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.checkout.getPurchasedEbooks();
      setEbooks(response.data.data?.ebooks || []);
    } catch (err) {
      // Ne pas faire passer une erreur pour une bibliothèque vide
      setError(!err.response
        ? 'Connexion impossible. Vérifiez votre réseau puis réessayez.'
        : 'Impossible de charger votre bibliothèque.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  const handleDownload = async (ebook) => {
    setDownloadingId(ebook._id);
    try {
      const response = await fetch(apiService.ebooks.stream(ebook._id), {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('download');
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = `${ebook.title || 'livre'}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Téléchargement impossible. Réessayez.');
    } finally {
      setDownloadingId(null);
    }
  };

  const isAdminView = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">𞤃𞤢 𞤄𞤭𞤦𞤤𞤭𞤮𞤼𞤫𞤳</h1>
            <p className="mt-2 text-gray-500">𞤃𞤫𞤧𞤫 𞤥𞤢𞤢 𞤧𞤢𞤴𞤢𞤲𞤢𞤲𞤺𞤫</p>
          </div>
          {!loading && !error && ebooks.length > 0 && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {formatNumber(ebooks.length)} 𞤃𞤫𞤧𞤫
            </span>
          )}
        </header>

        {isAdminView && !loading && !error && (
          <p className="mb-6 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600" dir="auto">
            <HiShieldCheck className="h-5 w-5 shrink-0 text-gray-900" aria-hidden="true" />
            Compte administrateur : vous avez accès à tous les e-books publiés.
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {[0, 1, 2].map(i => (
              <div key={i} className="overflow-hidden rounded-2xl border border-gray-100">
                <div className="aspect-[4/3] animate-pulse bg-gray-100" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mx-auto max-w-md py-16 text-center">
            <HiExclamationCircle className="mx-auto mb-4 h-12 w-12 text-gray-300" aria-hidden="true" />
            <p className="text-gray-700" dir="auto">{error}</p>
            <button
              type="button"
              onClick={fetchLibrary}
              className="mt-6 min-h-0 rounded-xl bg-black px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Réessayer
            </button>
          </div>
        ) : ebooks.length === 0 ? (
          <div className="mx-auto max-w-md py-16 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <HiBookOpen className="h-10 w-10 text-gray-400" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">𞤄𞤭𞤦𞤤𞤭𞤮𞤼𞤫𞤳 𞤥𞤢𞤢 𞤬𞤫𞤲𞤢𞤲</h2>
            <p className="mt-3 text-gray-500">
              𞤀 𞤸𞤢𞤤 𞤧𞤢𞤴𞤢𞤲 𞤃𞤫𞤧𞤮 𞤸𞤢𞤤𞤭. 𞤔𞤮𞤲𞤢𞤲 𞤦𞤵𞤼𞤭𞤳 𞤫𞤲𞤺𞤢𞤥 𞤫 𞤧𞤢𞤴𞤢𞤲 𞤃𞤫𞤧𞤮 𞤢𞤪𞤢𞤲𞤣𞤫.
            </p>
            <Link
              to="/ebooks"
              className="mt-8 inline-flex min-h-0 items-center gap-2 rounded-xl bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
            >
              <HiBookOpen className="h-5 w-5" aria-hidden="true" />
              𞤔𞤮𞤲𞤢𞤲 𞤄𞤵𞤼𞤭𞤳
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {ebooks.map(ebook => {
              const progress = readProgress(ebook._id);
              return (
                <ContentCard
                  key={ebook._id}
                  to={`/ebook-reader/${ebook._id}`}
                  image={getImageUrl(ebook.coverImage)}
                  imageAlt={ebook.title}
                  imageFit="contain"
                  fallbackIcon={HiBookOpen}
                  badge={getCategoryLabel(ebook.category)}
                  title={ebook.title}
                  meta={[{ icon: HiUser, label: ebook.author || '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤 𞤀𞤣𞤤𞤢𞤥' }]}
                  footer={
                    <div className="w-full">
                      {progress && (
                        <div className="mb-4">
                          <div className="mb-1.5 flex justify-between text-xs text-gray-500">
                            <span>{formatNumber(progress.page)} / {formatNumber(progress.total)}</span>
                            <span>{formatNumber(progress.percent)} %</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-gray-900" style={{ width: `${progress.percent}%` }} />
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/ebook-reader/${ebook._id}`)}
                          className="inline-flex flex-1 min-h-0 items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                        >
                          <HiBookOpen className="h-4 w-4" aria-hidden="true" />
                          {progress ? 'Reprendre' : '𞤔𞤢𞤲𞤢𞤲'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownload(ebook)}
                          disabled={downloadingId === ebook._id}
                          aria-label="Télécharger"
                          title="Télécharger"
                          className="inline-flex h-10 w-10 min-h-0 min-w-0 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition-colors hover:border-gray-900 disabled:opacity-50"
                        >
                          {downloadingId === ebook._id
                            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" aria-hidden="true" />
                            : <HiDownload className="h-4 w-4" aria-hidden="true" />}
                        </button>
                      </div>
                    </div>
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLibrary;
