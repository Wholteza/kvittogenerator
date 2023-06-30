import { PriceCalculator } from "./price-calculator";
import { ReceiptRow, ReceiptRowFormModel } from "./receipt-row";
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
