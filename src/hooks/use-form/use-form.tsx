import { useCallback, useMemo } from "react";
import translate from "../../internationalization/translate";
import useLocalStorage from "../../use-local-storage";
import {
  DynamicPropertyInformation,
  generatePropertyInformation,
} from "../../helpers/dynamic-object-helpers";
import {
  getFormValueBasedOnPropertyInformation,
  getNewInstanceWithUpdatedProp,
  getTypedValueFromEvent,
} from "./use-form-helpers";

const useForm = <T,>(key: string, initialState: T): [JSX.Element[], T, (newValue: T) => void] => {
  const [formState, setFormState] = useLocalStorage<T>(
    `formData-${key}`,
    initialState
  );

  const handleOnChange = useCallback(
    (
      field: DynamicPropertyInformation,
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = getTypedValueFromEvent(field, event);
      const newState = getNewInstanceWithUpdatedProp(formState, field, value);
      setFormState(newState);
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

  return [form, formState, setFormState];
};

export default useForm;
