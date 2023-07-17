export const mutatePropOnPath = (
  obj: object,
  propertyPath: string[],
  value: any
) => {
  const [key, ...rest] = propertyPath;
  if (!rest.length) {
    (obj as { [key: string]: any })[key] = value;
    return;
  }
  mutatePropOnPath((obj as { [key: string]: any })[key], rest, value);
};

export const getValueOnPath = (obj: object, propertyPath: string[]): any => {
  const [key, ...rest] = propertyPath;
  if (!rest.length) {
    return (obj as { [key: string]: string })[key];
  }
  return getValueOnPath((obj as { [key: string]: object })[key], rest);
};
