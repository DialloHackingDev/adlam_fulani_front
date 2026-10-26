// Informations publiques du site, partagées par le pied de page et la page Contact.
// Un réseau social sans URL n'est pas affiché : renseigner l'adresse de la page officielle.
export const SITE_NAME = 'Yelaare';

export const SITE_CONTACT = {
  email: 'contact@adlam-platform.com',
  phone: '+224 123 456 789',
  address: '𞤑𞤮𞤲𞤢𞤳𞤪𞤭, 𞤘𞤭𞤲𞤫'
};

export const SOCIAL_LINKS = [
  { name: 'Facebook', url: '' },
  { name: 'YouTube', url: '' },
  { name: 'WhatsApp', url: '' },
  { name: 'X', url: '' }
];

export const phoneHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;
