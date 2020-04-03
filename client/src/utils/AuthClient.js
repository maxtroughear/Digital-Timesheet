import { useApolloClient } from '@apollo/react-hooks';
import localStorageKey from './LocalStorageKey';

const client = useApolloClient();

const getToken = () => window.localStorage.getItem(localStorageKey);

const isLoggedIn = () => Boolean(getToken());

const getUser = () => {
  const token = getToken();
  if (!token) {
    return Promise.resolve(null);
  }

  return null;
};

const login = ({ username, password }) => client('login', { body: { username, password } }).then(({ user: { token, ...user } }) => {
  localStorage.setItem(localStorageKey, token);
  return user;
});

const logout = () => {
  localStorage.clear();
};

export {
  login,
  logout,
  getToken,
  getUser,
  isLoggedIn,
};
