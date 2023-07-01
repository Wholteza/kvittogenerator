import { afterEach, jest, describe, test, expect } from "@jest/globals";
import * as unitModule from "./price-helpers";
import * as roundToTwoDecimalsModule from "./rounding-helpers";

describe("toTwoDecimalString", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  const testFacts: {
    input: number;
    inputRoundedToTwoDecimals: number;
    inputRoundedToTwoDecimalsAsString: string;
    expected: string;
  }[] = [
    {
      input: 25,
      inputRoundedToTwoDecimals: 25,
      inputRoundedToTwoDecimalsAsString: "25",
      expected: "25.00",
    },
    {
      input: 25.5,
      inputRoundedToTwoDecimals: 25.5,
      inputRoundedToTwoDecimalsAsString: "25.5",
      expected: "25.50",
    },
    {
      input: 25.55,
      inputRoundedToTwoDecimals: 25.55,
      inputRoundedToTwoDecimalsAsString: "25.55",
      expected: "25.55",
    },
  ];
  testFacts.forEach((fact) => {
    test("coordinates function calls to get the input number as string with two decimals", () => {
      const roundToTwoDecimalsSpy = jest
        .spyOn(roundToTwoDecimalsModule, "roundToTwoDecimals")
        .mockReturnValue(fact.inputRoundedToTwoDecimals);
      const ensureNumberStringHasTwoDecimalPlacesSpy = jest
        .spyOn(unitModule, "ensureNumberStringHasTwoDecimalPlaces")
        .mockReturnValue(fact.expected);

      const result = unitModule.toTwoDecimalString(fact.input);

      expect(roundToTwoDecimalsSpy).toHaveBeenCalledWith(fact.input);
      expect(ensureNumberStringHasTwoDecimalPlacesSpy).toHaveBeenCalledWith(
        fact.inputRoundedToTwoDecimalsAsString
      );
      expect(result).toBe(fact.expected);
    });
  });
});

describe("ensureNumberStringHasTwoDecimalPlaces", () => {
  test("throws if input already has more than two decimal places", () => {
    const action = () =>
      unitModule.ensureNumberStringHasTwoDecimalPlaces("1.111");

    expect(action).toThrow();
  });

  const testFacts: { value: string; expected: string }[] = [
    { value: "1", expected: "1.00" },
    { value: "1.1", expected: "1.10" },
    { value: "1.11", expected: "1.11" },
  ];
  testFacts.forEach((fact) =>
    test("always makes sure returned value have two decimal places", () => {
      const result = unitModule.ensureNumberStringHasTwoDecimalPlaces(
        fact.value
      );

      expect(result).toBe(fact.expected);
    })
  );
});
