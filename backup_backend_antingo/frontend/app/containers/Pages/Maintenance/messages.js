/*
 * Blank Page Messages
 *
 * This contains all the text for the Maintenance.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.Maintenance';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Em manutenção',
  },
  paperTitle: {
    id: `${scope}.subtitle`,
    defaultMessage: 'Nosso site está em manutenção. Nós voltaremos em breve.',
  },
});
