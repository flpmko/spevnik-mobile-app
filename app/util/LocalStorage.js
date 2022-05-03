import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e.message);
  }
};

const getStoredData = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.log(e.message);
  }
  return null;
};

const storeObjectData = async (key, object) => {
  try {
    const jsonValue = JSON.stringify(object);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e.message);
  }
};

const getStoredObjectData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e.message);
  }
};

const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e.message);
  }
};

const clearAllData = async () => {
  try {
    await AsyncStorage.getAllKeys().then((keys) =>
      AsyncStorage.multiRemove(keys)
    );
  } catch (e) {
    console.log(e.message);
  }
};

export {
  getStoredData,
  getStoredObjectData,
  storeData,
  storeObjectData,
  removeData,
  clearAllData,
};
