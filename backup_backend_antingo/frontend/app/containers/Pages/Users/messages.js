/*
 * User Messages
 *
 * This contains all the text for the User page.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.Users';

export default defineMessages({
  welcomeTitle: {
    id: `${scope}.Welcome.title`,
    defaultMessage: 'Bem Vindo ao',
  },
  welcomeSubtitle: {
    id: `${scope}.Welcome.subtitle`,
    defaultMessage: 'Faça login pra continuar',
  },
  greetingTitle: {
    id: `${scope}.Greeting.title`,
    defaultMessage: 'Olá... prazer em conhecer você',
  },
  backToSite: {
    id: `${scope}.backToSite`,
    defaultMessage: 'Voltar ao site'
  }
});
