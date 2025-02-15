import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('access_token', token);
  } catch (error) {
    console.error(error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('access_token');
  } catch (error) {
    console.error('Ошибка получения токена:', error);
    return null;
  }
};

export const deleteToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('access_token');
  } catch (error) {
    console.error('Ошибка удаления токена:', error);
  }
};
