import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export const LoadingOverlay = () => (
  <View style={styles.overlay}>
    <ActivityIndicator size='large' color='#0873bb' />
    <Text style={styles.text}>Processing...</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    width: 80,
    height: 80,
  },
  text: {
    color: '#fff',
    marginTop: 10,
    fontSize: 18,
    fontWeight: '500',
  },
});
