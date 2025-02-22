export const getFromSessionStorage = <T>(key: string, defaultValue: T): T => {
  const item = sessionStorage.getItem(key);
  return item ? JSON.parse(item) as T : defaultValue;
};

export const saveToSessionStorage = <T>(key: string, value: T) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};