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

import "./input.scss";

type Props<T> = {
  label?: string;
  value: T;
  onChange?: (value: T) => void;
  style?: React.CSSProperties;
  className?: string;
};

const AutoInput = <T,>({
  value,
  label,
  onChange,
  style,
  className,
}: Props<T>): JSX.Element => {
  const handleOnChange = useCallback(
    (
      field: DynamicPropertyInformation,
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = getTypedValueFromEvent(field, event) as T;
      onChange?.(value);
    },
    [onChange]
  );

  const form = useMemo<JSX.Element>(() => {
    console.log("###### MEMO");
    console.log("value", value);
    const fieldDefinition = generatePropertyInformation({
      [label ?? "value"]: value,
    } as Record<string, never>)?.[0];
    console.log("fielddefinition", fieldDefinition);
    if (!fieldDefinition) return <></>;

    const formValue = getFormValueBasedOnPropertyInformation(
      fieldDefinition,
      value as Record<string, never>
    );

    console.log("formvalue", formValue);

    return (
      <div
        key={fieldDefinition.propertyPath.join(".")}
        style={style}
        className="input"
      >
        <label htmlFor={translate(fieldDefinition.propertyPath.join("."))}>
          {translate(fieldDefinition.name)}
          <input
            className={` ${className}`}
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
  }, [handleOnChange, value, label, onChange, style, className]);

  return form;
};

export default AutoInput;
