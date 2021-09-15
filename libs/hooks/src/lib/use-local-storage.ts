import { useState, useEffect } from 'react';

type TValue = string | boolean | Record<string, unknown>;

export const useLocalStorage = (key: string, initialValue?: TValue) => {
  const [state, setState] = useState(() => {
    try {
      const local = localStorage.getItem(key);

      if (typeof local !== 'string') {
        localStorage.setItem(key, JSON.stringify(initialValue));

        return initialValue;
      } else {
        return JSON.parse(local);
      }
    } catch {
      console.log("Couldn't retrieve the local storage item");
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      // Noop
      console.error(e);
    }
  }, [state, key]);

  return [state, setState];
};
