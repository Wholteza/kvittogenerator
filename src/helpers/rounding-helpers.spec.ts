import { describe, test, expect } from "@jest/globals";
import { roundToTwoDecimals } from "./rounding-helpers";

describe(`roundToTwoDecimals`, () => {
  test("rounds value with more than 2 decimals to 2 decimals", () => {
    const result = roundToTwoDecimals(0.919);

    expect(result).toBe(0.92);
  });

  test("does not rounds value with 2 decimals", () => {
    const result = roundToTwoDecimals(0.99);

    expect(result).toBe(0.99);
  });

  test("does not rounds value with 1 decimals", () => {
    const result = roundToTwoDecimals(0.9);

    expect(result).toBe(0.9);
  });

  test("does not rounds value with 0 decimals", () => {
    const result = roundToTwoDecimals(1);

    expect(result).toBe(1);
  });

  [0.111, 0.112, 0.113, 0.114].forEach((num) =>
    test("rounds 1-4 down", () => {
      const result = roundToTwoDecimals(num);

      expect(result).toBe(0.11);
    })
  );

  [0.115, 0.116, 0.117, 0.118, 0.119].forEach((num) =>
    test("rounds 5-9 up", () => {
      const result = roundToTwoDecimals(num);

      expect(result).toBe(0.12);
    })
  );
});
