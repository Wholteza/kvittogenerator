import { useCallback, useMemo } from "react";
import translate from "../translate";
import useLocalStorage, { parseWithDate } from "../use-local-storage";

type Field = {
  name: string;
  type: string;
  propertyPath: string[];
};

const generateFieldsForObject = (obj: object, propertyPath: string[] = []) => {
  const fields: Field[] = [];
  Object.keys(obj).forEach((key) => {
    const property = (obj as { [key: string]: any })[key];
    if (property["constructor"] === new Date().constructor) {
      fields.push({
        name: key,
        type: "date",
        propertyPath: [...propertyPath, key],
      });
      return fields;
    }
    if (typeof property === "object") {
      generateFieldsForObject(property, [...propertyPath, key]).forEach(
        (field) => fields.push(field)
      );
      return fields;
    }
    fields.push({
      name: key,
      type: typeof property,
      propertyPath: [...propertyPath, key],
    });
  });
  return fields;
};

const mutatePropOnPath = (obj: object, propertyPath: string[], value: any) => {
  const [key, ...rest] = propertyPath;
  if (!rest.length) {
    (obj as { [key: string]: any })[key] = value;
    return;
  }
  mutatePropOnPath((obj as { [key: string]: any })[key], rest, value);
};

const getValueOnPath = (obj: object, propertyPath: string[]): any => {
  const [key, ...rest] = propertyPath;
  if (!rest.length) {
    return (obj as { [key: string]: string })[key];
  }
  return getValueOnPath((obj as { [key: string]: object })[key], rest);
};

const useForm = <T,>(key: string, initialState: T): [JSX.Element[], T] => {
  const [formState, setFormState] = useLocalStorage<T>(
    `formData-${key}`,
    initialState
  );

  const handleOnChange = useCallback(
    (field: Field, event: React.ChangeEvent<HTMLInputElement>) => {
      const oldState = parseWithDate(JSON.stringify(formState));
      const value =
        field.type === "date"
          ? event.target.valueAsDate
          : field.type === "number"
          ? event.target.valueAsNumber
          : event.target.value;
      mutatePropOnPath(oldState, field.propertyPath, value);
      setFormState(oldState);
    },
    [formState, setFormState]
  );

  const form = useMemo<JSX.Element[]>(() => {
    const fields = generateFieldsForObject(initialState as object);

    return fields.map((field) => {
      const value = getValueOnPath(formState as object, field.propertyPath);
      const parsedValue =
        field.type === "date" ? (value as Date).toLocaleDateString() : value;
      return (
        <div key={field.propertyPath.join(".")}>
          <label htmlFor={field.propertyPath.join(".")}>
            {translate(field.name)}
          </label>
          <input
            name={field.propertyPath.join(".")}
            style={{ display: "block" }}
            value={parsedValue}
            placeholder={translate(field.name)}
            onChange={(event) => handleOnChange(field, event)}
            type={
              field.type === "date"
                ? "date"
                : field.type === "number"
                ? "number"
                : "text"
            }
          />
        </div>
      );
    });
  }, [formState, handleOnChange, initialState]);

  return [form, formState];
};

export default useForm;
