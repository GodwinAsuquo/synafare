import { useEffect, useState } from "react";

interface PersistedStateProps {
  key: string;
  defaultValue: unknown;
}

const usePersistedState = ({ key, defaultValue }: PersistedStateProps) => {
  const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
  });

  useEffect(() => {
    if (state !== undefined) {
      localStorage.setItem(key, JSON.stringify(state));
    } else {
      localStorage.removeItem(key);
    }
  }, [state, key]);

  return [state, setState];
};

export default usePersistedState;
