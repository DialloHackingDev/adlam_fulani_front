import { useEffect, useRef, useState } from 'react';
import { HiEye, HiEyeOff, HiLockClosed, HiMail, HiExclamationCircle, HiArrowRight } from 'react-icons/hi';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Au-delà, on prévient que le serveur (hébergement gratuit) est peut-être en train de démarrer
const SLOW_REQUEST_DELAY = 5000;

// Traduit une erreur d'API en message lisible
const getErrorMessage = (error) => {
  if (error.response?.status === 429) {
    return 'Trop de tentatives. Patientez quelques minutes avant de réessayer.';
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.code === 'ECONNABORTED' || !error.response) {
    return 'Le serveur ne répond pas. Vérifiez votre connexion internet puis réessayez.';
  }
  return 'Connexion impossible pour le moment. Réessayez.';
};

// Formulaire email + mot de passe partagé par la connexion utilisateur et admin
const LoginForm = ({ onSubmit, submitLabel, emailLabel, passwordLabel, emailPlaceholder, children }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState('');
  const [shakeKey, setShakeKey] = useState(0);

  const passwordRef = useRef(null);
  const slowTimer = useRef(null);

  useEffect(() => () => clearTimeout(slowTimer.current), []);

  const emailInvalid = emailTouched && email !== '' && !EMAIL_PATTERN.test(email);
  const canSubmit = EMAIL_PATTERN.test(email) && password.length > 0 && !submitting;

  const handleKeyEvent = (e) => {
    if (e.getModifierState) setCapsLock(e.getModifierState('CapsLock'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    if (!canSubmit) return;

    setSubmitting(true);
    setError('');
    slowTimer.current = setTimeout(() => setSlow(true), SLOW_REQUEST_DELAY);

    try {
      await onSubmit(email.trim(), password);
    } catch (err) {
      setError(getErrorMessage(err));
      setShakeKey(k => k + 1);
      // Garder l'email, resélectionner le mot de passe pour une nouvelle saisie rapide
      requestAnimationFrame(() => passwordRef.current?.select());
    } finally {
      clearTimeout(slowTimer.current);
      setSlow(false);
      setSubmitting(false);
    }
  };

  const inputBase =
    'block w-full rounded-xl border bg-gray-50/60 py-3.5 text-gray-900 placeholder-gray-400 ' +
    'transition-all duration-200 focus:bg-white focus:outline-none focus:ring-4 disabled:opacity-60';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && (
        <div
          key={shakeKey}
          role="alert"
          className="auth-shake flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <HiExclamationCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <span dir="auto">{error}</span>
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
          {emailLabel}
        </label>
        <div className="relative">
          <HiMail
            className={`pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors ${
              emailInvalid ? 'text-red-400' : 'text-gray-400'
            }`}
          />
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="username"
            autoFocus
            required
            dir="ltr"
            value={email}
            disabled={submitting}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            onBlur={() => setEmailTouched(true)}
            aria-invalid={emailInvalid}
            aria-describedby={emailInvalid ? 'email-error' : undefined}
            placeholder={emailPlaceholder}
            className={`${inputBase} pr-12 pl-4 text-left ${
              emailInvalid
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900/10'
            }`}
          />
        </div>
        {emailInvalid && (
          <p id="email-error" className="mt-2 text-sm text-red-600" dir="auto">
            Adresse email invalide
          </p>
        )}
      </div>

      {/* Mot de passe */}
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
          {passwordLabel}
        </label>
        <div className="relative">
          <HiLockClosed className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            ref={passwordRef}
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            dir="ltr"
            value={password}
            disabled={submitting}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            onKeyDown={handleKeyEvent}
            onKeyUp={handleKeyEvent}
            onBlur={() => setCapsLock(false)}
            placeholder="••••••••"
            className={`${inputBase} pr-12 pl-12 text-left border-gray-200 focus:border-gray-900 focus:ring-gray-900/10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            aria-pressed={showPassword}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
          >
            {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
          </button>
        </div>
        {capsLock && (
          <p className="mt-2 text-sm text-amber-600" dir="auto">
            Verrouillage majuscules activé
          </p>
        )}
      </div>

      {/* Envoi */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3.5 font-medium text-white shadow-lg shadow-black/10 transition-all duration-200 hover:bg-gray-800 hover:shadow-xl active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-900/20 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
      >
        {submitting ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
        ) : (
          <>
            <span>{submitLabel}</span>
            <HiArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </>
        )}
      </button>

      {slow && (
        <p className="text-center text-sm text-gray-500 auth-enter" dir="auto" aria-live="polite">
          Le serveur démarre, cela peut prendre jusqu'à une minute…
        </p>
      )}

      {children}
    </form>
  );
};

export default LoginForm;
