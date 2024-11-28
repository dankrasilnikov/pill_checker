import { Alert } from 'react-native';

import { supabase } from '$shared/api/supabase';

export const signUpWithPassword = async (email: string, password: string) => {
  console.log('signup');
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  if (!session) Alert.alert('Please check your inbox for email verification!');
};
