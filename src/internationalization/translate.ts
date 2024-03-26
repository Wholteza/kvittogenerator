const translate = (key: string): string => dictionary.sv[key] ?? key;

export default translate;

export const dictionary: { [key: string]: { [key: string]: string } } = {
  sv: {
    OrganizationNumber: "Organisation-/Personnummer",
    Name: "Namn",
    Phone: "Telefonnummer",
    City: "Stad",
    Street: "Gatuadress",
    ZipCode: "Postnummer",
    VatNumber: "Momsnummer",
    Email: "E-postadress",
    Website: "Webbsida",
    Bankgiro: "Bankgiro",
    number: "Nummer",
    paymentTerms: "Betalningsvilkor",
    date: "Datum",
    amount: "Antal",
    description: "Beskrivning",
    pricePerPiece: "À-pris (inkl. moms)",
    pricePerPieceVatIncluded: "À-pris (inkl. moms)",
    vatPercentage: "Moms %",
    vat: "Moms (SEK)",
    total: "Total (inkl. moms)",
    receiptNumber: "Kvittonummer",
  },
};
