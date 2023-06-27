import { useCallback, useEffect, useState } from "react";

export function parseWithDate(jsonString: string): any {
  const reDateDetect = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/; // startswith: 2015-04-29T22:06:55
  const resultObject = JSON.parse(jsonString, (_key: any, value: any) => {
    if (typeof value == "string" && reDateDetect.exec(value)) {
      return new Date(value);
    }
    return value;
  });
  return resultObject;
}

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
      const parsedValue = parseWithDate(rawValue);
      setValue(parsedValue);
    } catch {
      handleValueSet(internalInitialValue);
    }
  }, [handleValueSet, internalInitialValue, internalKey]);

  return [value, handleValueSet];
};

export default useLocalStorage;
