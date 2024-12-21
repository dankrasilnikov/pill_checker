import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  onPress: any;
};

export const ScanButton = ({ onPress }: Props) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startJumpAnimation = () => {
      Animated.sequence([
        Animated.timing(animation, {
          toValue: -10, // Jump up
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0, // Back to initial position
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: -10, // Second jump up
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0, // Back to initial position
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    };

    startJumpAnimation();
  }, [animation]);

  return (
    <Pressable onPress={onPress} style={styles.buttonWrapper}>
      <Animated.View style={[styles.button, { transform: [{ translateY: animation }] }]}>
        <Image style={styles.icon} source={require('$assets/scan.png')} />
        <Text style={styles.label}>Scan</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    backgroundColor: '#0873bb',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    zIndex: 1000
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  label: {
    fontSize: 24,
    color: '#ffffff',
  },
  icon: {
    width: 40,
    height: 40,
  },
});
