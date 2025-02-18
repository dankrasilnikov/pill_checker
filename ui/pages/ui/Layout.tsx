import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Navigation } from '$pages/ui/Navigation';

type Props = {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  return (
    <View style={styles.layout}>
      <ScrollView style={styles.wrapper}>
        {children}
      </ScrollView>
      <Navigation/>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: '100%',
    position: 'relative',
    backgroundColor: '#F0ECF5',
    padding: 16,
    paddingHorizontal: 10,
  },
  layout: {
    position: 'relative',
    height: '100%',
  }
});
