import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hooks that return the keys that are pressed on the keyboard
 */
export const useKeyDown = () => {
  const [keys, setKeys] = useState<number[]>([]);

  const handleKeyDown = useCallback(
    ({ keyCode }: KeyboardEvent) => {
      if (keys.includes(keyCode)) {
        return;
      }

      setKeys([...keys, keyCode]);
    },
    [keys, setKeys],
  );

  const handleKeyUp = useCallback(
    ({ keyCode }: KeyboardEvent) => {
      const d = keys.indexOf(keyCode, 0);

      setKeys([...keys.slice(0, d), ...keys.slice(d + 1)]);
    },
    [keys, setKeys],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false);
    document.addEventListener('keyup', handleKeyUp, false);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, false);
      document.removeEventListener('keyup', handleKeyUp, false);
    };
  }, [keys, handleKeyUp, handleKeyDown]);

  return keys;
};
