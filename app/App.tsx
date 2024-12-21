import * as Sentry from '@sentry/react-native';
import { useEffect } from 'react';
import { Button, Text, View } from 'react-native';

import { useUserStore } from '$entities/user';
import { AuthPage } from '$pages/Auth';
import { Dashboard } from '$pages/Dashboard';

Sentry.init({
  dsn: 'https://941f2a103da866b176d8828482979dd4@o4508370469781504.ingest.de.sentry.io/4508370490884176',

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});

// eslint-disable-next-line import/no-default-export
export default function App() {
  const { isAuthenticated, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, []);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <Dashboard />;
}
