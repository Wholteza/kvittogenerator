import { parseWithDateHydration } from "./helpers/parse-helpers";
import { useCallback, useEffect, useState } from "react";

const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (newValue: T) => void] => {
  const [internalKey] = useState<string>(key);
  const [internalInitialValue] = useState<T>(initialValue);
  const [value, setValue] = useState<T>(internalInitialValue);
  const handleValueSet = useCallback(
    (newValue: T): void => {
      setValue(newValue);
      localStorage.setItem(internalKey, JSON.stringify(newValue));
    },
    [internalKey]
  );

  useEffect(() => {
    const rawValue = localStorage.getItem(internalKey);
    if (rawValue === null) {
      if (!internalInitialValue) return;
      handleValueSet(internalInitialValue);
      return;
    }
    try {
      const parsedValue = parseWithDateHydration<T>(rawValue);
      setValue(parsedValue);
    } catch {
      handleValueSet(internalInitialValue);
    }
  }, [handleValueSet, internalInitialValue, internalKey]);

  return [value, handleValueSet];
};

export default useLocalStorage;
