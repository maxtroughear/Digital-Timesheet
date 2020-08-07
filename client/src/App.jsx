import React from 'react';
import { FullPageSpinner } from 'components/lib';
import { useQuery } from '@apollo/client';

import { ME } from 'graphql/Queries';

const AuthenticatedApp = React.lazy(() => import('./AuthenticatedApp'));
const UnauthenticatedApp = React.lazy(() => import('./UnauthenticatedApp'));

const IsLoggedIn = () => {
  // const { data, loading } = useQuery(GET_USER);

  // if (loading) return <FullPageSpinner />;
  // if (data && data.user !== null) return <AuthenticatedApp />;
  // return <UnauthenticatedApp />;

  const { loading, error, refetch } = useQuery(ME, {
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  });

  if (loading) return <FullPageSpinner />;
  if (!error) return <AuthenticatedApp onLogout={refetch} />;
  return <UnauthenticatedApp onLogin={refetch} />;
};

const App = () => (
  <React.Suspense fallback={<FullPageSpinner />}>
    <IsLoggedIn />
  </React.Suspense>
);

export default App;
