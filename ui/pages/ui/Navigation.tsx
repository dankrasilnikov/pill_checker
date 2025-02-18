import { Pressable, StyleSheet, Text, View } from 'react-native';

import HomeIcon from '$assets/home.svg';
import ProfileIcon from '$assets/profile.svg';
import WarningIcon from '$assets/warning.svg';


export const Navigation = () => {
  return (
    <View style={styles.navigation}>
      <Pressable style={styles.button}>
        <WarningIcon width={28} height={28} />
        <Text style={styles.label}>Issues</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <HomeIcon width={28} height={28} />
        <Text style={styles.label}>Home</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <ProfileIcon width={28} height={28} />
        <Text style={styles.label}>Profile</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  navigation: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  title: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  button: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    color: '#888888',
    fontWeight: 'medium',
    marginTop: 3
  }
});
