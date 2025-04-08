import * as Sentry from '@sentry/react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import HomeIconBlack from '$assets/homeIconBlack.svg';
import HomeIcon from '$assets/homeIconGray.svg';
import WarnIcon from '$assets/issuesIconGray.svg';
import PillsIconBlack from '$assets/pillsIconBlack.svg';
import PillsIcon from '$assets/pillsIconGray.svg';
import ProfileIconBlack from '$assets/profileIconBlack.svg';
import ProfileIcon from '$assets/profileIconGray.svg';
import WarnIconBlack from '$assets/warnIconBlack.svg';
import { useUserStore } from '$entities/user';
import { AuthPage } from '$pages/Auth';
import { Dashboard } from '$pages/Dashboard';
import { GreetingPage } from '$pages/Greeting';
import { OnboardingPage } from '$pages/Onboarding';
import { getMobileStoreItem, setMobileStoreItem } from '$shared/store';
import { Scan } from '$pages/Scan';
import { Profile } from '$pages/Profile';
import { Issues } from '$pages/Issues';

Sentry.init({
  dsn: 'https://941f2a103da866b176d8828482979dd4@o4508370469781504.ingest.de.sentry.io/4508370490884176',
});

// eslint-disable-next-line import/no-default-export
export default function App() {
  const { isAuthenticated, fetchUser } = useUserStore();
  const [isLoading, setLoading] = useState(true);
  const [isEducated, setEducation] = useState(false);
  const [page, setPage] = useState('dashboard');

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

  const renderPage = () => {
    if (page === 'dashboard') return <Dashboard />;
    if (page === 'issues') return <Issues />;
    if (page === 'profile') return <Profile />;
    if (page === 'scan') return <Scan />;
    return <Dashboard />;
  };

  return (
    <View style={styles.container}>
      {renderPage()}
      <View style={styles.navigation}>
        <Pressable style={styles.navButton} onPress={() => setPage('dashboard')}>
          {page === 'dashboard' ? (
            <HomeIconBlack style={styles.icon} />
          ) : (
            <HomeIcon style={styles.icon} />
          )}
          <Text style={{ color: page === 'dashboard' ? '#303030' : '#888888' }}>Home</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => setPage('scan')}>
          {page === 'scan' ? (
            <PillsIconBlack style={styles.icon} />
          ) : (
            <PillsIcon style={styles.icon} />
          )}
          <Text style={{ color: page === 'scan' ? '#303030' : '#888888' }}>Scan</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => setPage('issues')}>
          {page === 'issues' ? (
            <WarnIconBlack style={styles.icon} />
          ) : (
            <WarnIcon style={styles.icon} />
          )}
          <Text style={{ color: page === 'issues' ? '#303030' : '#888888' }}>Issues</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => setPage('profile')}>
          {page === 'profile' ? (
            <ProfileIconBlack style={styles.icon} />
          ) : (
            <ProfileIcon style={styles.icon} />
          )}
          <Text style={{ color: page === 'profile' ? '#303030' : '#888888' }}>Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  navButton: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {},
  navigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    paddingVertical: 6,
  },
});
