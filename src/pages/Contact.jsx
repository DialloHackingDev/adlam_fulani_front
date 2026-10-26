import { useState } from 'react';
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiPaperAirplane,
  HiClock,
  HiChat,
  HiSupport,
  HiGlobeAlt,
  HiCheckCircle,
  HiExclamationCircle,
  HiShieldCheck
} from 'react-icons/hi';
import FulaniInput from '../components/FulaniInput';
import FulaniTextarea from '../components/FulaniTextarea';
import { apiService } from '../services/apiService';
import { SITE_CONTACT, phoneHref } from '../utils/siteInfo';

// Coordonnées : à tenir à jour dans utils/siteInfo.js (partagées avec le pied de page)
const CONTACT_DETAILS = [
  { icon: HiMail, label: '𞤉𞤢𞤤𞤢 𞤉𞤤𞤫𞤳𞤼𞤮𞤪𞤮𞤲𞤭𞤳', value: SITE_CONTACT.email, href: `mailto:${SITE_CONTACT.email}`, ltr: true },
  { icon: HiPhone, label: '𞤚𞤫𞤤𞤫𞤬𞤮𞤲', value: SITE_CONTACT.phone, href: phoneHref(SITE_CONTACT.phone), ltr: true },
  { icon: HiLocationMarker, label: '𞤀𞤣𞤢𞤪𞤫𞤧', value: SITE_CONTACT.address }
];

const OPENING_HOURS = [
  { days: '𞤀𞤢𞤸𞤢 - 𞤀𞤭𞤲𞤭𞤄𞤲', hours: '8:00 - 18:00' },
  { days: '𞤅𞤢𞤦𞤭𞤄𞤲 - 𞤀𞤤𞤢𞤸𞤢𞤣', hours: '9:00 - 17:00' },
  { days: '𞤀𞤤𞤢𞤸𞤢𞤣', hours: '𞤔𞤮𞤬𞤭𞤲𞤣𞤫' }
];

// Sujets proposés en un clic (remplissent le champ « sujet »)
const TOPICS = [
  { icon: HiChat, title: '𞤃𞤢𞤦𞤢𞤤𞤫 𞤫 𞤃𞤫𞤧𞤫' },
  { icon: HiSupport, title: '𞤚𞤫𞤳𞤲𞤭𞤳 𞤖𞤢𞤤𞤢𞤲𞤣𞤫' },
  { icon: HiGlobeAlt, title: '𞤅𞤢𞤪𞤣𞤭𞤲𞤢𞤤 𞤫 𞤀𞤣𞤤𞤢𞤥' },
  { icon: HiCheckCircle, title: '𞤔𞤢𞤦𞤢𞤪𞤢𞤲 𞤫 𞤀𞤪𞤣𞤭𞤲' }
];

const MAX_MESSAGE = 5000;
const MIN_MESSAGE = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENDER_KEY = 'contactSender';

const readSender = () => {
  try {
    return JSON.parse(localStorage.getItem(SENDER_KEY)) || {};
  } catch {
    return {};
  }
};

const validate = ({ name, email, message }) => ({
  name: name.trim().length < 2 ? 'Indiquez votre nom (2 caractères minimum)' : null,
  email: !EMAIL_PATTERN.test(email.trim()) ? 'Adresse email invalide' : null,
  message: message.trim().length < MIN_MESSAGE ? `Votre message doit contenir au moins ${MIN_MESSAGE} caractères` : null
});

const getErrorMessage = (error) => {
  if (error.response?.status === 429) {
    return 'Vous avez envoyé plusieurs messages récemment. Réessayez dans une heure.';
  }
  if (!error.response) {
    return 'Envoi impossible : vérifiez votre connexion internet puis réessayez.';
  }
  return error.response.data?.message || 'Envoi impossible pour le moment. Réessayez.';
};

const Field = ({ label, required, error, hint, htmlFor, children }) => (
  <div>
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-800">
        {label}
        {required && <span className="ml-1 text-gray-400" aria-hidden="true">*</span>}
      </label>
      {hint}
    </div>
    {children}
    {error && (
      <p id={`${htmlFor}-error`} className="mt-2 text-sm text-red-600" dir="auto">{error}</p>
    )}
  </div>
);

const Contact = () => {
  const saved = readSender();
  const [formData, setFormData] = useState({ name: saved.name || '', email: saved.email || '', subject: '', message: '' });
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const errors = validate(formData);
  const showError = (field) => (touched[field] ? errors[field] : null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'message' ? value.slice(0, MAX_MESSAGE) : value }));
    setError(null);
  };

  const handleBlur = (e) => setTouched(prev => ({ ...prev, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (Object.values(errors).some(Boolean)) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await apiService.contact.send({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });
      try {
        localStorage.setItem(SENDER_KEY, JSON.stringify({ name: formData.name.trim(), email: formData.email.trim() }));
      } catch {
        // Stockage indisponible : nom et email à ressaisir la prochaine fois
      }
      setSubmitted(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(prev => ({ ...prev, subject: '', message: '' }));
    setTouched({});
    setSubmitted(false);
  };

  const inputClass = (field) =>
    'block w-full rounded-xl border bg-gray-50/60 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all ' +
    'focus:bg-white focus:outline-none focus:ring-4 ' +
    (showError(field)
      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
      : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900/10');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <HiChat className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤀𞤥𞤫𞤲</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
            𞤀𞤥𞤫𞤲 𞤸𞤢𞤤𞤢 𞤫 𞤃𞤢𞤳 𞤫 𞤀𞤥𞤫𞤲 𞤸𞤢𞤤𞤢 𞤫 𞤃𞤢𞤳 𞤸𞤢𞤤 𞤸𞤢𞤤𞤢𞤲𞤣𞤫
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-8 grid max-w-6xl gap-6 px-5 pb-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Formulaire */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] sm:p-8">
          {submitted ? (
            <div className="py-10 text-center auth-enter" role="status">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
                <HiCheckCircle className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">𞤔𞤢𞤦𞤢𞤪𞤢𞤲!</h2>
              <p className="mx-auto mt-3 max-w-md text-gray-600" dir="auto">
                Votre message a bien été envoyé. Nous vous répondrons à l'adresse {formData.email.trim()}.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-8 min-h-0 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:border-gray-900"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900">𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤔𞤮𞤲𞤲𞤣𞤭</h2>
              <p className="mt-1 text-sm text-gray-500">𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤃𞤢𞤳 𞤲𞤫𞤤𞤤𞤭 𞤫 𞤀𞤥𞤫𞤲 𞤸𞤢𞤤𞤢 𞤫 𞤃𞤢𞤳</p>

              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
                {error && (
                  <div role="alert" className="auth-shake flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    <HiExclamationCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
                    <span dir="auto">{error}</span>
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="𞤀𞤪𞤣𞤫" required htmlFor="contact-name" error={showError('name')}>
                    <FulaniInput
                      id="contact-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(showError('name'))}
                      maxLength={100}
                      className={inputClass('name')}
                      placeholder="𞤀𞤪𞤣𞤫 𞤃𞤢𞤳..."
                    />
                  </Field>
                  <Field label="𞤉𞤢𞤤𞤢 𞤉𞤤𞤫𞤳𞤼𞤮𞤪𞤮𞤲𞤭𞤳" required htmlFor="contact-email" error={showError('email')}>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      inputMode="email"
                      autoComplete="email"
                      dir="ltr"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(showError('email'))}
                      maxLength={200}
                      className={inputClass('email')}
                      placeholder="email@example.com"
                    />
                  </Field>
                </div>

                <Field label="𞤃𞤮𞤶𞤮𞤤" htmlFor="contact-subject">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {TOPICS.map(topic => {
                      const active = formData.subject === topic.title;
                      return (
                        <button
                          key={topic.title}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, subject: active ? '' : topic.title }))}
                          aria-pressed={active}
                          className={`inline-flex min-h-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                            active ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-900'
                          }`}
                        >
                          <topic.icon className="h-4 w-4" aria-hidden="true" />
                          {topic.title}
                        </button>
                      );
                    })}
                  </div>
                  <FulaniInput
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    maxLength={200}
                    className={inputClass('subject')}
                    placeholder="𞤃𞤮𞤶𞤮𞤤 𞤖𞤢𞤤𞤢𞤲𞤣𞤫..."
                  />
                </Field>

                <Field
                  label="𞤖𞤢𞤤𞤢𞤲𞤣𞤫"
                  required
                  htmlFor="contact-message"
                  error={showError('message')}
                  hint={
                    <span className={`text-xs tabular-nums ${formData.message.length > MAX_MESSAGE * 0.9 ? 'text-amber-600' : 'text-gray-400'}`}>
                      {formData.message.length} / {MAX_MESSAGE}
                    </span>
                  }
                >
                  <FulaniTextarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(showError('message'))}
                    rows={7}
                    className={`${inputClass('message')} resize-y`}
                    placeholder="𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤃𞤢𞤳..."
                  />
                </Field>

                <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-2 text-xs text-gray-500" dir="auto">
                    <HiShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Votre adresse email n'est jamais publiée ni partagée.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-0 items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 font-medium text-white shadow-lg shadow-black/10 transition-all hover:bg-gray-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {isSubmitting ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                    ) : (
                      <HiPaperAirplane className="h-5 w-5 rotate-90" aria-hidden="true" />
                    )}
                    𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤲𞤫𞤤𞤤𞤭
                  </button>
                </div>
              </form>
            </>
          )}
        </section>

        {/* Coordonnées */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <ul className="space-y-5">
              {CONTACT_DETAILS.map(item => (
                <li key={item.label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                    <item.icon className="h-5 w-5 text-gray-900" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} dir={item.ltr ? 'ltr' : undefined} className="min-h-0 break-words font-medium text-gray-900 hover:underline">
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-medium text-gray-900">{item.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-black p-6 text-white">
            <h3 className="flex items-center gap-2 font-semibold">
              <HiClock className="h-5 w-5" aria-hidden="true" />
              𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤚𞤢𞤥𞤭𞤪
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              {OPENING_HOURS.map(row => (
                <div key={row.days} className="flex items-center justify-between gap-4">
                  <dt className="text-white/60">{row.days}</dt>
                  <dd className="font-medium tabular-nums">{row.hours}</dd>
                </div>
              ))}
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Contact;
