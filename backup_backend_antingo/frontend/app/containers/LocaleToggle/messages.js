/*
 * LocaleToggle Messages
 *
 * This contains all the text for the LanguageToggle component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.LocaleToggle';

export default defineMessages({
  en: {
    id: `${scope}.en`,
    defaultMessage: 'English',
  },
  pt: {
    id: `${scope}.pt`,
    defaultMessage: 'Português Brasil',
  },
  de: {
    id: `${scope}.de`,
    defaultMessage: 'Deutsch',
  },
  id: {
    id: `${scope}.id`,
    defaultMessage: 'Bahasa Indonesia',
  },
});
