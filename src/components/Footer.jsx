import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker, HiArrowUp } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { CATEGORY_LABELS } from '../utils/format';
import { SITE_CONTACT, SOCIAL_LINKS, phoneHref } from '../utils/siteInfo';

// Uniquement des pages qui existent réellement
const NAVIGATION = [
  { name: '𞤄𞤢𞤤𞤤𞤢𞤤', path: '/' },
  { name: '𞤃𞤢𞤦𞤢𞤤𞤫', path: '/articles' },
  { name: '𞤃𞤫𞤧𞤫', path: '/ebooks' },
  { name: '𞤔𞤮𞤲𞤲𞤣𞤭', path: '/contact' }
];

const CATEGORIES = ['litterature', 'histoire', 'education', 'culture', 'science', 'religion'];

const linkClass = 'min-h-0 text-sm text-white/60 transition-colors hover:text-white';

const FooterColumn = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-semibold text-white">{title}</h3>
    <ul className="mt-4 space-y-3">{children}</ul>
  </div>
);

const Footer = () => {
  const { isAuthenticated } = useAuth();
  const socials = SOCIAL_LINKS.filter(s => s.url);

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-14 sm:px-8 lg:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12">
          {/* Marque */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block min-h-0 text-3xl font-bold tracking-tight">𞤀𞤣𞤤𞤢𞤥</Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              𞤃𞤢𞤪𞤸𞤢𞤤 𞤀𞤣𞤤𞤢𞤥 - 𞤅𞤢𞤭𞤼 𞤑𞤫𞤧𞤮 𞤫 𞤅𞤢𞤪𞤣𞤭𞤲𞤢𞤤 𞤫 𞤀𞤣𞤤𞤢𞤥 𞤫 𞤔𞤢𞤲𞤺𞤮𞤤 𞤊𞤵𞤤𞤢𞤪
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {socials.map(social => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-0 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white hover:text-white"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          <FooterColumn title="𞤃𞤢𞤪𞤸𞤢𞤤">
            {NAVIGATION.map(link => (
              <li key={link.path}><Link to={link.path} className={linkClass}>{link.name}</Link></li>
            ))}
            <li>
              <Link to={isAuthenticated ? '/my-library' : '/login'} className={linkClass}>𞤃𞤢 𞤄𞤭𞤦𞤤𞤭𞤮𞤼𞤫𞤳</Link>
            </li>
          </FooterColumn>

          <FooterColumn title="𞤊𞤮𞤪𞤲𞤣𞤫">
            {CATEGORIES.map(category => (
              <li key={category}>
                <Link to={`/articles?category=${category}`} className={linkClass}>{CATEGORY_LABELS[category]}</Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="𞤔𞤮𞤲𞤲𞤣𞤭">
            <li>
              <a href={`mailto:${SITE_CONTACT.email}`} className={`${linkClass} inline-flex items-center gap-2`} dir="ltr">
                <HiMail className="h-4 w-4 shrink-0" aria-hidden="true" />
                {SITE_CONTACT.email}
              </a>
            </li>
            <li>
              <a href={phoneHref(SITE_CONTACT.phone)} className={`${linkClass} inline-flex items-center gap-2`} dir="ltr">
                <HiPhone className="h-4 w-4 shrink-0" aria-hidden="true" />
                {SITE_CONTACT.phone}
              </a>
            </li>
            <li className="flex items-center gap-2 text-sm text-white/60">
              <HiLocationMarker className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{SITE_CONTACT.address}</span>
            </li>
            <li className="pt-2">
              <Link
                to="/contact"
                className="inline-flex min-h-0 items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
              >
                𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤲𞤫𞤤𞤤𞤭
              </Link>
            </li>
          </FooterColumn>
        </div>

        {/* Barre du bas */}
        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} 𞤃𞤢𞤪𞤸𞤢𞤤 𞤀𞤣𞤤𞤢𞤥. 𞤊𞤮𞤪𞤪𞤫 𞤸𞤢𞤳𞤫 𞤸𞤢𞤯𞤢𞤲𞤣𞤫.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex min-h-0 items-center gap-2 text-xs font-medium text-white/60 transition-colors hover:text-white"
            aria-label="Retour en haut de la page"
          >
            <HiArrowUp className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
