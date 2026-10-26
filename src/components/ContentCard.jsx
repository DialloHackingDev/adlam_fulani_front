import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiStar } from 'react-icons/hi';

// Carte commune aux articles et aux e-books.
// imageFit="contain" : l'image entière (couverture de livre) sur un fond flouté
// tiré d'elle-même, pour s'adapter à tous les formats sans recadrage.
const ContentCard = ({
  to,
  image,
  imageAlt,
  imageFit = 'cover',
  fallbackIcon: FallbackIcon,
  badge,
  featured = false,
  featuredLabel,
  title,
  subtitle,
  meta = [],
  footer
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = image && !imageFailed;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-xl">
      {/* Média */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {showImage ? (
          imageFit === 'contain' ? (
            <>
              <img
                src={image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-125 object-cover opacity-70 blur-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/25" />
              <img
                src={image}
                alt={imageAlt}
                loading="lazy"
                onError={() => setImageFailed(true)}
                className="relative mx-auto h-full w-auto max-w-[85%] object-contain py-5 drop-shadow-[0_12px_20px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-105"
              />
            </>
          ) : (
            <img
              src={image}
              alt={imageAlt}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            {FallbackIcon && <FallbackIcon className="h-14 w-14 text-gray-300" aria-hidden="true" />}
          </div>
        )}

        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-900 shadow-sm backdrop-blur">
            {badge}
          </span>
        )}
        {featured && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-semibold text-black shadow-sm">
            <HiStar className="h-3.5 w-3.5" aria-hidden="true" />
            {featuredLabel}
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug text-gray-900 line-clamp-2">
          {/* Le lien couvre toute la carte ; les boutons du pied restent cliquables (z-10) */}
          <Link to={to} className="after:absolute after:inset-0 focus:outline-none focus-visible:underline">
            {title}
          </Link>
        </h3>

        {subtitle && <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">{subtitle}</p>}

        {meta.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
            {meta.map(({ icon: Icon, label, className = '' }, i) => (
              <span key={i} className={`inline-flex items-center gap-1.5 ${className}`}>
                {Icon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                <span>{label}</span>
              </span>
            ))}
          </div>
        )}

        {footer && (
          // mt-auto : pied aligné en bas, quelle que soit la longueur du texte
          <div className="relative z-10 mt-auto pt-5">
            <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
              {footer}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default ContentCard;
