import { describe, expect, test } from "@jest/globals";
import { PriceCalculator, VatIsDecimalValueError } from "./price-calculator";
const ClassName = "PriceCalculator";

describe(`${ClassName} - constructor`, () => {
  test("sets vat percentage to provided value", () => {
    const vatPercentage = 99;

    const result = new PriceCalculator(vatPercentage);

    expect(result.vatPercentage).toBe(vatPercentage);
  });

  test("throws if provided vat percentage is less than 0", () => {
    const vatPercentage = -1;

    expect(() => {
      new PriceCalculator(vatPercentage);
    }).toThrowError();
  });

  test("throws if provided vat percentage is a decimal", () => {
    const vatPercentage = 0.1;

    expect(() => {
      new PriceCalculator(vatPercentage);
    }).toThrow(VatIsDecimalValueError);
  });
});

describe(`${ClassName} - getPriceWithoutVat`, () => {
  type TestInput = {
    vatPercentage: number;
    priceWithVat: number;
    expectedPriceWithoutVat: number;
  };
  const testInputs: TestInput[] = [
    { vatPercentage: 25, priceWithVat: 435, expectedPriceWithoutVat: 348 },
    { vatPercentage: 25, priceWithVat: 125, expectedPriceWithoutVat: 100 },
    {
      vatPercentage: 12,
      priceWithVat: 435,
      expectedPriceWithoutVat: 388.39,
    },
    {
      vatPercentage: 12,
      priceWithVat: 125,
      expectedPriceWithoutVat: 111.61,
    },
    {
      vatPercentage: 6,
      priceWithVat: 435,
      expectedPriceWithoutVat: 410.38,
    },
    {
      vatPercentage: 6,
      priceWithVat: 125,
      expectedPriceWithoutVat: 117.92,
    },
    { vatPercentage: 0, priceWithVat: 435, expectedPriceWithoutVat: 435 },
  ];
  testInputs.forEach((input) =>
    test("returns price without vat", () => {
      const unit = new PriceCalculator(input.vatPercentage);

      const result = unit.getPriceWithoutVat(input.priceWithVat);

      expect(result).toBe(input.expectedPriceWithoutVat);
    })
  );
  test("returns price without vat rounded to two decimals", () => {
    const unit = new PriceCalculator(12);

    const result = unit.getPriceWithoutVat(201);

    expect(result).toBe(179.46);
  });
});

describe(`${ClassName} - getPriceWithVat`, () => {
  type TestInput = {
    vatPercentage: number;
    priceWithoutVat: number;
    expectedPriceWithVat: number;
  };
  const testInputs: TestInput[] = [
    { vatPercentage: 25, priceWithoutVat: 348, expectedPriceWithVat: 435 },
    { vatPercentage: 25, priceWithoutVat: 100, expectedPriceWithVat: 125 },
    {
      vatPercentage: 12,
      priceWithoutVat: 388.39,
      expectedPriceWithVat: 435,
    },
    {
      vatPercentage: 12,
      priceWithoutVat: 111.61,
      expectedPriceWithVat: 125,
    },
    {
      vatPercentage: 6,
      priceWithoutVat: 410.38,
      expectedPriceWithVat: 435,
    },
    {
      vatPercentage: 6,
      priceWithoutVat: 117.92,
      expectedPriceWithVat: 125,
    },
    { vatPercentage: 0, priceWithoutVat: 435, expectedPriceWithVat: 435 },
  ];
  testInputs.forEach((input) =>
    test("returns price with vat rounded to two decimals", () => {
      const unit = new PriceCalculator(input.vatPercentage);

      const result = unit.getPriceWithVat(input.priceWithoutVat);

      expect(result).toBe(input.expectedPriceWithVat);
    })
  );
});

describe(`${ClassName} - getVatMultiplierFromPercentage`, () => {
  type TestInput = {
    vatPercentage: number;
    expectedVatMultiplier: number;
  };
  const testInputs: TestInput[] = [
    { vatPercentage: 25, expectedVatMultiplier: 1.25 },
    { vatPercentage: 12, expectedVatMultiplier: 1.12 },
    { vatPercentage: 6, expectedVatMultiplier: 1.06 },
    { vatPercentage: 0, expectedVatMultiplier: 1 },
    { vatPercentage: 100, expectedVatMultiplier: 2 },
    { vatPercentage: 311, expectedVatMultiplier: 4.11 },
  ];
  testInputs.forEach((input) =>
    test("returns expected vat multiplier rounded to two decimals", () => {
      const unit = new PriceCalculator(input.vatPercentage);

      const result = unit.getVatMultiplierFromPercentage();

      expect(result).toBe(input.expectedVatMultiplier);
    })
  );
});

describe(`${ClassName} - calculateVat`, () => {
  type TestInput = {
    vatPercentage: number;
    pricePerPieceVatExcluded: number;
    expectedVat: number;
  };
  const testInputs: TestInput[] = [
    {
      vatPercentage: 25,
      pricePerPieceVatExcluded: 348,
      expectedVat: 87,
    },
    {
      vatPercentage: 25,
      pricePerPieceVatExcluded: 100,
      expectedVat: 25,
    },
    {
      vatPercentage: 12,
      pricePerPieceVatExcluded: 200,
      expectedVat: 24,
    },
    {
      vatPercentage: 12,
      pricePerPieceVatExcluded: 100,
      expectedVat: 12,
    },
    {
      vatPercentage: 6,
      pricePerPieceVatExcluded: 200,
      expectedVat: 12,
    },
    {
      vatPercentage: 6,
      pricePerPieceVatExcluded: 306.6,
      expectedVat: 18.4,
    },
    {
      vatPercentage: 6,
      pricePerPieceVatExcluded: 100,
      expectedVat: 6,
    },
    {
      vatPercentage: 0,
      pricePerPieceVatExcluded: 435,
      expectedVat: 0,
    },
  ];
  testInputs.forEach((input) =>
    test("returns vat", () => {
      const unit = new PriceCalculator(input.vatPercentage);

      const result = unit.calculateVat(input.pricePerPieceVatExcluded);

      expect(result).toBe(input.expectedVat);
    })
  );
});

describe(`${ClassName} - calculateTotalWithVatIncluded`, () => {
  type TestInput = {
    pricePerPieceVatExcluded: number;
    amount: number;
    expectedTotalWithVatIncluded: number;
    vatPercentage: number;
  };
  const testInputs: TestInput[] = [
    {
      vatPercentage: 25,
      pricePerPieceVatExcluded: 100,
      amount: 1,
      expectedTotalWithVatIncluded: 125,
    },
    {
      vatPercentage: 25,
      pricePerPieceVatExcluded: 33,
      amount: 5,
      expectedTotalWithVatIncluded: 206.25,
    },
  ];
  testInputs.forEach((input) =>
    test("returns total with vat included", () => {
      const unit = new PriceCalculator(input.vatPercentage);

      const result = unit.calculateTotalWithVatIncluded(
        input.pricePerPieceVatExcluded,
        input.amount
      );

      expect(result).toBe(input.expectedTotalWithVatIncluded);
    })
  );

  test("returns total with vat included rounded to two decimals", () => {
    const unit = new PriceCalculator(6);

    const result = unit.calculateTotalWithVatIncluded(91.32, 5);

    expect(result).not.toBe(483.996);
    expect(result).toBe(484);
  });
});
