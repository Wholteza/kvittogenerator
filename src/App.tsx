import { ChangeEventHandler, useCallback, useState } from "react";
import "./App.css";
import { CellConfig, jsPDF, TextOptionsLight } from "jspdf";

const canvasSize = {
  y: { start: 0, end: 297 },
  x: { start: 0, end: 210 },
};

const footer = {
  height: 60,
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
  leftMain: 10,
  rightMain: {
    left: 90,
    middle: 120,
    right: 170,
  },
  table: {
    articleNumber: 12,
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
  title: 10,
  recieptNumber: 20,
  company: 50,
  paymentTerms: 90,
  tableHead: 130,
};

const getNextRow = (ySpacing: number, multiplier = 1): number =>
  ySpacing + 10 * multiplier;

type PdfText = {
  text: string;
  x: number;
  y: number;
  color?: "black" | "white";
  options?: TextOptionsLight;
};

type ReceiptRow = {
  articleNumber: string;
  description: string;
  amount: string;
  pricePerPiece: string;
  total: string;
};

const createReceiptRow = (
  articleNumber: string,
  description: string,
  amount: string,
  pricePerPiece: string,
  total: string
): ReceiptRow => ({
  articleNumber,
  description,
  amount,
  pricePerPiece,
  total,
});

const tableHeaders: CellConfig[] = [
  {
    name: "articleNumber",
    prompt: "Artikelnummer",
    align: "left",
    padding: 0,
    width: 50,
  },
  {
    name: "description",
    prompt: "Beskrivning",
    align: "left",
    padding: 0,
    width: 100,
  },
  {
    name: "amount",
    prompt: "Antal",
    align: "left",
    padding: 0,
    width: 28,
  },
  {
    name: "pricePerPiece",
    prompt: "À-pris",
    align: "left",
    padding: 0,
    width: 28,
  },
  {
    name: "total",
    prompt: "Belopp (SEK)",
    align: "left",
    padding: 0,
    width: 45,
  },
];

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

    let nextLineYCoordinate = 0;
    console.warn((doc.internal as any).events.getTopics());
    (doc.internal as any).events.subscribe("postProcessText", (x: any) => {
      console.warn(x);
      nextLineYCoordinate = x.y + doc.getLineHeight();
    });

    const data = (await file?.stream().getReader().read())?.value ?? undefined;
    if (data) doc.addImage(data, "png", doc.canvas.width, 10, 50, 50);

    const textRows: PdfText[] = [
      { text: "Kvitto", x: columns.leftMain, y: rows.title },
      {
        text: "Kvittonummer",
        x: columns.rightMain.middle,
        y: rows.paymentTerms,
      },
      { text: "A1", x: columns.rightMain.right, y: rows.paymentTerms },
      {
        text: "Datum",
        x: columns.rightMain.middle,
        y: getNextRow(rows.paymentTerms),
      },
      {
        text: "2023-01-01",
        x: columns.rightMain.right,
        y: getNextRow(rows.paymentTerms),
      },
      {
        text: "Säljare",
        x: columns.leftMain,
        y: rows.company,
      },
      {
        text: companyInformation.Identity.Name,
        x: columns.leftMain,
        y: getNextRow(rows.company),
      },
      {
        text: "Köpare",
        x: columns.rightMain.left,
        y: rows.company,
      },
      {
        text: customerInformation.Identity.Name,
        x: columns.rightMain.left,
        y: getNextRow(rows.company),
      },
      {
        text: "Betalningsvilkor",
        x: columns.leftMain,
        y: rows.paymentTerms,
      },
      {
        text: "Kontantbetalning",
        x: columns.leftMain,
        y: getNextRow(rows.paymentTerms),
      },
    ];

    textRows.forEach((textRow) => {
      doc.setTextColor(textRow.color ?? "black");
      doc.text(textRow.text, textRow.x, textRow.y);
    });

    const ReceiptRows = [
      createReceiptRow("20", "Massage 60 min", "2", "200,00", "400,00"),
      createReceiptRow("20", "Massage 60 min", "2", "200,00", "400,00"),
      createReceiptRow("20", "Massage 60 min", "2", "200,00", "400,00"),
      createReceiptRow("20", "Massage 60 min", "2", "200,00", "400,00"),
      createReceiptRow("20", "Massage 60 min", "2", "200,00", "400,00"),
      createReceiptRow("20", "Massage 60 min", "2", "200,00", "400,00"),
      createReceiptRow("20", "Massage 60 min", "2", "200,00", "400,00"),
      createReceiptRow("20", "Massage 60 min", "2", "200,00", "400,00"),
      createReceiptRow("20", "Massage 60 min", "2", "200,00", "400,00"),
      createReceiptRow("20", "Massage 60 min", "2", "200,00", "400,00"),
      createReceiptRow("20", "Massage 60 min", "2", "200,00", "400,00"),
      createReceiptRow("20", "Massage 60 min", "2", "200,00", "400,00"),
      createReceiptRow("20", "Massage 60 min", "2", "200,00", "400,00"),
      createReceiptRow("20", "Massage 60 min", "2", "200,00", "400,00"),
    ];

    doc.table(
      columns.table.articleNumber,
      rows.tableHead,
      ReceiptRows,
      tableHeaders,
      {
        headerBackgroundColor: "black",
        headerTextColor: "white",
      }
    );

    // Figure out if we need to add another page
    let y = nextLineYCoordinate;
    const needToInsertNewPage = canvasSize.y.end - y < footer.height;
    if (needToInsertNewPage) {
      doc.addPage();
      y = 10;
    }

    // create method for writing row
    const writeOnNewLine = (textRows: PdfText[]) => {
      textRows.forEach((textRow) => {
        doc.setTextColor(textRow.color ?? "black");
        doc.text(textRow.text, textRow.x, y);
      });
      y += doc.getLineHeight();
    };
    const drawLineOnNewLine = () => {
      const lineHeight = doc.getLineHeightFactor();
      doc.setLineHeightFactor(1);
      doc.line(canvasSize.x.start + 10, y, canvasSize.x.end - 10, y);
      y += doc.getLineHeight();
      doc.setLineHeightFactor(lineHeight);
    };
    doc.setLineHeightFactor(0.5);
    // draw line to separate footer from content
    drawLineOnNewLine();
    // print out total information

    writeOnNewLine([
      {
        text: "Momsunderlag",
        x: columns.total.left.left,
        y: y,
      },
    ]);
    writeOnNewLine([
      {
        text: "Moms 25%",
        x: columns.total.left.left,
        y: y,
      },
      {
        text: "123,00",
        x: columns.total.left.right,
        y: y,
      },
    ]);
    writeOnNewLine([
      {
        text: "Moms 12%",
        x: columns.total.left.left,
        y: y,
      },
      {
        text: "",
        x: columns.total.left.right,
        y: y,
      },
    ]);
    writeOnNewLine([
      {
        text: "Moms 6%",
        x: columns.total.left.left,
        y: y,
      },
      {
        text: "",
        x: columns.total.left.right,
        y: y,
      },
      {
        text: "Belopp före moms",
        x: columns.total.right.left,
        y: y,
      },
      { text: "123,00", x: columns.total.right.right, y: y },
    ]);
    writeOnNewLine([
      {
        text: "Momsfritt",
        x: columns.total.left.left,
        y: y,
      },
      {
        text: "",
        x: columns.total.left.right,
        y: y,
      },
      {
        text: "Total moms",
        x: columns.total.right.left,
        y: y,
      },
      { text: "123,00", x: columns.total.right.right, y: y },
    ]);

    writeOnNewLine([]);

    writeOnNewLine([
      {
        text: "Att betala (SEK)",
        x: columns.total.right.left,
        y: y,
      },
      { text: "123,00", x: columns.total.right.right, y: y },
    ]);

    // print out footer information
    drawLineOnNewLine();

    writeOnNewLine([
      {
        text: `Tel.nr: ${companyInformation.ContactInformation.Phone}`,
        x: columns.footer.left,
        y: y,
      },
      {
        text: `Org.nr: ${companyInformation.Identity.OrganizationNumber}`,
        x: columns.footer.center,
        y: y,
      },
      {
        text: `Bankgiro: ${companyInformation.PaymentInformation.Bankgiro}`,
        x: columns.footer.right,
        y: y,
      },
    ]);

    writeOnNewLine([
      {
        text: `Webb: ${companyInformation.ContactInformation.Website}`,
        x: columns.footer.left,
        y: y,
      },
      {
        text: `VAT.nr: ${companyInformation.Identity.VatNumber}`,
        x: columns.footer.center,
        y: y,
      },
      {
        text: `Plusgiro: ${companyInformation.PaymentInformation.Plusgiro}`,
        x: columns.footer.right,
        y: y,
      },
    ]);

    writeOnNewLine([
      {
        text: `E-post: ${companyInformation.ContactInformation.Email}`,
        x: columns.footer.left,
        y: y,
      },
      {
        text: `SWIFT: ${companyInformation.PaymentInformation.Swift}`,
        x: columns.footer.center,
        y: y,
      },
    ]);

    writeOnNewLine([
      {
        text: `IBAN: ${companyInformation.PaymentInformation.Iban}`,
        x: columns.footer.center,
        y: y,
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
    customerInformation.Identity.Name,
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
