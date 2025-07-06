import { parseWithDateHydration } from "./helpers/parse-helpers";
import { useCallback, useEffect, useState } from "react";

const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (newValue: T) => void, (valueUpdater: (prev: T) => T) => void] => {
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

  const handleValueSetViaUpdater = useCallback((valueUpdater: (prev: T) => T): void => {
    setValue((prev) => {
      const newValue = valueUpdater(prev)
      localStorage.setItem(internalKey, JSON.stringify(newValue));
      return newValue;
    })

  }, [internalKey])

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

  return [value, handleValueSet, handleValueSetViaUpdater];
};

export default useLocalStorage;
