import { useCallback, useMemo } from "react";
import translate from "../translate";
import useLocalStorage, { parseWithDate } from "../use-local-storage";
import {
  getValueOnPath,
  mutatePropOnPath,
} from "../helpers/dynamic-object-helpers";

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
      let value: number | string = 0;
      switch (field.type) {
        case "string":
          value = getValueOnPath<string>(
            formState as Record<string, never>,
            field.propertyPath
          );
          break;
        case "number":
          value = getValueOnPath<number>(
            formState as Record<string, never>,
            field.propertyPath
          );
          break;
        case "date":
          value = getValueOnPath<Date>(
            formState as Record<string, never>,
            field.propertyPath
          ).toLocaleDateString();
          break;
        default:
          throw new Error(`field type ${field.type} is not implemented`);
      }

      return (
        <div key={field.propertyPath.join(".")}>
          <label htmlFor={translate(field.propertyPath.join("."))}>
            {translate(field.name)}
            <input
              id={translate(field.propertyPath.join("."))}
              name={translate(field.propertyPath.join("."))}
              style={{ display: "block" }}
              value={value}
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
          </label>
        </div>
      );
    });
  }, [formState, handleOnChange, initialState]);

  return [form, formState];
};

export default useForm;
