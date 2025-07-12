import { useCallback, useMemo } from "react";
import useLocalStorage from "../use-local-storage";

type StoredRecord<T> = Record<string, T>;

type Result<T> = {
  selectedItem: T | undefined;
  selectedKey: string | undefined;
  keys: string[];
  values: T[];
  addItem: (item: T) => void;
  removeItem: (item: T) => void;
  selectKey: (key: string | undefined) => void;
};

const useStoredValues = <T>(key: string, keyBuilder: (item: T) => string): Result<T> => {
  const [selectedKey, _setKey, setSelectedKey] = useLocalStorage<string | undefined>(`${key}_selected-value`, undefined);
  const [storedValues, _setValues, setStoredValues] = useLocalStorage<StoredRecord<T>>(key, {});

  const keys = useMemo<string[]>(() => Object.keys(storedValues), [storedValues]);

  const selectedItem = useMemo<T | undefined>(() => storedValues[selectedKey ?? ""] ?? undefined, [selectedKey, storedValues]);

  const addItem = useCallback((item: T): void => {
    setStoredValues((prev: StoredRecord<T>) => ({ ...prev, [keyBuilder(item)]: item }))
  }, [keyBuilder, setStoredValues]);

  const removeItem = useCallback((item: T) => {
    setStoredValues((prev: StoredRecord<T>) => {
      return Object.keys(prev).reduce((acc, currKey) => {
        const currItem = prev[currKey]
        if (currKey === keyBuilder(item)) return acc;
        return { ...acc, [currKey]: currItem }
      }, {});
    })
  }, [setStoredValues, keyBuilder])

  const values = useMemo<T[]>(() => keys.map(k => storedValues[k]), [storedValues, keys])

  const selectKey = useCallback((key: string | undefined): void => {
    setSelectedKey(() => (key))
  }, [setSelectedKey])

  return { selectedItem, selectedKey, keys, addItem, removeItem, values, selectKey }

}

export default useStoredValues;
