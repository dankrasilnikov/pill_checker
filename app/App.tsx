import * as Sentry from '@sentry/react-native';
import { useEffect, useState } from 'react';

import { useUserStore } from '$entities/user';
import { AuthPage } from '$pages/Auth';
import { Dashboard } from '$pages/Dashboard';
import { GreetingPage } from '$pages/Greeting';
import { OnboardingPage } from '$pages/Onboarding';

Sentry.init({
  dsn: 'https://941f2a103da866b176d8828482979dd4@o4508370469781504.ingest.de.sentry.io/4508370490884176',

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});

// eslint-disable-next-line import/no-default-export
export default function App() {
  const { isAuthenticated, fetchUser } = useUserStore();
  const [isLoading, setLoading] = useState(true);
  const [isEducation, setEducation] = useState(true);


  const onDone = () => {
    setEducation(false);
  }

  useEffect(() => {
    setTimeout(() => setLoading(false), 2100);
  }, []);

  useEffect(() => {
    // fetchUser();
  }, []);

  if(isLoading) {
    return <GreetingPage/>
  }

  if(isEducation) {
    return <OnboardingPage onDone={onDone}/>
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <Dashboard />;
}
