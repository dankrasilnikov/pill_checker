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

export const setMobileStoreItem = async (itemName: string, item: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(itemName, item);
  } catch (error) {
    console.error(error);
  }
};

export const getMobileStoreItem = async (itemName: string): Promise<string | undefined> => {
  try {
    return await AsyncStorage.getItem(itemName);
  } catch (error) {
    console.error('Ошибка получения токена:', error);
    return null;
  }
};
