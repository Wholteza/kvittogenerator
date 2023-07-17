import { parseWithDateHydration } from "helpers/parse-helpers";
import {
  DynamicPropertyInformation,
  getValueOnPath,
  mutatePropOnPath,
} from "../../helpers/dynamic-object-helpers";

export const getFormValueBasedOnPropertyInformation = (
  information: DynamicPropertyInformation,
  dynamicObject: Record<string, never>
): string | number => {
  switch (information.type) {
    case "string":
      return getValueOnPath<string>(dynamicObject, information.propertyPath);
    case "number":
      return getValueOnPath<number>(dynamicObject, information.propertyPath);
    case "date":
      return getValueOnPath<Date>(
        dynamicObject,
        information.propertyPath
      ).toLocaleDateString();
    default:
      throw new Error(`field type ${information.type} is not implemented`);
  }
};

export const getPsuedoRandomKey = (): string =>
  btoa(
    new Array(1000)
      .map(() => Math.random())
      .reduce((aggregate, current) => aggregate * current, Math.random() + 1)
      .toString()
  );

export const getNewInstanceWithUpdatedProp = <T, K>(
  formState: T,
  information: DynamicPropertyInformation,
  value: K
) => {
  const newState = parseWithDateHydration<T>(JSON.stringify(formState));
  mutatePropOnPath<K>(
    newState as Record<string, never>,
    information.propertyPath,
    value
  );

  return newState;
};

export const getTypedValueFromEvent = (
  field: DynamicPropertyInformation,
  event: React.ChangeEvent<HTMLInputElement>
): string | number | Date | null =>
  field.type === "date"
    ? event.target.valueAsDate
    : field.type === "number"
    ? event.target.valueAsNumber
    : event.target.value;
