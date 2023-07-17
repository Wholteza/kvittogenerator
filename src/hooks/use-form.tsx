import { useCallback, useMemo } from "react";
import translate from "../translate";
import useLocalStorage from "../use-local-storage";
import {
  DynamicPropertyInformation,
  generatePropertyInformation,
  getValueOnPath,
  mutatePropOnPath,
} from "../helpers/dynamic-object-helpers";
import { parseWithDateHydration } from "../helpers/parse-helpers";

const useForm = <T,>(key: string, initialState: T): [JSX.Element[], T] => {
  const [formState, setFormState] = useLocalStorage<T>(
    `formData-${key}`,
    initialState
  );

  const handleOnChange = useCallback(
    (
      field: DynamicPropertyInformation,
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value =
        field.type === "date"
          ? event.target.valueAsDate
          : field.type === "number"
          ? event.target.valueAsNumber
          : event.target.value;

      const oldState = parseWithDateHydration<T>(JSON.stringify(formState));
      mutatePropOnPath(
        oldState as Record<string, never>,
        field.propertyPath,
        value
      );
      setFormState(oldState);
    },
    [formState, setFormState]
  );

  const form = useMemo<JSX.Element[]>(() => {
    const fields = generatePropertyInformation(
      initialState as Record<string, never>
    );
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
