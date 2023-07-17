export function parseWithDateHydration<T>(jsonString: string): T {
  const reDateDetect = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
  const resultObject = JSON.parse(
    jsonString,
    (_key: string, value: unknown) => {
      if (typeof value == "string" && reDateDetect.exec(value)) {
        return new Date(value);
      }
      return value;
    }
  );
  return resultObject;
}
