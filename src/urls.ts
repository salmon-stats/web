import { apiBaseUrl } from '@/api-client';
import { isDev } from '@/constants';

const production = 'https://salmon-stats.yuki.games';

const signIn =
  apiBaseUrl +
  '/auth/twitter' +
  (isDev
    ? '?redirect_to=' + encodeURIComponent(location.protocol + '//' + location.hostname + '/auth/twitter/callback')
    : '');
const signOut = apiBaseUrl + '/auth/twitter/logout';

export { production, signIn, signOut };
