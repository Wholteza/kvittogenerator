export const mutatePropOnPath = <K>(
  dynamicObject: Record<string, never>,
  propertyPath: string[],
  newValue: K
) => {
  const [key, ...rest] = propertyPath;
  if (rest.length) {
    if (typeof dynamicObject[key] !== typeof {}) {
      throw new Error("Property path is not an object");
    }

    mutatePropOnPath(dynamicObject[key], rest, newValue);
    return;
  }

  // TODO: Add a test for this
  const oldValue = dynamicObject[key];
  const propType = typeof oldValue;
  if (propType !== typeof newValue && oldValue !== null) {
    throw new Error(`The provided value is not of type ${propType}`);
  }

  (dynamicObject[key] as K) = newValue;
};

export const getValueOnPath = <T>(
  dynamicObject: Record<string, never>,
  propertyPath: string[]
): T | null => {
  const [key, ...rest] = propertyPath;
  if (!rest.length) {
    return dynamicObject[key] as T | null;
  }
  return getValueOnPath(dynamicObject[key], rest);
};

export type DynamicPropertyInformation = {
  name: string;
  type: string;
  propertyPath: string[];
};

export const generatePropertyInformation = (
  obj: Record<string, never>,
  recursivePropertyPath: string[] = []
): DynamicPropertyInformation[] => {
  const propertyInformations: DynamicPropertyInformation[] = [];
  Object.keys(obj).forEach((key) => {
    const property = obj[key];
    if (property["constructor"] === new Date().constructor) {
      propertyInformations.push({
        name: key,
        type: "date",
        propertyPath: [...recursivePropertyPath, key],
      });
      return propertyInformations;
    } else if (typeof property === "object") {
      generatePropertyInformation(property, [
        ...recursivePropertyPath,
        key,
      ]).forEach((field) => propertyInformations.push(field));
      return propertyInformations;
    } else if (["string", "number"].includes(typeof property))
      propertyInformations.push({
        name: key,
        type: typeof property,
        propertyPath: [...recursivePropertyPath, key],
      });
    else {
      throw new Error(`type ${typeof property} not implemented`);
    }
  });
  return propertyInformations;
};
