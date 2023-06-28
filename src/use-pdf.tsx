import { useCallback } from "react";
import { CellConfig, jsPDF, TextOptionsLight } from "jspdf";
import {
  CompanyInformation,
  CustomerInformation,
  ReceiptInformation,
  RecieptTotalInformation,
} from "./types";

const canvasSize = {
  y: { start: 0, end: 297 },
  x: { start: 0, end: 210 },
};

const footer = {
  height: 80,
};

const columns = {
  left: 10,
  right: {
    left: 90,
    right: 130,
  },
  table: {
    articleNumber: 10,
  },
  total: {
    left: {
      left: 10,
      right: 80,
    },
    right: {
      left: 110,
      right: 180,
    },
  },
  footer: {
    left: 10,
    center: 80,
    right: 150,
  },
};

const rows = {
  title: 20,
  date: 30,
  aboveTable: 50,
};

const fontSizes = {
  body: 10,
  title: 46,
  subtitle: 14,
  footer: 10,
  table: 8,
} as const;

const lineHeightFactors = {
  body: 0.5,
  title: 2,
  subtitle: 0.5,
  footer: 0.5,
} as const;

type PdfText = {
  text: string;
  x: number;
  color?: "black" | "white";
  type?: "body" | "title" | "subtitle" | "footer";
  align?: "left" | "right";
  options?: TextOptionsLight;
};

export type ReceiptRow = {
  date: string;
  description: string;
  amount: string;
  pricePerPiece: string;
  total: string;
  vatPercentage: string;
  vat: string;
};

const tableHeaders: CellConfig[] = [
  {
    name: "date",
    prompt: "Datum",
    align: "left",
    padding: 0,
    width: 35,
  },
  {
    name: "description",
    prompt: "Beskrivning",
    align: "left",
    padding: 0,
    width: 83,
  },
  {
    name: "amount",
    prompt: "Antal",
    align: "left",
    padding: 0,
    width: 20,
  },
  {
    name: "pricePerPiece",
    prompt: "À-pris",
    align: "left",
    padding: 0,
    width: 28,
  },
  {
    name: "vatPercentage",
    prompt: "Moms %",
    align: "left",
    padding: 0,
    width: 20,
  },
  {
    name: "vat",
    prompt: "Moms",
    align: "left",
    padding: 0,
    width: 20,
  },
  {
    name: "total",
    prompt: "Belopp (SEK)",
    align: "left",
    padding: 0,
    width: 45,
  },
];

const DefaultTextColor = "black";
const usePdf = () => {
  const generatePdf = useCallback(
    async (
      companyInformation: CompanyInformation,
      customerInformation: CustomerInformation,
      logotype: string,
      receiptInformation: ReceiptInformation,
      receiptRows: ReceiptRow[],
      receiptTotalInformation: RecieptTotalInformation
    ) => {
      const doc = new jsPDF();

      // logotype, break out
      if (logotype.length)
        doc.addImage(logotype, "png", doc.canvas.width, 10, 50, 50);

      const writeOnNewLine = (
        textRows: PdfText[],
        customMarginBottom?: number
      ) => {
        textRows.forEach((textRow) => {
          const lineHeightFactorToRestore = doc.getLineHeightFactor();

          doc.setTextColor(textRow.color ?? DefaultTextColor);
          doc.setFontSize(
            textRow.type ? fontSizes[textRow.type] : fontSizes.body
          );
          doc.setLineHeightFactor(
            textRow.type
              ? lineHeightFactors[textRow.type]
              : lineHeightFactorToRestore
          );

          doc.text(textRow.text, textRow.x, y, {
            align: textRow.align ?? "left",
          });

          doc.setTextColor(DefaultTextColor);
          doc.setFontSize(fontSizes.body);
        });
        y += customMarginBottom ?? doc.getLineHeight();
      };
      const drawLineOnNewLine = () => {
        const lineHeight = doc.getLineHeightFactor();
        doc.setLineHeightFactor(1);
        doc.line(canvasSize.x.start + 10, y, canvasSize.x.end - 10, y);
        y += doc.getLineHeight();
        doc.setLineHeightFactor(lineHeight);
      };

      let y = rows.title;
      writeOnNewLine([{ text: "Kvitto", x: columns.left, type: "title" }]);

      y = rows.date;
      writeOnNewLine([
        {
          text: `Datum ${Intl.DateTimeFormat("sv-SE").format(
            new Date(receiptInformation.date)
          )}`,
          x: columns.left,
          type: "footer",
        },
      ]);

      y = rows.aboveTable;
      writeOnNewLine([
        {
          text: "Företag",
          x: columns.left,
          type: "subtitle",
        },
        {
          text: "Kund",
          x: columns.right.left,
          type: "subtitle",
        },
      ]);
      writeOnNewLine([
        {
          text: `${companyInformation.Identity.Name} (${companyInformation.Identity.OrganizationNumber})`,
          x: columns.left,
          type: "body",
        },

        {
          text: `${customerInformation.Identity.Name} (${customerInformation.Identity.OrganizationNumber})`,
          x: columns.right.left,
          type: "body",
        },
      ]);
      writeOnNewLine([
        {
          text: `${companyInformation.Address.Street}`,
          x: columns.left,
          type: "body",
        },
        {
          text: `${customerInformation.Address.Street}`,
          x: columns.right.left,
          type: "body",
        },
      ]);
      writeOnNewLine(
        [
          {
            text: `${companyInformation.Address.ZipCode} ${companyInformation.Address.City}`,
            x: columns.left,
            type: "body",
          },
          {
            text: `${customerInformation.Address.ZipCode} ${customerInformation.Address.City}`,
            x: columns.right.left,
            type: "body",
          },
        ],
        10
      );
      writeOnNewLine([
        {
          text: "Betalningsvilkor",
          x: columns.left,
          type: "subtitle",
        },
        {
          text: "Kvittonummer",
          x: columns.right.left,
          type: "subtitle",
        },
      ]);
      writeOnNewLine([
        {
          text: receiptInformation.paymentTerms,
          x: columns.left,
          type: "body",
        },
        {
          text: receiptInformation.number,
          x: columns.right.left,
          type: "body",
        },
      ]);

      doc.setLineHeightFactor(1);
      doc.table(columns.table.articleNumber, y, receiptRows, tableHeaders, {
        headerBackgroundColor: "black",
        headerTextColor: "white",
        fontSize: fontSizes.table,
      });
      doc.setFontSize(fontSizes.body);
      doc.setLineHeightFactor(1);

      // recalc y based on table height, modulus a4 height to get size relative to page break
      y =
        (y + (receiptRows.length + 1) * doc.getLineHeight()) % canvasSize.y.end;

      // Figure out if we need to add another page
      const needToInsertNewPage = canvasSize.y.end - y < footer.height;
      if (needToInsertNewPage) {
        doc.addPage();
        y = 10;
      }

      // create method for writing row

      doc.setLineHeightFactor(0.5);
      // draw line to separate footer from content
      drawLineOnNewLine();
      // print out total information

      writeOnNewLine([
        {
          text: "Momsunderlag",
          x: columns.total.left.left,
          type: "footer",
        },
      ]);
      writeOnNewLine([
        {
          text: "Moms 25%",
          x: columns.total.left.left,
          type: "footer",
        },
        {
          text: `${receiptTotalInformation.vat25} kr`,
          x: columns.total.left.right,
          type: "footer",
          align: "right",
        },
      ]);
      writeOnNewLine([
        {
          text: "Moms 12%",
          x: columns.total.left.left,
          type: "footer",
        },
        {
          text: `${receiptTotalInformation.vat12} kr`,
          x: columns.total.left.right,
          type: "footer",
          align: "right",
        },
      ]);
      writeOnNewLine([
        {
          text: "Moms 6%",
          x: columns.total.left.left,
          type: "footer",
        },
        {
          text: `${receiptTotalInformation.vat6} kr`,
          x: columns.total.left.right,
          type: "footer",
          align: "right",
        },
        {
          text: "Belopp före moms",
          x: columns.total.right.left,
          type: "footer",
        },
        {
          text: `${receiptTotalInformation.totalBeforeVat} kr`,
          x: columns.total.right.right,
          type: "footer",
          align: "right",
        },
      ]);
      writeOnNewLine([
        {
          text: "Momsfritt",
          x: columns.total.left.left,
          type: "footer",
        },
        {
          text: `${receiptTotalInformation.vat0} kr`,
          x: columns.total.left.right,
          type: "footer",
          align: "right",
        },
        {
          text: "Total moms",
          x: columns.total.right.left,
          type: "footer",
        },
        {
          text: `${receiptTotalInformation.totalVat} kr`,
          x: columns.total.right.right,
          type: "footer",
          align: "right",
        },
      ]);

      writeOnNewLine([]);

      writeOnNewLine([
        {
          text: "Att betala (SEK)",
          x: columns.total.right.left,
          type: "footer",
        },
        {
          text: `${receiptTotalInformation.total} kr`,
          x: columns.total.right.right,
          type: "footer",
          align: "right",
        },
      ]);

      // print out footer information
      drawLineOnNewLine();

      writeOnNewLine([
        {
          text: `Tel.nr: ${companyInformation.ContactInformation.Phone}`,
          x: columns.footer.left,
          type: "footer",
        },
        {
          text: `Org.nr: ${companyInformation.Identity.OrganizationNumber}`,
          x: columns.footer.center,
          type: "footer",
        },
        {
          text: `Bankgiro: ${companyInformation.PaymentInformation.Bankgiro}`,
          x: columns.footer.right,
          type: "footer",
        },
      ]);

      writeOnNewLine([
        {
          text: `Webb: ${companyInformation.ContactInformation.Website}`,
          x: columns.footer.left,
          type: "footer",
        },
        {
          text: `VAT.nr: ${companyInformation.Identity.VatNumber}`,
          x: columns.footer.center,
          type: "footer",
        },
      ]);

      writeOnNewLine([
        {
          text: `E-post: ${companyInformation.ContactInformation.Email}`,
          x: columns.footer.left,
          type: "footer",
        },
      ]);

      doc.save("kvitto.pdf");
    },
    []
  );
  return { generatePdf };
};

export default usePdf;
