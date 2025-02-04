import { Animated, Dimensions, Platform, StyleSheet, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import Slider from '@react-native-community/slider';
import EducationCarousel from '$features/education/ui/EducationSlider';
import EducationSlider from '$features/education/ui/EducationSlider';

export const OnboardingPage = ({onDone}) => {
  const [progress, setProgress] = useState(0);
  const [value, setValue] = useState(50);
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
    <View style={styles.container}>
      <EducationSlider onDone={onDone}/>
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  slider: {
    width: 300,
    height: 40,
  },
  valueText: {
    fontSize: 18,
    marginBottom: 20,
  },
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
