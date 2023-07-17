import {
  DynamicPropertyInformation,
  getValueOnPath,
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
