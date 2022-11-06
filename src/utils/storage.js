import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@user_info', jsonValue);
  } catch (e) {}
};

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user_info');

    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const removeData = async () => {
  try {
    await AsyncStorage.removeItem('@user_info');
  } catch (e) {
    // error reading value
  }
};

export const storeLocation = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@user_location', jsonValue);
  } catch (error) {}
};

export const getLocation = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user_location');

    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  } catch (error) {}
};


export const storeRange = async value => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@user_range_filter', jsonValue);
  } catch (error) {
    
  }
}

export const getRange = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user_range_filter');
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    
  }
}

export const storeFistLaunched = async value => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@first_launched', jsonValue)
  } catch (error) {
    
  }
}

export const getAppFirstLaunched = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@fisrt_launched');
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    
  }
}