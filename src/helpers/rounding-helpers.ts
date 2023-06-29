export const roundToTwoDecimals = (value: number): number => {
  // I use a workaround from the stack overflow link below
  //   since there is a rounding error in some js engines
  //   that incorrectly rounds 1.005 etc down instead of up.
  // https://stackoverflow.com/questions/6134039/format-number-to-always-show-2-decimal-places
  return Number(Math.round(parseFloat(value + "e" + 2)) + "e-" + 2);
};
