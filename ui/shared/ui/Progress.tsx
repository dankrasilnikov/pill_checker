import { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Easing } from 'react-native';

const ProgressBar = ({
                       progress = 0,
                       barColor = '#fff',
                       backgroundColor = '#4270D5',
                       height = 5,
                       duration = 1700,
                       style,
                     }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [progress, duration, widthAnim]);

  const widthInterpolated = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { backgroundColor, height }, style]}>
      <Animated.View
        style={[
          styles.progress,
          { width: widthInterpolated, backgroundColor: barColor },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});

export default ProgressBar;
