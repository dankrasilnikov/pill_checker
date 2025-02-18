import { StyleSheet, View } from 'react-native';

export const BoxShadow = ({ children }) => {
  return <View style={styles.boxShadow}>{children}</View>;
};

const styles = StyleSheet.create({
  boxShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 20,
    borderWidth: 0,
  },
});
