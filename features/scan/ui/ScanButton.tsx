import { Image, Pressable, StyleSheet, View, Text } from 'react-native';

type Props = {
  onPress: () => void
}

export const ScanButton = ({onPress}: Props) => {

  return (
      <Pressable onPress={onPress} style={styles.buttonWrapper}>
        <View style={styles.button}>
          <Image style={styles.icon} source={require('../../../assets/scan.png')} />
          <Text style={styles.label}>Scan</Text>
        </View>
      </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    backgroundColor: '#0873bb',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  label: {
    fontSize: 24,
    color: '#ffffff',
  },
  icon: {
    width: 40,
    height: 40,
  }
});

