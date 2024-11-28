import { Dimensions, Image, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { SignIn } from '$features/auth/ui/SignIn';

export const AuthPage = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../assets/logo.png')} />
        </View>

        <SignIn />
      </ScrollView>
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 20,
  },
  logoContainer: {
    paddingVertical: height * 0.07,
  },
  logo: {
    height: Platform.OS === 'ios' ? height * 0.14 : height * 0.16,
    aspectRatio: '1/1',
    margin: 'auto',
  },
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  authContainer: {},
  authOptionsLabel: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
  authOptions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
