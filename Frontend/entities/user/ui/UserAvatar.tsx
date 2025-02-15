import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import { useUserStore } from '$entities/user';

export const UserAvatar = () => {
  const { user } = useUserStore();

  if (!user) {
    return <Text>Загрузка...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{user.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
