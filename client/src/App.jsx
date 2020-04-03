import React from 'react';
import { FullPageSpinner } from 'components/lib';
import { useQuery } from '@apollo/client';

import { IS_LOGGED_IN } from 'graphql/Queries';

const AuthenticatedApp = React.lazy(() => import('./AuthenticatedApp'));
const UnauthenticatedApp = React.lazy(() => import('./UnauthenticatedApp'));

const IsLoggedIn = () => {
  // const { data, loading } = useQuery(GET_USER);

  // if (loading) return <FullPageSpinner />;
  // if (data && data.user !== null) return <AuthenticatedApp />;
  // return <UnauthenticatedApp />;

  const { data, loading } = useQuery(IS_LOGGED_IN);

  if (loading) return <FullPageSpinner />;
  if (data && data.isLoggedIn === true) return <AuthenticatedApp />;
  return <UnauthenticatedApp />;
};

const App = () => (
  <React.Suspense fallback={<FullPageSpinner />}>
    <IsLoggedIn />
  </React.Suspense>
);

export default App;
