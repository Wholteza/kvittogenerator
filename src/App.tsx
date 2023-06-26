import { ChangeEventHandler, useCallback, useState } from "react";
import "./App.css";
import { CellConfig, jsPDF, TextOptionsLight } from "jspdf";

const canvasSize = {
  y: { start: 0, end: 297 },
  x: { start: 0, end: 210 },
};

const footer = {
  height: 80,
};

type Identity = {
  Name: string;
  OrganizationNumber: string;
  VatNumber: string;
};

type Address = {
  Street: string;
  City: string;
  ZipCode: string;
};

type ContactInformation = {
  Phone: string;
  Email: string;
  Website: string;
};

type PaymentInformation = {
  Bankgiro: string;
  Plusgiro: string;
  Swift: string;
  Iban: string;
};

type CompanyInformation = {
  Identity: Identity;
  Address: Address;
  ContactInformation: ContactInformation;
  PaymentInformation: PaymentInformation;
};

const testCompanyInformation: CompanyInformation = {
  Identity: {
    Name: "Arst Arstsson",
    OrganizationNumber: "0000000000",
    VatNumber: "000000",
  },
  ContactInformation: {
    Email: "test@example.org",
    Phone: "0700000000",
    Website: "example.org",
  },
  Address: {
    City: "Testy",
    Street: "Testenton st. 12",
    ZipCode: "00000",
  },
  PaymentInformation: {
    Bankgiro: "0000-000",
    Plusgiro: "0000-000",
    Iban: "0000000",
    Swift: "0000000",
  },
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
  options?: TextOptionsLight;
};

type ReceiptRow = {
  date: string;
  description: string;
  amount: string;
  pricePerPiece: string;
  total: string;
  vatPercentage: string;
  vat: string;
};

const createReceiptRow = (
  date: string,
  description: string,
  amount: string,
  pricePerPiece: string,
  total: string,
  vatPercentage: string,
  vat: string
): ReceiptRow => ({
  date,
  description,
  amount,
  pricePerPiece,
  total,
  vatPercentage,
  vat,
});

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
const App = () => {
  const [companyInformation] = useState<CompanyInformation>(
    testCompanyInformation
  );
  const [customerInformation] = useState<CompanyInformation>(
    testCompanyInformation
  );

  const [file, setFile] = useState<File>();

  const onFileSelected: ChangeEventHandler<HTMLInputElement> = (event) => {
    console.warn(event);
    const file = event.target?.files?.[0];
    if (!file) return;
    setFile(file);
  };

  const generatePdf = useCallback(async () => {
    const doc = new jsPDF();

    // logotype, break out
    const data = (await file?.stream().getReader().read())?.value ?? undefined;
    if (data) doc.addImage(data, "png", doc.canvas.width, 10, 50, 50);

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

        doc.text(textRow.text, textRow.x, y);

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
      { text: `Datum 2023-01-01`, x: columns.left, type: "footer" },
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
        text: companyInformation.Identity.Name,
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
        text: `${customerInformation.Address.Street}`,
        x: columns.right.left,
        type: "body",
      },
    ]);
    writeOnNewLine(
      [
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
        text: "Kontantbetalning",
        x: columns.left,
        type: "body",
      },
      {
        text: "A1",
        x: columns.right.left,
        type: "body",
      },
    ]);

    const receiptRows = [
      createReceiptRow(
        "2023-01-01",
        "Massage 60 min",
        "2",
        "200,00",
        "400,00",
        "25%",
        "10,00"
      ),
      createReceiptRow(
        "2023-01-01",
        "Massage 60 min",
        "2",
        "200,00",
        "400,00",
        "25%",
        "10,00"
      ),
      createReceiptRow(
        "2023-01-01",
        "Massage 60 min",
        "2",
        "200,00",
        "400,00",
        "25%",
        "10,00"
      ),
      createReceiptRow(
        "2023-01-01",
        "Massage 60 min",
        "2",
        "200,00",
        "400,00",
        "25%",
        "10,00"
      ),
      createReceiptRow(
        "2023-01-01",
        "Massage 60 min",
        "2",
        "200,00",
        "400,00",
        "25%",
        "10,00"
      ),
      createReceiptRow(
        "2023-01-01",
        "Massage 60 min",
        "2",
        "200,00",
        "400,00",
        "25%",
        "10,00"
      ),
      createReceiptRow(
        "2023-01-01",
        "Massage 60 min",
        "2",
        "200,00",
        "400,00",
        "25%",
        "10,00"
      ),
      createReceiptRow(
        "2023-01-01",
        "Massage 60 min",
        "2",
        "200,00",
        "400,00",
        "25%",
        "10,00"
      ),
      createReceiptRow(
        "2023-01-01",
        "Massage 60 min",
        "2",
        "200,00",
        "400,00",
        "25%",
        "10,00"
      ),
    ];

    doc.setLineHeightFactor(1);
    doc.table(columns.table.articleNumber, y, receiptRows, tableHeaders, {
      headerBackgroundColor: "black",
      headerTextColor: "white",
      fontSize: fontSizes.table,
    });
    doc.setFontSize(fontSizes.body);
    doc.setLineHeightFactor(1);

    // recalc y based on table height, modulus a4 height to get size relative to page break
    y = (y + (receiptRows.length + 1) * doc.getLineHeight()) % canvasSize.y.end;

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
        text: "123,00",
        x: columns.total.left.right,
        type: "footer",
      },
    ]);
    writeOnNewLine([
      {
        text: "Moms 12%",
        x: columns.total.left.left,
        type: "footer",
      },
      {
        text: "",
        x: columns.total.left.right,
        type: "footer",
      },
    ]);
    writeOnNewLine([
      {
        text: "Moms 6%",
        x: columns.total.left.left,
        type: "footer",
      },
      {
        text: "",
        x: columns.total.left.right,
        type: "footer",
      },
      {
        text: "Belopp före moms",
        x: columns.total.right.left,
        type: "footer",
      },
      { text: "123,00", x: columns.total.right.right, type: "footer" },
    ]);
    writeOnNewLine([
      {
        text: "Momsfritt",
        x: columns.total.left.left,
        type: "footer",
      },
      {
        text: "",
        x: columns.total.left.right,
        type: "footer",
      },
      {
        text: "Total moms",
        x: columns.total.right.left,
        type: "footer",
      },
      { text: "123,00", x: columns.total.right.right, type: "footer" },
    ]);

    writeOnNewLine([]);

    writeOnNewLine([
      {
        text: "Att betala (SEK)",
        x: columns.total.right.left,
        type: "footer",
      },
      { text: "123,00", x: columns.total.right.right, type: "footer" },
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
      {
        text: `Plusgiro: ${companyInformation.PaymentInformation.Plusgiro}`,
        x: columns.footer.right,
        type: "footer",
      },
    ]);

    writeOnNewLine([
      {
        text: `E-post: ${companyInformation.ContactInformation.Email}`,
        x: columns.footer.left,
        type: "footer",
      },
      {
        text: `SWIFT: ${companyInformation.PaymentInformation.Swift}`,
        x: columns.footer.center,
        type: "footer",
      },
    ]);

    writeOnNewLine([
      {
        text: `IBAN: ${companyInformation.PaymentInformation.Iban}`,
        x: columns.footer.center,
        type: "footer",
      },
    ]);

    doc.save("a4.pdf");
  }, [
    companyInformation.ContactInformation.Email,
    companyInformation.ContactInformation.Phone,
    companyInformation.ContactInformation.Website,
    companyInformation.Identity.Name,
    companyInformation.Identity.OrganizationNumber,
    companyInformation.Identity.VatNumber,
    companyInformation.PaymentInformation.Bankgiro,
    companyInformation.PaymentInformation.Iban,
    companyInformation.PaymentInformation.Plusgiro,
    companyInformation.PaymentInformation.Swift,
    customerInformation.Address.City,
    customerInformation.Address.Street,
    customerInformation.Address.ZipCode,
    customerInformation.Identity.Name,
    customerInformation.Identity.OrganizationNumber,
    file,
  ]);

  return (
    <>
      <div key="1" style={{ marginBottom: 20 }}>
        Company: {JSON.stringify(companyInformation)}
      </div>
      <div key="2">Customer: {JSON.stringify(companyInformation)}</div>
      <button onClick={generatePdf}>generate pdf</button>
      <input type="file" onChange={onFileSelected}></input>
      <div>{file?.name}</div>
    </>
  );
};

export default App;
