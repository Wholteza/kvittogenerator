import { ReceiptRow } from "./receipt-row";

export const calculateReceiptTotal = (
  receiptRows: ReceiptRow[]
): RecieptTotalInformation => {
  const vat25 = getSumOfVatFromItemsWithSpecificVatPercentage(receiptRows, 25);
  const vat12 = getSumOfVatFromItemsWithSpecificVatPercentage(receiptRows, 12);
  const vat6 = getSumOfVatFromItemsWithSpecificVatPercentage(receiptRows, 6);

  return {
    vat25,
    vat12,
    vat6,
    totalVatFreeAmount: 0,
    totalBeforeVat: 0,
    totalVat: 0,
    total: 0,
  };
};

export type RecieptTotalInformation = {
  vat25: number;
  vat12: number;
  vat6: number;
  totalVatFreeAmount: number;
  totalBeforeVat: number;
  totalVat: number;
  total: number;
};

export const getSumOfVatFromItemsWithSpecificVatPercentage = (
  receiptRows: ReceiptRow[],
  vatPercentage: number
): number => {
  return receiptRows
    .filter((item) => item.vatPercentage === vatPercentage)
    .reduce(
      (sum, currentItem) => sum + currentItem.vatPerPiece * currentItem.amount,
      0
    );
};
