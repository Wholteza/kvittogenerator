import { ReactElement, useCallback, useMemo, useRef } from "react";
import useLocalStorage from "../../use-local-storage";

export const useFormKeys = (
  baseKey: string
): { formKeyDropdown: ReactElement; currentFormKey: string | null } => {
  const [formKeys, setFormKeys] = useLocalStorage<string[]>(
    `formKeys-${baseKey}`,
    []
  );
  const [currentFormKey, setCurrentFormKey] = useLocalStorage<string | null>(
    `current-formKey-${baseKey}`,
    null
  );

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      setCurrentFormKey(value);
    },
    [setCurrentFormKey]
  );

  const handleOnAdd = useCallback(
    (name: string) => {
      dialogRef.current?.showModal();
      const newFormKey = `${baseKey}-${name}`;
      setFormKeys([...formKeys, newFormKey]);
      setCurrentFormKey(newFormKey);
    },
    [baseKey, setFormKeys, formKeys, setCurrentFormKey]
  );

  const handleOnAddClick = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const handleOnCancelClick = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const handleOnRemove = useCallback(
    (keyToRemove: string) => {
      const newFormKeys = [...formKeys];
      newFormKeys.splice(formKeys.indexOf(keyToRemove), 1);
      setFormKeys(newFormKeys);
      setCurrentFormKey(newFormKeys[0]);
    },
    [formKeys, setFormKeys, setCurrentFormKey]
  );

  const dialogRef = useRef<HTMLDialogElement>(null);

  const formKeyDropdown = useMemo<JSX.Element>(() => {
    return (
      <div>
        <label htmlFor="formKeyDropdown">Form Key</label>
        <select
          id="formKeyDropdown"
          name="formKeyDropdown"
          style={{ display: "block" }}
          value={currentFormKey ?? ""}
          onChange={handleOnChange}
        >
          {formKeys.map((formKey) => (
            <option key={formKey} value={formKey}>
              {formKey}
            </option>
          ))}
        </select>
        <button onClick={handleOnAddClick}>Add</button>
        <button>Remove</button>
        <dialog ref={dialogRef}>
          <label htmlFor="newFormKey">New Form Key</label>
          <input
            id="newFormKey"
            name="newFormKey"
            style={{ display: "block" }}
            placeholder="New Form Key"
          />
          <button onClick={() => handleOnAdd("test")}>Add</button>
          <button onClick={handleOnCancelClick}>Cancel</button>
        </dialog>
      </div>
    );
  }, [
    currentFormKey,
    handleOnChange,
    formKeys,
    handleOnAddClick,
    handleOnCancelClick,
    handleOnAdd,
  ]);

  return { formKeyDropdown, currentFormKey };
};
