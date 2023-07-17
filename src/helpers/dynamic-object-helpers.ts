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

  const propType = typeof dynamicObject[key];
  if (propType !== typeof newValue) {
    throw new Error(`The provided value is not of type ${propType}`);
  }

  (dynamicObject[key] as K) = newValue;
};

export const getValueOnPath = <T>(
  dynamicObject: Record<string, never>,
  propertyPath: string[]
): T => {
  const [key, ...rest] = propertyPath;
  if (!rest.length) {
    return dynamicObject[key] as T;
  }
  return getValueOnPath(dynamicObject[key], rest);
};
