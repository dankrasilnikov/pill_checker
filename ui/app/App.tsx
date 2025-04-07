import * as Sentry from '@sentry/react-native';
import { useEffect, useState } from 'react';

import { useUserStore } from '$entities/user';
import { AuthPage } from '$pages/Auth';
import { Dashboard } from '$pages/Dashboard';
import { GreetingPage } from '$pages/Greeting';
import { OnboardingPage } from '$pages/Onboarding';
import { getMobileStoreItem, setMobileStoreItem } from '$shared/store';

Sentry.init({
  dsn: 'https://941f2a103da866b176d8828482979dd4@o4508370469781504.ingest.de.sentry.io/4508370490884176',
});

// eslint-disable-next-line import/no-default-export
export default function App() {
  const { isAuthenticated, fetchUser } = useUserStore();
  const [isLoading, setLoading] = useState(true);
  const [isEducated, setEducation] = useState(false);

  const onDone = async () => {
    await setMobileStoreItem('educated', 'true');
    setEducation(true);
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    getMobileStoreItem('educated').then((result) => {
      setEducation(!!result);
    });
  }, []);

  if (isLoading) {
    return <GreetingPage />;
  }

  if (!isEducated) {
    return <OnboardingPage onDone={onDone} />;
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <Dashboard />;
}
