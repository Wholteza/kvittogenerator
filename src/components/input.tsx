import { useCallback, useMemo } from "react";
import translate from "../internationalization/translate";
import {
  DynamicPropertyInformation,
  generatePropertyInformation,
} from "../helpers/dynamic-object-helpers";
import {
  getFormValueBasedOnPropertyInformation,
  getTypedValueFromEvent,
} from "../hooks/use-form/use-form-helpers";

type Props<T> = {
  label?: string;
  value: T;
  onChange?: (value: T) => void;
  style?: React.CSSProperties;
};

const input = <T,>({
  value,
  label,
  onChange,
  style,
}: Props<T>): JSX.Element => {
  const handleOnChange = useCallback(
    (
      field: DynamicPropertyInformation,
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = getTypedValueFromEvent(field, event) as T;
      onChange?.(value);
    },
    []
  );

  const form = useMemo<JSX.Element>(() => {
    const fieldDefinition = generatePropertyInformation({
      [label ?? "value"]: value,
    } as Record<string, never>)?.[0];
    if (!fieldDefinition) return <></>;

    const formValue = getFormValueBasedOnPropertyInformation(
      fieldDefinition,
      value as Record<string, never>
    );

    return (
      <div key={fieldDefinition.propertyPath.join(".")} style={style}>
        <label htmlFor={translate(fieldDefinition.propertyPath.join("."))}>
          {translate(fieldDefinition.name)}
          <input
            id={translate(fieldDefinition.propertyPath.join("."))}
            name={translate(fieldDefinition.propertyPath.join("."))}
            style={{ display: "block" }}
            value={formValue}
            placeholder={translate(fieldDefinition.name)}
            onChange={(event) => handleOnChange(fieldDefinition, event)}
            type={
              fieldDefinition.type === "date"
                ? "date"
                : fieldDefinition.type === "number"
                ? "number"
                : "text"
            }
          />
        </label>
      </div>
    );
  }, [handleOnChange, value]);

  return form;
};

export default input;
