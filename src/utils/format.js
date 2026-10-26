// Formatage partagé : dates, prix et libellés en peul (écriture Adlam)
// Repli sur le français si le navigateur ne connaît pas le peul en Adlam
// (sinon il retombe silencieusement sur l'anglais)
const LOCALE = Intl.DateTimeFormat.supportedLocalesOf(['ff-Adlm-GN']).length ? 'ff-Adlm-GN' : 'fr-GN';

export const CATEGORY_LABELS = {
  litterature: '𞤀𞤣𞤢𞤦𞤢𞤲',
  histoire: '𞤚𞤢𞤪𞤭𞤲𞤢𞤤',
  education: '𞤔𞤢𞤲𞤺𞤢𞤤',
  culture: '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤',
  science: '𞤅𞤢𞤲𞤣𞤢𞤲𞤣𞤭',
  religion: '𞤄𞤭𞤲𞤢𞤤',
  enfants: '𞤃𞤮𞤣𞤫 𞤄𞤫'
};

export const LANGUAGE_LABELS = {
  pular: '𞤊𞤵𞤤𞤢𞤪',
  french: '𞤊𞤢𞤪𞤢𞤲𞤧𞤭',
  english: '𞤋𞤲𞤺𞤭𞤤𞤭𞤧',
  arabic: '𞤀𞤪𞤢𞤦𞤭'
};

export const FREE_LABEL = '𞤀𞤦𞤫𞤧𞤫';

export const getCategoryLabel = (category) => CATEGORY_LABELS[category] || category;

export const getLanguageLabel = (language) => LANGUAGE_LABELS[language] || language;

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString(LOCALE, { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatNumber = (value) => new Intl.NumberFormat(LOCALE).format(value || 0);

export const formatPrice = (price, currency = 'GNF') => {
  if (!price) return FREE_LABEL;
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'GNF' ? 0 : 2
  }).format(price);
};
