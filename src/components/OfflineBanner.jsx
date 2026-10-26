import { useEffect, useState } from 'react';
import { HiStatusOffline, HiStatusOnline } from 'react-icons/hi';

// Bandeau discret signalant la perte et le retour de la connexion
const OfflineBanner = () => {
  const [online, setOnline] = useState(() => navigator.onLine);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    let timer;
    const goOnline = () => {
      setOnline(true);
      setShowBackOnline(true);
      timer = setTimeout(() => setShowBackOnline(false), 3000);
    };
    const goOffline = () => {
      clearTimeout(timer);
      setShowBackOnline(false);
      setOnline(false);
    };
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (online && !showBackOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white shadow-lg auth-enter ${
        online ? 'bg-emerald-600' : 'bg-gray-900'
      }`}
    >
      {online ? <HiStatusOnline className="h-4 w-4" /> : <HiStatusOffline className="h-4 w-4" />}
      <span dir="auto">
        {online ? 'Connexion rétablie' : 'Hors connexion : contenu enregistré'}
      </span>
    </div>
  );
};

export default OfflineBanner;
