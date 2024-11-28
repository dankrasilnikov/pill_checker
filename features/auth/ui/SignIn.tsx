import { useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useUserStore } from '$entities/user';
import { signUpWithPassword } from '$features/auth/api/authApi';
import { AuthButton } from '$shared/ui/AuthButton';
import { AuthInput } from '$shared/ui/Authinput';

export const SignIn = () => {
  const [email, onChangeEmail] = useState<string>('');
  const [password, onChangePassword] = useState<string>('');
  const [type, setType] = useState<string>('Sign In');

  const { signIn } = useUserStore();

  const switchForm = () => {
    if (type === 'Sign In') return setType('Sign Up');
    return setType('Sign In');
  };

  const onPasswordAuth = async () => {
    if (type === 'Sign In') return await signIn(email, password);
    return await signUpWithPassword(email, password);
  };

  const onSimpleSignIn = async () => {};

  const handleForgotPassword = () => {};

  return (
    <View>
      <Text style={styles.h1}>{type}</Text>
      <View style={styles.authContainer}>
        <AuthInput
          value={email}
          onChange={onChangeEmail}
          label={'Email'}
          placeholder={'email@example.com'}
        />
        <AuthInput
          type={'password'}
          value={password}
          onChange={onChangePassword}
          label={'Password'}
          placeholder={'password...'}
        />
        <AuthButton label={type} onPress={onPasswordAuth} />

        <Text style={styles.authOptionsLabel}>or use one of your social profiles</Text>

        <View style={styles.authOptions}>
          <AuthButton
            label={'Twitter'}
            onPress={onSimpleSignIn}
            backgroundColor={'#2d9bf0'}
            width={'47%'}
          />
          <AuthButton
            label={'Facebook'}
            onPress={onSimpleSignIn}
            backgroundColor={'#414bb2'}
            width={'47%'}
          />
        </View>

        <View style={styles.problemsSection}>
          <Pressable onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </Pressable>
          <Pressable onPress={switchForm}>
            <Text style={styles.signUp}>{type === 'Sign Up' ? 'Sign In' : 'Sign Up'}</Text>
          </Pressable>
        </View>
      </View>
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
  problemsSection: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  forgotPassword: {
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  signUp: {
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
});
