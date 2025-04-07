import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useUserStore } from '$entities/user';
import { signUpWithPassword } from '$features/auth/api/authApi';
import { AgreeCheckbox } from '$features/auth/ui/AgreeCheckbox';
import { AuthButton } from '$shared/ui/AuthButton';
import { AuthInput } from '$shared/ui/Authinput';

export const SignIn = () => {
  const [email, onChangeEmail] = useState<string>('');
  const [password, onChangePassword] = useState<string>('');
  const [type, setType] = useState<string>('Sign In');
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Submitted Data:', data);
    setSubmittedData(data);
  };

  const { signIn } = useUserStore();

  const switchForm = () => {
    if (type === 'Sign In') return setType('Sign Up');
    return setType('Sign In');
  };

  // const onPasswordAuth = async () => {
  //   if (!password || email) return false;
  //   if (type === 'Sign In') return await signIn(email, password);
  //   return await signUpWithPassword(email, password);
  // };

  const onSimpleSignIn = async () => {};

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setType('Sign In')}>
            <Text style={[styles.select, type === 'Sign In' ? styles.activeSelect : {}]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, type === 'Sign Up' ? styles.activeSelect : {}]}
            onPress={() => setType('Sign Up')}
          >
            <Text style={[styles.select]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.authContainer}>
          <AuthInput
            errors={errors}
            control={control}
            name={'email'}
            placeholder={'Enter your email'}
            rules={{ required: 'You must enter your email' }}
          />
          <AuthInput
            errors={errors}
            control={control}
            name={'password'}
            placeholder={'Enter your password'}
            rules={{ required: 'You must enter your password' }}
          />

          {type === 'Sign In' ? (
            ''
          ) : (
            <View style={styles.checkboxContainer}>
              <AgreeCheckbox agreedTerms={agreedTerms} setAgreedTerms={setAgreedTerms} />
            </View>
          )}

          <View style={{ marginTop: type === 'Sign In' ? 16 : 0 }}>
            <AuthButton
              disabled={type === 'Sign In' ? false : !agreedTerms}
              label={type}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginTop: height * 0.03,
  },
  select: {
    fontSize: 20,
    color: '#1F2937',
    textAlign: 'center',
    width: '100%',
    padding: 16,
  },
  button: {
    width: '50%',
  },
  activeSelect: {
    color: '#2563EB',
    borderBottomWidth: 3,
    borderBottomColor: '#2563EB',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
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
    marginVertical: 20,
  },
  authOptions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signUp: {
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  checkboxContainer: {
    paddingBottom: 16,
    paddingTop: 8,
    paddingHorizontal: 5,
  },
});
