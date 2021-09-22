import { useState, useEffect } from 'react';

type TValue = string | boolean | Record<string, unknown>;

export const useLocalStorage = (key: string, startingValue?: TValue) => {
  const [state, setState] = useState(() => {
    try {
      const local = localStorage.getItem(key);

      if (typeof local !== 'string') {
        localStorage.setItem(key, JSON.stringify(startingValue));

        return startingValue;
      } else {
        return JSON.parse(local);
      }
    } catch {
      console.error("Couldn't retrieve the value from local storage.");
      return startingValue;
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

  return [state, setState] as const;
};
