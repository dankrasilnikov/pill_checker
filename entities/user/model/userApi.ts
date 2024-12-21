import { User } from '../types';

import { supabase } from '$shared/api/supabase';

export const fetchCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Ошибка получения текущего пользователя:', error.message);
    return null;
  }

  return {
    id: data.user?.id || '',
    email: data.user?.email || '',
    avatar: data.user?.user_metadata?.avatar_url || '',
    name: data.user?.user_metadata?.full_name || 'Без имени',
  };
};

/**
 * Обновить данные пользователя
 */
export const updateUser = async (userData: Partial<User>): Promise<User | null> => {
  const { data, error } = await supabase.auth.updateUser({
    data: userData,
  });

  if (error) {
    console.error('Ошибка обновления данных пользователя:', error.message);
    return null;
  }

  return {
    id: data?.id || '',
    email: data?.email || '',
    avatar: data?.user_metadata?.avatar_url || '',
    name: data?.user_metadata?.full_name || '',
  };
};
