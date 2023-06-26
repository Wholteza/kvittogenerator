import { useCallback, useEffect, useState } from "react";

const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (newValue: T) => void] => {
  const [value, setValue] = useState<T>(initialValue);
  const handleValueSet = useCallback(
    (newValue: T): void => {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    [key]
  );

  useEffect(() => {
    const rawValue = localStorage.getItem(key);
    console.log(rawValue);
    if (rawValue === null) {
      if (!initialValue) return;
      handleValueSet(initialValue);
      return;
    }
    try {
      const parsedValue = JSON.parse(rawValue) as T;
      setValue(parsedValue);
    } catch {
      handleValueSet(initialValue);
    }
  }, [handleValueSet, initialValue, key]);

  return [value, handleValueSet];
};

export default useLocalStorage;
