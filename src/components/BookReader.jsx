import { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';
import {
  HiArrowLeft,
  HiDownload,
  HiZoomIn,
  HiZoomOut,
  HiArrowsExpand,
  HiChevronLeft,
  HiChevronRight,
  HiViewList,
  HiBookOpen
} from 'react-icons/hi';
import { formatNumber } from '../utils/format';

// Worker servi par l'application (plus de dépendance à un CDN externe)
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

// Ambiances de lecture façon liseuse
const THEMES = {
  paper: { label: 'Papier', bg: '#f4ecd8', ink: '#5b4a33', page: { mixBlendMode: 'multiply' } },
  white: { label: 'Blanc', bg: '#fbfbf9', ink: '#4b5563', page: {} },
  night: { label: 'Nuit', bg: '#121212', ink: '#9ca3af', page: { filter: 'invert(0.88) hue-rotate(180deg)' } }
};

const MODES = {
  scroll: { label: 'Défilement continu', icon: HiViewList },
  paged: { label: 'Page par page', icon: HiBookOpen }
};

const ZOOM_STEPS = [1, 1.25, 1.5, 2];
// Sur grand écran, largeur de page plafonnée pour garder des lignes lisibles
const MAX_PAGE_WIDTH = 1000;
const PAGE_GAP = 16;

const readSettings = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const saveSettings = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Stockage indisponible : le réglage ne sera simplement pas retenu
  }
};

/**
 * Une page du PDF, dessinée seulement quand elle approche de l'écran
 * (et effacée quand elle s'en éloigne, pour ménager la mémoire des téléphones).
 */
const PdfPage = ({ doc, number, width, ratio, pageStyle, eager = false }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(eager);
  // Proportions réelles de cette page (la première sert d'estimation avant le rendu)
  const [pageRatio, setPageRatio] = useState(ratio);

  useEffect(() => {
    // Page affichée seule : toujours dessinée (visible vaut déjà true)
    if (eager) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '150% 0px' }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!visible || !width) {
      // Hors de vue : libérer la mémoire du dessin
      canvas.width = 0;
      canvas.height = 0;
      return undefined;
    }

    let cancelled = false;
    let task;
    (async () => {
      const page = await doc.getPage(number);
      if (cancelled) return;
      const base = page.getViewport({ scale: 1 });
      setPageRatio(base.height / base.width);

      const viewport = page.getViewport({ scale: width / base.width });
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);

      task = page.render({
        canvasContext: canvas.getContext('2d'),
        viewport,
        transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined
      });
      try {
        await task.promise;
      } catch {
        // Rendu annulé (page quittée ou taille changée)
      }
    })();

    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [doc, number, width, visible]);

  return (
    <div
      ref={containerRef}
      data-page={number}
      className="relative mx-auto bg-white shadow-[0_2px_24px_rgba(0,0,0,0.08)]"
      style={{ width, height: Math.round(width * pageRatio), ...pageStyle }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};

/**
 * Lecteur PDF façon liseuse, en défilement continu ou page par page.
 * `loadPdf(onProgress)` doit renvoyer un ArrayBuffer du fichier.
 */
const BookReader = ({ bookId, title, author, loadPdf, onBack, onDownload }) => {
  const positionKey = `reader:${bookId}`;
  const [doc, setDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(() => readSettings(positionKey, 1));
  const [theme, setTheme] = useState(() => readSettings('reader:theme', 'paper'));
  const [mode, setMode] = useState(() => readSettings('reader:mode', 'scroll'));
  const [zoomIndex, setZoomIndex] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [stageWidth, setStageWidth] = useState(0);
  const [ratio, setRatio] = useState(1.414);

  const stageRef = useRef(null);
  const touchStartRef = useRef(null);
  const scrollSyncRef = useRef(false);

  const palette = THEMES[theme] || THEMES.paper;
  const zoom = ZOOM_STEPS[zoomIndex];
  // Pleine largeur sur téléphone et tablette, plafonnée sur ordinateur ; le zoom va au-delà
  const pageWidth = stageWidth ? Math.floor(Math.min(stageWidth, MAX_PAGE_WIDTH) * zoom) : 0;

  // Chargement du document
  useEffect(() => {
    let cancelled = false;
    let loadingTask;

    (async () => {
      try {
        const data = await loadPdf((value) => !cancelled && setLoadProgress(value));
        // isEvalSupported: false neutralise l'exécution de code via des polices piégées (CVE-2024-4367)
        loadingTask = pdfjsLib.getDocument({ data, isEvalSupported: false });
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        const first = (await pdf.getPage(1)).getViewport({ scale: 1 });
        setRatio(first.height / first.width);
        setDoc(pdf);
        setNumPages(pdf.numPages);
        setPage(p => Math.min(Math.max(1, p), pdf.numPages));
      } catch (err) {
        if (!cancelled) setError(err);
      }
    })();

    return () => {
      cancelled = true;
      loadingTask?.destroy();
    };
  }, [loadPdf]);

  // Largeur disponible (les marges latérales disparaissent sur petit écran)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const observer = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width));
    observer.observe(stage);
    return () => observer.disconnect();
  }, [doc]);

  // Réglages mémorisés
  useEffect(() => { if (numPages) saveSettings(positionKey, page); }, [page, numPages, positionKey]);
  // Nombre de pages retenu pour afficher la progression dans la bibliothèque
  useEffect(() => { if (numPages) saveSettings(`${positionKey}:total`, numPages); }, [numPages, positionKey]);
  useEffect(() => { saveSettings('reader:theme', theme); }, [theme]);
  useEffect(() => { saveSettings('reader:mode', mode); }, [mode]);

  const scrollToPage = useCallback((target, behavior = 'auto') => {
    const element = stageRef.current?.querySelector(`[data-page="${target}"]`);
    if (!element) return;
    scrollSyncRef.current = true;
    stageRef.current.scrollTo({ top: element.offsetTop - PAGE_GAP, behavior });
    setTimeout(() => { scrollSyncRef.current = false; }, behavior === 'smooth' ? 600 : 50);
  }, []);

  // Défilement continu : se placer sur la page mémorisée à l'ouverture et au changement de mode/zoom
  useEffect(() => {
    if (mode === 'scroll' && doc && pageWidth) {
      requestAnimationFrame(() => scrollToPage(page));
    }
    // La page courante n'est volontairement pas une dépendance : seul le contexte d'affichage compte
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, doc, pageWidth, scrollToPage]);

  // Défilement continu : la page courante suit la position de lecture
  const handleScroll = () => {
    if (mode !== 'scroll' || scrollSyncRef.current) return;
    const stage = stageRef.current;
    const marker = stage.scrollTop + stage.clientHeight * 0.35;
    const pages = stage.querySelectorAll('[data-page]');
    let current = 1;
    for (const element of pages) {
      if (element.offsetTop <= marker) current = Number(element.dataset.page);
      else break;
    }
    setPage(current);
  };

  const goTo = useCallback((target) => {
    const nextPage = Math.min(Math.max(1, target), numPages || 1);
    setPage(nextPage);
    if (mode === 'scroll') scrollToPage(nextPage, 'smooth');
    else stageRef.current?.scrollTo({ top: 0 });
  }, [mode, numPages, scrollToPage]);

  const next = useCallback(() => goTo(page + 1), [goTo, page]);
  const prev = useCallback(() => goTo(page - 1), [goTo, page]);

  // Clavier : flèches, espace, Page précédente/suivante
  useEffect(() => {
    const onKey = (e) => {
      if (['ArrowRight', 'PageDown'].includes(e.key) || (e.key === ' ' && mode === 'paged')) { e.preventDefault(); next(); }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
      if (e.key === 'Escape') setChromeVisible(v => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, mode]);

  // Tap : page par page = bords pour tourner, centre pour les barres ; défilement = barres seulement
  const handleStageClick = (e) => {
    if (mode === 'paged' && zoomIndex === 0) {
      const { left, width } = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      if (x < 0.3) return prev();
      if (x > 0.7) return next();
    }
    setChromeVisible(v => !v);
  };

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  // Glisser horizontalement pour tourner la page (mode page par page)
  const handleTouchEnd = (e) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || mode !== 'paged' || zoomIndex > 0) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      e.preventDefault();
      if (dx < 0) next(); else prev();
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
  };

  const percent = numPages ? Math.round((page / numPages) * 100) : 0;
  const chromeClass = `transition-all duration-300 ${chromeVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`;
  const toolButton =
    'flex h-10 w-10 min-h-0 min-w-0 items-center justify-center rounded-full transition-colors hover:bg-black/5 ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-current disabled:opacity-30';
  const OtherModeIcon = MODES[mode === 'scroll' ? 'paged' : 'scroll'].icon;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6" style={{ background: palette.bg, color: palette.ink }}>
        <div className="max-w-sm text-center">
          <p className="mb-6" dir="auto">{error.userMessage || 'Impossible d\'ouvrir ce livre.'}</p>
          <button type="button" onClick={onBack} className="min-h-0 rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white">
            <HiArrowLeft className="mr-2 inline h-4 w-4" />
            𞤪𞤵𞤼𞤢𞤲
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex flex-col select-none transition-colors duration-300"
      style={{ background: palette.bg, color: palette.ink }}
    >
      {/* Barre du haut */}
      <header className={`relative z-20 flex items-center gap-1 px-2 py-2 sm:gap-2 sm:px-5 ${chromeClass}`}>
        <button type="button" onClick={onBack} className={toolButton} aria-label="Retour à la bibliothèque">
          <HiArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-semibold">{title}</p>
          {author && <p className="truncate text-xs opacity-70">{author}</p>}
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setMode(m => (m === 'scroll' ? 'paged' : 'scroll'))}
            className={toolButton}
            aria-label={`Passer en mode ${MODES[mode === 'scroll' ? 'paged' : 'scroll'].label.toLowerCase()}`}
            title={MODES[mode === 'scroll' ? 'paged' : 'scroll'].label}
          >
            <OtherModeIcon className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => setZoomIndex(z => Math.max(0, z - 1))} disabled={zoomIndex === 0} className={toolButton} aria-label="Dézoomer">
            <HiZoomOut className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => setZoomIndex(z => Math.min(ZOOM_STEPS.length - 1, z + 1))} disabled={zoomIndex === ZOOM_STEPS.length - 1} className={toolButton} aria-label="Zoomer">
            <HiZoomIn className="h-5 w-5" />
          </button>
          <button type="button" onClick={toggleFullscreen} className={`${toolButton} hidden sm:flex`} aria-label="Plein écran">
            <HiArrowsExpand className="h-5 w-5" />
          </button>
          {onDownload && (
            <button type="button" onClick={onDownload} className={toolButton} aria-label="Télécharger">
              <HiDownload className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>

      {/* Zone de lecture */}
      <main
        ref={stageRef}
        onClick={handleStageClick}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative flex-1 overflow-auto overscroll-contain lg:px-6"
        aria-label={`Page ${page} sur ${numPages}`}
      >
        {!doc ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <div className="h-1 w-48 overflow-hidden rounded-full bg-black/10">
              <div className="h-full rounded-full bg-current transition-[width] duration-200" style={{ width: `${Math.round(loadProgress * 100)}%` }} />
            </div>
            <p className="text-sm opacity-70">{formatNumber(Math.round(loadProgress * 100))} %</p>
          </div>
        ) : mode === 'scroll' ? (
          <div className="flex flex-col items-center py-4" style={{ gap: PAGE_GAP, minWidth: pageWidth }}>
            {Array.from({ length: numPages }, (_, i) => (
              <PdfPage
                key={i + 1}
                doc={doc}
                number={i + 1}
                width={pageWidth}
                ratio={ratio}
                pageStyle={palette.page}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-full items-start justify-center py-4" style={{ minWidth: pageWidth }}>
            <PdfPage
              key={`paged-${page}`}
              doc={doc}
              number={page}
              width={pageWidth}
              ratio={ratio}
              pageStyle={palette.page}
              eager
            />
          </div>
        )}

        {/* Flèches discrètes sur grand écran (page par page) */}
        {doc && mode === 'paged' && zoomIndex === 0 && (
          <>
            <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} disabled={page <= 1} aria-label="Page précédente"
              className={`fixed left-3 top-1/2 hidden -translate-y-1/2 md:flex ${toolButton} ${chromeClass}`}>
              <HiChevronLeft className="h-6 w-6" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} disabled={page >= numPages} aria-label="Page suivante"
              className={`fixed right-3 top-1/2 hidden -translate-y-1/2 md:flex ${toolButton} ${chromeClass}`}>
              <HiChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </main>

      {/* Bas de page : toujours visible, comme une liseuse */}
      <footer className="relative z-20 px-4 pb-3 pt-2 sm:px-6">
        <div className={`mb-3 flex items-center justify-center gap-2 ${chromeClass}`}>
          {Object.entries(THEMES).map(([key, t]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTheme(key)}
              aria-pressed={theme === key}
              aria-label={`Ambiance ${t.label}`}
              title={t.label}
              className={`h-7 w-7 min-h-0 min-w-0 rounded-full border transition-transform ${theme === key ? 'scale-110 ring-2 ring-current ring-offset-2' : 'border-black/15'}`}
              style={{ background: t.bg, '--tw-ring-offset-color': palette.bg }}
            />
          ))}
        </div>

        {numPages > 1 && (
          <input
            type="range"
            min={1}
            max={numPages}
            value={page}
            onChange={(e) => goTo(Number(e.target.value))}
            aria-label="Aller à la page"
            className={`mb-2 block h-1 w-full min-h-0 cursor-pointer ${chromeClass}`}
            style={{ accentColor: palette.ink }}
          />
        )}

        <div className="flex items-center justify-between text-xs tabular-nums opacity-70">
          <span>{numPages ? `${formatNumber(page)} / ${formatNumber(numPages)}` : ''}</span>
          <span>{numPages ? `${formatNumber(percent)} %` : ''}</span>
        </div>
      </footer>
    </div>
  );
};

export default BookReader;
