import { afterEach, describe, expect, jest, test } from "@jest/globals";
import * as unitModule from "./receipt-total";
import { ReceiptRow } from "./receipt-row";

const generateValidReceiptRow = (): ReceiptRow => ({
  amount: 1,
  date: new Date(Date.now()),
  description: "description",
  pricePerPieceVatExcluded: 100,
  totalWithVatIncluded: 125,
  vatPerPiece: 25,
  vatPercentage: 25,
});

describe("calculateReceiptTotal", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("vat25 is mapped to the return value of getSumOfVatFromItemsWithSpecificVatPercentage", () => {
    const inputThatDoesNotMatter = [generateValidReceiptRow()];
    const expectedVat = 1;
    const getSumOfVatFromItemsWithSpecificVatPercentageSpy = jest
      .spyOn(unitModule, "getSumOfVatFromItemsWithSpecificVatPercentage")
      .mockReturnValue(expectedVat);

    const result = unitModule.calculateReceiptTotal(inputThatDoesNotMatter);

    expect(result.vat25).toBe(expectedVat);
    expect(
      getSumOfVatFromItemsWithSpecificVatPercentageSpy
    ).toHaveBeenCalledWith(inputThatDoesNotMatter, 25);
  });

  test("vat12 is mapped to the return value of getSumOfVatFromItemsWithSpecificVatPercentage", () => {
    const inputThatDoesNotMatter = [generateValidReceiptRow()];
    const expectedVat = 1;
    const getSumOfVatFromItemsWithSpecificVatPercentageSpy = jest
      .spyOn(unitModule, "getSumOfVatFromItemsWithSpecificVatPercentage")
      .mockReturnValue(expectedVat);

    const result = unitModule.calculateReceiptTotal(inputThatDoesNotMatter);

    expect(result.vat12).toBe(expectedVat);
    expect(
      getSumOfVatFromItemsWithSpecificVatPercentageSpy
    ).toHaveBeenCalledWith(inputThatDoesNotMatter, 12);
  });

  test("vat6 is mapped to the return value of getSumOfVatFromItemsWithSpecificVatPercentage", () => {
    const inputThatDoesNotMatter = [generateValidReceiptRow()];
    const expectedVat = 1;
    const getSumOfVatFromItemsWithSpecificVatPercentageSpy = jest
      .spyOn(unitModule, "getSumOfVatFromItemsWithSpecificVatPercentage")
      .mockReturnValue(expectedVat);

    const result = unitModule.calculateReceiptTotal(inputThatDoesNotMatter);

    expect(result.vat6).toBe(expectedVat);
    expect(
      getSumOfVatFromItemsWithSpecificVatPercentageSpy
    ).toHaveBeenCalledWith(inputThatDoesNotMatter, 6);
  });

  test("totalVatFreeAmount is the total from all items with vatPercentage set to 0 ", () => {
    const inputThatDoesNotMatter = [generateValidReceiptRow()];
    const expectedVat = 1;
    const getSumOfVatFromItemsWithSpecificVatPercentageSpy = jest
      .spyOn(unitModule, "getSumOfVatFromItemsWithSpecificVatPercentage")
      .mockReturnValue(expectedVat);

    const result = unitModule.calculateReceiptTotal(inputThatDoesNotMatter);

    expect(result.totalVatFreeAmount).toBe(expectedVat);
    expect(
      getSumOfVatFromItemsWithSpecificVatPercentageSpy
    ).toHaveBeenCalledWith(inputThatDoesNotMatter, 0);
  });
  test("total before vat is being calculated incorrectly", () => {
    expect(true).toBeFalsy();
  });
  test("total vat is being calculated incorrectly", () => {
    expect(true).toBeFalsy();
  });
  test("different vats are being calculated incorrectly", () => {
    expect(true).toBeFalsy();
  });
  test("logic needs to be broken out and be testable", () => {
    expect(true).toBeFalsy();
  });
});

describe("getSumOfVatFromItemsWithSpecificVatPercentage", () => {
  test("returns the sum of vat from items with the specific vat percentage only", () => {
    const itemWith25VatPercentage = generateValidReceiptRow();
    itemWith25VatPercentage.vatPercentage = 25;
    itemWith25VatPercentage.vatPerPiece = 1;
    itemWith25VatPercentage.amount = 5;
    const itemWith12VatPercentage = generateValidReceiptRow();
    itemWith12VatPercentage.vatPercentage = 12;
    itemWith12VatPercentage.vatPerPiece = 1;
    itemWith12VatPercentage.amount = 10;
    const input = [itemWith12VatPercentage, itemWith25VatPercentage];
    const expectedVat =
      itemWith25VatPercentage.amount * itemWith25VatPercentage.vatPerPiece;

    const result = unitModule.getSumOfVatFromItemsWithSpecificVatPercentage(
      input,
      25
    );

    expect(result).toBe(expectedVat);
  });
});
