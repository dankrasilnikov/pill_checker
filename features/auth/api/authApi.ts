import { Alert } from 'react-native';

import { supabase } from '$shared/api/supabase';
import { saveToken, deleteToken } from '$shared/store/asyncStore';

export const signInWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  await saveToken(data.session?.access_token || '');
};

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

export const signOut = async () => {
  await supabase.auth.signOut();
  await deleteToken();
};
