import { apiBaseUrl } from '@/api-client';

const signIn = apiBaseUrl + '/auth/twitter';
const signOut = apiBaseUrl + '/auth/twitter/logout';

export { signIn, signOut };
