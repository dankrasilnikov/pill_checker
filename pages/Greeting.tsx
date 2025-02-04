import { Dimensions, Platform, ScrollView, StyleSheet, Text, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Pills from '../assets/pills.svg';
import Shield from '../assets/shield.svg';
import { useEffect, useState, useRef } from 'react';
import ProgressBar from '$shared/ui/Progress';

export const GreetingPage = () => {
  const [progress, setProgress] = useState(0);
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    setProgress(1);

    setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }).start();
    }, 1500);
  }, [opacityAnim]);

  return (
    <LinearGradient
      colors={['#2563EB', '#1E40AF']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <Animated.View style={{ flex: 1, opacity: opacityAnim }}>
        <ScrollView>
          <View style={styles.logoContainer}>
            <Pills style={styles.logo} />
          </View>
          <Text style={styles.h1}>MediScan AI</Text>
          <Text style={styles.p}>Identify Medications, Stay Safe</Text>
          <ProgressBar progress={progress} style={styles.progressBar} />
        </ScrollView>
        <Shield style={styles.smallIcon} />
      </Animated.View>
    </LinearGradient>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  progressBar: {
    width: '20%',
    marginVertical: 0,
    marginHorizontal: 'auto',
    marginTop: 70,
    height: 5,
  },
  smallIcon: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    right: '50%',
  },
  container: {
    paddingHorizontal: 20,
    height: '100%',
    position: 'relative',
  },
  logoContainer: {
    paddingVertical: height * 0.02,
    paddingBottom: 0,
    marginTop: '65%',
  },
  logo: {
    height: Platform.OS === 'ios' ? height * 0.14 : height * 0.16,
    aspectRatio: 1,
    margin: 'auto',
  },
  h1: {
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 16,
    textAlign: 'center',
    color: '#fff',
  },
  p: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});
