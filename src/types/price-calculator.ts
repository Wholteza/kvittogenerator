import { roundToTwoDecimals } from "../helpers/rounding-helpers";

export class VatIsDecimalValueError extends Error {}

export class PriceCalculator {
  public vatPercentage: number;

  public constructor(vatPercentage: number) {
    // TODO: Make sure that the user cannot input values with decimals
    const vatPercentageIsADecimal = vatPercentage.toString().includes(".");
    if (vatPercentageIsADecimal) throw new VatIsDecimalValueError();

    // TODO: make sure that the user cannot input values less than 0
    if (vatPercentage < 0)
      throw new Error("Argument vatPercentage must be 0 or greater");
    this.vatPercentage = vatPercentage;
  }

  public getPriceWithoutVat(priceWithVat: number) {
    return roundToTwoDecimals(
      priceWithVat / this.getVatMultiplierFromPercentage()
    );
  }

  public getPriceWithVat(priceWithoutVat: number) {
    return roundToTwoDecimals(
      priceWithoutVat * this.getVatMultiplierFromPercentage()
    );
  }

  public getVatMultiplierFromPercentage() {
    if (this.vatPercentage === 0) return 1;
    return roundToTwoDecimals(1 + parseFloat(this.vatPercentage + "e-2"));
  }

  public calculateVat(pricePerPieceVatExcluded: number) {
    return roundToTwoDecimals(
      this.getPriceWithVat(pricePerPieceVatExcluded) - pricePerPieceVatExcluded
    );
  }

  public calculateTotalWithVatIncluded(
    pricePerPieceVatExcluded: number,
    amount: number
  ) {
    return roundToTwoDecimals(
      this.getPriceWithVat(pricePerPieceVatExcluded) * amount
    );
  }
}
