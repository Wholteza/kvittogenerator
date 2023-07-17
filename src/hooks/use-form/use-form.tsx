import { useCallback, useMemo } from "react";
import translate from "../../translate";
import useLocalStorage from "../../use-local-storage";
import {
  DynamicPropertyInformation,
  generatePropertyInformation,
  mutatePropOnPath,
} from "../../helpers/dynamic-object-helpers";
import { parseWithDateHydration } from "../../helpers/parse-helpers";
import { getFormValueBasedOnPropertyInformation } from "./use-form-helpers";

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

      // TODO: Extract below into method that mutates a copy of the sent in object to be able to work with mutation
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
    const fieldDefinitions = generatePropertyInformation(
      initialState as Record<string, never>
    );
    return fieldDefinitions.map((field) => {
      const value = getFormValueBasedOnPropertyInformation(
        field,
        formState as Record<string, never>
      );

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
