import AsyncStorage from '@react-native-async-storage/async-storage';

const HEADLINES_KEY = 'kiranaHeadlines';

export const saveHeadlinesToStorage = async headlines => {
  try {
    await AsyncStorage.setItem(HEADLINES_KEY, JSON.stringify(headlines));
  } catch (error) {
    console.error('Error saving:', error);
    throw error;
  }
};

export const getHeadlinesFromStorage = async () => {
  try {
    const headlinesString = await AsyncStorage.getItem(HEADLINES_KEY);
    return headlinesString ? JSON.parse(headlinesString) : [];
  } catch (error) {
    console.error('Error getting:', error);
    throw error;
  }
};
