import gql from 'graphql-tag';

const GET_USER = gql`
  query GetUser {
    user {
      id
      username
      company {
        name
        code
      }
    }
  }
`;

const LOGIN_USER = gql`
  query LoginUser($company: String! $username: String! $password: String! $twoFactor: String) {
    userLogin(code: $company username: $username password: $password twoFactor: $twoFactor) {
      user {
        username
      }
      token
      tokenExpiration
      twoFactorEnabled
    }
  }
`;

const IS_LOGGED_IN = gql`
  {
    isLoggedIn @client
  }
`;

export {
  GET_USER,
  LOGIN_USER,
  IS_LOGGED_IN,
};
