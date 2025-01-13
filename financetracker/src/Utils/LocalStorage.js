export const getItem = (key, defaultValue) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
};

export const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
