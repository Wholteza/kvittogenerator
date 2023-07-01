import { toTwoDecimalString } from "../helpers/price-helpers";
import { ReceiptRow } from "./receipt-row";

export const calculateReceiptTotal = (
  receiptRows: ReceiptRow[]
): RecieptTotalInformation => {
  const vat25 = getSumOfVatFromItemsWithSpecificVatPercentage(receiptRows, 25);
  const vat12 = getSumOfVatFromItemsWithSpecificVatPercentage(receiptRows, 12);
  const vat6 = getSumOfVatFromItemsWithSpecificVatPercentage(receiptRows, 6);

  const totalVatFreeAmount = receiptRows
    .filter((row) => row.vatPercentage === 0)
    .reduce(
      (total, current) =>
        total + current.amount * current.pricePerPieceVatExcluded,
      0
    );

  const totalBeforeVat = receiptRows.reduce(
    (total, current) =>
      total + current.amount * current.pricePerPieceVatExcluded,
    0
  );

  const totalVat = receiptRows.reduce(
    (total, current) => total + current.amount * current.vatPerPiece,
    0
  );

  const total = receiptRows.reduce(
    (total, current) => total + current.totalWithVatIncluded,
    0
  );

  return {
    vat25,
    vat12,
    vat6,
    totalVatFreeAmount,
    totalBeforeVat,
    totalVat,
    total,
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

export type RecieptTotalInformationViewModel = {
  vat25: string;
  vat12: string;
  vat6: string;
  totalVatFreeAmount: string;
  totalBeforeVat: string;
  totalVat: string;
  total: string;
  unit: string;
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

export const toReceiptTotalViewModel = (
  receiptTotal: RecieptTotalInformation,
  unit: string
): RecieptTotalInformationViewModel => {
  if (!unit.length) throw new Error("unit cannot be an empty string");
  return {
    vat25: toTwoDecimalString(receiptTotal.vat25),
    vat12: toTwoDecimalString(receiptTotal.vat12),
    vat6: toTwoDecimalString(receiptTotal.vat6),
    totalVatFreeAmount: toTwoDecimalString(receiptTotal.totalVatFreeAmount),
    totalBeforeVat: toTwoDecimalString(receiptTotal.totalBeforeVat),
    totalVat: toTwoDecimalString(receiptTotal.totalVat),
    total: toTwoDecimalString(receiptTotal.total),
    unit,
  };
};
