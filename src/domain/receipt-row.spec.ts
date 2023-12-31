import * as priceHelpersModule from "../helpers/price-helpers";
import { PriceCalculator } from "./price-calculator";
import { ReceiptRow, ReceiptRowFormModel, toViewModel } from "./receipt-row";
import { describe, expect, test, jest, afterEach } from "@jest/globals";
const ClassName = "ReceiptRow";

const getValidReceiptRowFormModel = (): ReceiptRowFormModel => ({
  amount: 1,
  date: new Date(Date.now()),
  description: "Massage 45 min",
  pricePerPieceVatIncluded: 435,
  vatPercentage: 25,
});

afterEach(() => {
  jest.restoreAllMocks();
});
describe(`${ClassName} - fromFormModal`, () => {
  test("maps date from view model", () => {
    const date = new Date("9999-09-09");
    const input = getValidReceiptRowFormModel();
    input.date = date;

    const result = ReceiptRow.fromFormModel(input);

    expect(result.date.toISOString()).toBe(date.toISOString());
  });

  test("maps description from view model", () => {
    const description = "Valid description!";
    const input = getValidReceiptRowFormModel();
    input.description = description;

    const result = ReceiptRow.fromFormModel(input);

    expect(result.description).toBe(description);
  });

  test("maps amount from view model", () => {
    const amount = 5;
    const input = getValidReceiptRowFormModel();
    input.amount = 5;

    const result = ReceiptRow.fromFormModel(input);

    expect(result.amount).toBe(amount);
  });

  test("maps vat percentage from view model", () => {
    const vatPercentage = 99;
    const input = getValidReceiptRowFormModel();
    input.vatPercentage = vatPercentage;

    const result = ReceiptRow.fromFormModel(input);

    expect(result.vatPercentage).toBe(vatPercentage);
  });

  test("sets price per piece vat excluded to value returned from price calculator", () => {
    const expected = 5;
    const input = getValidReceiptRowFormModel();
    const priceCalculatorSpy = jest
      .spyOn(PriceCalculator.prototype, "getPriceWithoutVat")
      .mockReturnValue(expected);

    const result = ReceiptRow.fromFormModel(input);

    expect(result.pricePerPieceVatExcluded).toBe(expected);
    expect(priceCalculatorSpy).toHaveBeenCalled();
  });

  test("sets total with vat included to value returned from price calculator", () => {
    const expected = 1;
    const input = getValidReceiptRowFormModel();
    const priceCalculatorSpy = jest
      .spyOn(PriceCalculator.prototype, "calculateTotalWithVatIncluded")
      .mockReturnValue(expected);

    const result = ReceiptRow.fromFormModel(input);

    expect(result.totalWithVatIncluded).toBe(expected);
    expect(priceCalculatorSpy).toHaveBeenCalled();
  });

  test("sets vat per piece to value returned from price calculator", () => {
    const expected = 1;
    const input = getValidReceiptRowFormModel();
    const priceCalculatorSpy = jest
      .spyOn(PriceCalculator.prototype, "calculateVat")
      .mockReturnValue(expected);

    const result = ReceiptRow.fromFormModel(input);

    expect(result.vatPerPiece).toBe(expected);
    expect(priceCalculatorSpy).toHaveBeenCalled();
  });
});

const getValidReceiptRow = (): ReceiptRow =>
  ReceiptRow.fromFormModel({
    amount: 1,
    date: new Date(Date.now()),
    description: "Massage 45 min",
    pricePerPieceVatIncluded: 435,
    vatPercentage: 25,
  });

describe("toViewModel", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  const numberFacts: { input: number; expected: string }[] = [
    { input: 25, expected: "25.00" },
    { input: 25.5, expected: "25.50" },
    { input: 25.55, expected: "25.55" },
    { input: 25.545, expected: "25.55" },
    { input: 25.555, expected: "25.56" },
  ];

  numberFacts.forEach((fact) =>
    test("vat is mapped to return value of toTwoDecimalString ", () => {
      const receiptRow = getValidReceiptRow();
      receiptRow.vatPerPiece = fact.input;
      const toTwoDecimalStringSpy = jest
        .spyOn(priceHelpersModule, "toTwoDecimalString")
        .mockReturnValue(fact.expected);

      const result = toViewModel(receiptRow);

      expect(toTwoDecimalStringSpy).toHaveBeenCalledWith(fact.input);
      expect(result.vat).toBe(fact.expected);
    })
  );

  numberFacts.forEach((fact) =>
    test("total is mapped to return value of toTwoDecimalString ", () => {
      const receiptRow = getValidReceiptRow();
      receiptRow.totalWithVatIncluded = fact.input;
      const toTwoDecimalStringSpy = jest
        .spyOn(priceHelpersModule, "toTwoDecimalString")
        .mockReturnValue(fact.expected);

      const result = toViewModel(receiptRow);

      expect(toTwoDecimalStringSpy).toHaveBeenCalledWith(fact.input);
      expect(result.total).toBe(fact.expected);
    })
  );

  numberFacts.forEach((fact) =>
    test("pricePerPiece is mapped to return value of toTwoDecimalString ", () => {
      const receiptRow = getValidReceiptRow();
      receiptRow.pricePerPieceVatExcluded = fact.input;
      const toTwoDecimalStringSpy = jest
        .spyOn(priceHelpersModule, "toTwoDecimalString")
        .mockReturnValue(fact.expected);

      const result = toViewModel(receiptRow);

      expect(toTwoDecimalStringSpy).toHaveBeenCalledWith(fact.input);
      expect(result.pricePerPiece).toBe(fact.expected);
    })
  );

  test("amount is mapped to the input value as string ", () => {
    const input = 5;
    const expected = "5";
    const receiptRow = getValidReceiptRow();
    receiptRow.amount = input;

    const result = toViewModel(receiptRow);

    expect(result.amount).toBe(expected);
  });

  test("description is mapped to the input value ", () => {
    const input = "My Description";
    const receiptRow = getValidReceiptRow();
    receiptRow.description = input;

    const result = toViewModel(receiptRow);

    expect(result.description).toBe(input);
  });

  test("vatPercentage is mapped to the input value as string ", () => {
    const input = 25;
    const expected = "25";
    const receiptRow = getValidReceiptRow();
    receiptRow.vatPercentage = input;

    const result = toViewModel(receiptRow);

    expect(result.vatPercentage).toBe(expected);
  });

  test("vatPercentage is mapped to the input value as string ", () => {
    const input = new Date("2025-05-05");
    const expected = "2025-05-05";
    const receiptRow = getValidReceiptRow();
    receiptRow.date = input;

    const result = toViewModel(receiptRow);

    expect(result.date).toBe(expected);
  });
});
