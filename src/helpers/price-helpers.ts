import { roundToTwoDecimals } from "./rounding-helpers";

export const toTwoDecimalString = (value: number) =>
  ensureNumberStringHasTwoDecimalPlaces(roundToTwoDecimals(value).toString());

export const ensureNumberStringHasTwoDecimalPlaces = (
  value: string
): string => {
  const moreThanTwoDecimalRegex = /\.\d\d\d/;
  if (moreThanTwoDecimalRegex.exec(value))
    throw new Error("value must have 2 decimal values or less");

  let newValue = value;

  const needsToAddDecimalPoint = !/\./.exec(newValue);
  if (needsToAddDecimalPoint) newValue += ".";

  const hasTwoDecimalNumbers = /\.\d\d$/;
  while (!hasTwoDecimalNumbers.exec(newValue)) {
    newValue += "0";
  }
  return newValue;
};
