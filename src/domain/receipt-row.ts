import { PriceCalculator } from "./price-calculator";

export type ReceiptRowFormModel = {
  date: Date;
  description: string;
  amount: number;
  pricePerPieceVatIncluded: number;
  vatPercentage: number;
};

export class ReceiptRow {
  public date = new Date(Date.now());
  public description = "";
  public amount = 0;
  public pricePerPieceVatExcluded = 0;
  public totalWithVatIncluded = 0;
  public vatPercentage = 0;
  public vatPerPiece = 0;

  // Hide constructor to enforce use of factory method
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static fromFormModel = (formModel: ReceiptRowFormModel) => {
    const row = new ReceiptRow();

    row.date = formModel.date;
    row.description = formModel.description;
    row.amount = formModel.amount;
    row.vatPercentage = formModel.vatPercentage;

    const priceCalculator = new PriceCalculator(row.vatPercentage);

    row.pricePerPieceVatExcluded = priceCalculator.getPriceWithoutVat(
      formModel.pricePerPieceVatIncluded
    );

    row.totalWithVatIncluded = priceCalculator.calculateTotalWithVatIncluded(
      row.pricePerPieceVatExcluded,
      row.amount
    );

    row.vatPerPiece = priceCalculator.calculateVat(
      row.pricePerPieceVatExcluded
    );

    return row;
  };
}

export type ReceiptRowViewModel = {
  date: string;
  description: string;
  amount: string;
  pricePerPiece: string;
  total: string;
  vatPercentage: string;
  vat: string;
};
