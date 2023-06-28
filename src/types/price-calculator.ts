export class PriceCalculator {
  public vatPercentage: number;

  public constructor(vatPercentage: number) {
    // TODO: Make sure to throw if vat is a decimal value and write a test for it

    // TODO: make sure that the user cannot input values less than 0
    if (vatPercentage < 0)
      throw new Error("Argument vatPercentage must be 0 or greater");
    this.vatPercentage = vatPercentage;
  }

  public getPriceWithoutVat(priceWithVat: number) {
    return this.roundToTwoDecimals(
      priceWithVat / this.getVatMultiplierFromPercentage()
    );
  }

  public getPriceWithVat(priceWithoutVat: number) {
    return this.roundToTwoDecimals(
      priceWithoutVat * this.getVatMultiplierFromPercentage()
    );
  }

  public getVatMultiplierFromPercentage() {
    if (this.vatPercentage === 0) return 1;
    return this.roundToTwoDecimals(1 + parseFloat(this.vatPercentage + "e-2"));
  }

  public calculateVat(pricePerPieceVatExcluded: number) {
    return this.roundToTwoDecimals(
      this.getPriceWithVat(pricePerPieceVatExcluded) - pricePerPieceVatExcluded
    );
  }

  public calculateTotalWithVatIncluded(
    pricePerPieceVatExcluded: number,
    amount: number
  ) {
    return this.roundToTwoDecimals(
      this.getPriceWithVat(pricePerPieceVatExcluded) * amount
    );
  }

  public roundToTwoDecimals(value: number): number {
    // I use a workaround from the stack overflow link below
    //   since there is a rounding error in some js engines
    //   that incorrectly rounds 1.005 etc down instead of up.
    // https://stackoverflow.com/questions/6134039/format-number-to-always-show-2-decimal-places
    return Number(Math.round(parseFloat(value + "e" + 2)) + "e-" + 2);
  }
}
