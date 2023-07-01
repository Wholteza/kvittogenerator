import { afterEach, describe, expect, jest, test } from "@jest/globals";
import * as unitModule from "./receipt-total";
import { ReceiptRow } from "./receipt-row";
import * as priceHelpers from "../helpers/price-helpers";

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
    const item1 = generateValidReceiptRow();
    item1.vatPercentage = 0;
    item1.amount = 5;
    item1.pricePerPieceVatExcluded = 38;

    const item2 = generateValidReceiptRow();
    item2.vatPercentage = 25;
    item2.pricePerPieceVatExcluded = 1000;

    const result = unitModule.calculateReceiptTotal([item1, item2]);

    expect(result.totalVatFreeAmount).toBe(
      item1.pricePerPieceVatExcluded * item1.amount
    );
  });
  test("total before vat is the total from all items before vat", () => {
    const item1 = generateValidReceiptRow();
    item1.amount = 1;
    item1.pricePerPieceVatExcluded = 1;
    const item2 = generateValidReceiptRow();
    item2.amount = 2;
    item2.pricePerPieceVatExcluded = 2;
    const item3 = generateValidReceiptRow();
    item3.amount = 5;
    item3.pricePerPieceVatExcluded = 5;

    const result = unitModule.calculateReceiptTotal([item1, item2, item3]);

    expect(result.totalBeforeVat).toBe(
      item1.amount * item1.pricePerPieceVatExcluded +
        item2.amount * item2.pricePerPieceVatExcluded +
        item3.amount * item3.pricePerPieceVatExcluded
    );
  });
  test("total vat is the vat from all the items", () => {
    const item1 = generateValidReceiptRow();
    item1.amount = 1;
    item1.vatPerPiece = 1;
    const item2 = generateValidReceiptRow();
    item2.amount = 2;
    item2.vatPerPiece = 2;
    const item3 = generateValidReceiptRow();
    item3.amount = 5;
    item3.vatPerPiece = 5;

    const result = unitModule.calculateReceiptTotal([item1, item2, item3]);

    expect(result.totalVat).toBe(
      item1.amount * item1.vatPerPiece +
        item2.amount * item2.vatPerPiece +
        item3.amount * item3.vatPerPiece
    );
  });

  test("total is the total with vat included from all the items", () => {
    const item1 = generateValidReceiptRow();
    item1.totalWithVatIncluded = 1;
    const item2 = generateValidReceiptRow();
    item2.totalWithVatIncluded = 2;
    const item3 = generateValidReceiptRow();
    item3.totalWithVatIncluded = 5;

    const result = unitModule.calculateReceiptTotal([item1, item2, item3]);

    expect(result.total).toBe(
      item1.totalWithVatIncluded +
        item2.totalWithVatIncluded +
        item3.totalWithVatIncluded
    );
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

const getValidReceiptTotalInformation =
  (): unitModule.RecieptTotalInformation => ({
    vat25: 1,
    vat12: 0,
    vat6: 0,
    totalVatFreeAmount: 0,
    totalBeforeVat: 100,
    totalVat: 1,
    total: 101,
  });

describe("toReceiptTotalViewModel", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  const testFacts: {
    total: number;
    roundedToTwoDecimalsAsString: string;
  }[] = [
    {
      total: 25,
      roundedToTwoDecimalsAsString: "25.00",
    },
    {
      total: 25.5,
      roundedToTwoDecimalsAsString: "25.50",
    },
    {
      total: 25.55,
      roundedToTwoDecimalsAsString: "25.55",
    },
    {
      total: 25.555,
      roundedToTwoDecimalsAsString: "25.56",
    },
    {
      total: 25.545,
      roundedToTwoDecimalsAsString: "25.55",
    },
  ];

  testFacts.forEach((fact) =>
    test("vat25 is mapped to string with two decimals returned from helper method", () => {
      const input = getValidReceiptTotalInformation();
      input.vat25 = fact.total;

      const toTwoDecimalStringSpy = jest
        .spyOn(priceHelpers, "toTwoDecimalString")
        .mockReturnValue(fact.roundedToTwoDecimalsAsString);

      const result = unitModule.toReceiptTotalViewModel(input, "unit");

      expect(toTwoDecimalStringSpy).toHaveBeenCalledWith(fact.total);
      expect(result.vat25).toBe(fact.roundedToTwoDecimalsAsString);
    })
  );

  testFacts.forEach((fact) =>
    test("vat12 is mapped to string with two decimals returned from helper method", () => {
      const input = getValidReceiptTotalInformation();
      input.vat12 = fact.total;

      const toTwoDecimalStringSpy = jest
        .spyOn(priceHelpers, "toTwoDecimalString")
        .mockReturnValue(fact.roundedToTwoDecimalsAsString);

      const result = unitModule.toReceiptTotalViewModel(input, "unit");

      expect(toTwoDecimalStringSpy).toHaveBeenCalledWith(fact.total);
      expect(result.vat12).toBe(fact.roundedToTwoDecimalsAsString);
    })
  );

  testFacts.forEach((fact) =>
    test("vat6 is mapped to string with two decimals returned from helper method", () => {
      const input = getValidReceiptTotalInformation();
      input.vat6 = fact.total;

      const toTwoDecimalStringSpy = jest
        .spyOn(priceHelpers, "toTwoDecimalString")
        .mockReturnValue(fact.roundedToTwoDecimalsAsString);

      const result = unitModule.toReceiptTotalViewModel(input, "unit");

      expect(toTwoDecimalStringSpy).toHaveBeenCalledWith(fact.total);
      expect(result.vat6).toBe(fact.roundedToTwoDecimalsAsString);
    })
  );

  testFacts.forEach((fact) =>
    test("totalVatFreeAmount is mapped to string with two decimals returned from helper method", () => {
      const input = getValidReceiptTotalInformation();
      input.totalVatFreeAmount = fact.total;

      const toTwoDecimalStringSpy = jest
        .spyOn(priceHelpers, "toTwoDecimalString")
        .mockReturnValue(fact.roundedToTwoDecimalsAsString);

      const result = unitModule.toReceiptTotalViewModel(input, "unit");

      expect(toTwoDecimalStringSpy).toHaveBeenCalledWith(fact.total);
      expect(result.totalVatFreeAmount).toBe(fact.roundedToTwoDecimalsAsString);
    })
  );

  testFacts.forEach((fact) =>
    test("totalBeforeVat is mapped to string with two decimals returned from helper method", () => {
      const input = getValidReceiptTotalInformation();
      input.totalBeforeVat = fact.total;

      const toTwoDecimalStringSpy = jest
        .spyOn(priceHelpers, "toTwoDecimalString")
        .mockReturnValue(fact.roundedToTwoDecimalsAsString);

      const result = unitModule.toReceiptTotalViewModel(input, "unit");

      expect(toTwoDecimalStringSpy).toHaveBeenCalledWith(fact.total);
      expect(result.totalBeforeVat).toBe(fact.roundedToTwoDecimalsAsString);
    })
  );

  testFacts.forEach((fact) =>
    test("totalVat is mapped to string with two decimals returned from helper method", () => {
      const input = getValidReceiptTotalInformation();
      input.totalVat = fact.total;

      const toTwoDecimalStringSpy = jest
        .spyOn(priceHelpers, "toTwoDecimalString")
        .mockReturnValue(fact.roundedToTwoDecimalsAsString);

      const result = unitModule.toReceiptTotalViewModel(input, "unit");

      expect(toTwoDecimalStringSpy).toHaveBeenCalledWith(fact.total);
      expect(result.totalVat).toBe(fact.roundedToTwoDecimalsAsString);
    })
  );

  testFacts.forEach((fact) =>
    test("total is mapped to string with two decimals returned from helper method", () => {
      const input = getValidReceiptTotalInformation();
      input.total = fact.total;

      const toTwoDecimalStringSpy = jest
        .spyOn(priceHelpers, "toTwoDecimalString")
        .mockReturnValue(fact.roundedToTwoDecimalsAsString);

      const result = unitModule.toReceiptTotalViewModel(input, "unit");

      expect(toTwoDecimalStringSpy).toHaveBeenCalledWith(fact.total);
      expect(result.total).toBe(fact.roundedToTwoDecimalsAsString);
    })
  );

  test("throws if unit is not set", () => {
    const unit = "";
    const action = () =>
      unitModule.toReceiptTotalViewModel(
        getValidReceiptTotalInformation(),
        unit
      );

    expect(action).toThrow();
  });

  test("unit is mapped to unit property if set", () => {
    const unit = "kr";

    const result = unitModule.toReceiptTotalViewModel(
      getValidReceiptTotalInformation(),
      unit
    );

    expect(result.unit).toBe(unit);
  });
});
