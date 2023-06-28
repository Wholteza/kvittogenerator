import { ChangeEventHandler, useCallback, useMemo } from "react";
import translate from "./translate";
import {
  CompanyInformation,
  CustomerInformation,
  ReceiptInformation,
  RecieptTotalInformation,
} from "./types";
import useForm from "./use-form";
import useLocalStorage, { parseWithDate } from "./use-local-storage";
import usePdf from "./use-pdf";
import {
  ReceiptRow,
  ReceiptRowFormModel,
  ReceiptRowViewModel,
} from "./types/receipt-row";

const getVatTotalForItems = (
  items: ReceiptRowFormModel[],
  vatPercentage: number
): number => {
  const filteredItems = items.filter(
    (row) => row.vatPercentage === vatPercentage
  );
  const total = filteredItems.reduce(
    (aggregate, current) =>
      aggregate +
      current.pricePerPieceVatIncluded *
        (0.01 * vatPercentage) *
        current.amount,
    0
  );
  return total;
};

const testCompanyInformation: CompanyInformation = {
  Identity: {
    Name: "Company Companysson",
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
  },
};

const testCustomerInformation: CustomerInformation = {
  Identity: {
    Name: "Customer Customersson",
    OrganizationNumber: "0000000000",
  },
  Contact: {
    Phone: "0700000000",
  },
  Address: {
    City: "Testy",
    Street: "Testenton st. 12",
    ZipCode: "00000",
  },
};

const testReceiptInformation: ReceiptInformation = {
  number: "A1",
  date: new Date(Date.now()),
  paymentTerms: "Kontantbetalning",
};

const testReceiptRow: ReceiptRowFormModel = {
  date: new Date(Date.now()),
  amount: 1,
  description: "",
  pricePerPieceVatIncluded: 0,
  vatPercentage: 25,
};
const forms = {
  company: "company",
  customer: "customer",
  receipt: "receipt",
  rows: "rows",
} as const;

const App = () => {
  const [companyInformationForm, companyInformation] =
    useForm<CompanyInformation>("companyInformation", testCompanyInformation);
  const [customerInformationForm, customerInformation] =
    useForm<CustomerInformation>(
      "customerInformation",
      testCustomerInformation
    );
  const [receiptFormRows, setReceiptRows] = useLocalStorage<
    ReceiptRowFormModel[]
  >("receiptRows", []);
  const [receiptInformationForm, receiptInformation] =
    useForm<ReceiptInformation>("receiptInformation", testReceiptInformation);
  const [currentReceiptRowForm, currentReceiptRow] =
    useForm<ReceiptRowFormModel>("currentReceiptRow", testReceiptRow);
  const [form, setForm] = useLocalStorage<string>(
    "selectedForm",
    forms.company
  );
  const [file, setFile] = useLocalStorage<string>("logotype", "");

  const { generatePdf } = usePdf();

  const onFileSelected: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      setFile(typeof reader.result === "string" ? reader.result : "");
  };

  const handleOnAddRow = useCallback(() => {
    setReceiptRows([
      ...receiptFormRows,
      parseWithDate(JSON.stringify(currentReceiptRow)),
    ]);
  }, [currentReceiptRow, receiptFormRows, setReceiptRows]);

  const receiptTotalInformation = useMemo<RecieptTotalInformation>(() => {
    const vat25 = getVatTotalForItems(receiptFormRows, 25);
    const vat12 = getVatTotalForItems(receiptFormRows, 12);
    const vat6 = getVatTotalForItems(receiptFormRows, 6);
    const vat0 = receiptFormRows
      .filter((row) => row.vatPercentage === 0)
      .reduce(
        (total, current) =>
          total + current.amount * current.pricePerPieceVatIncluded,
        0
      );
    const totalBeforeVat = receiptFormRows.reduce(
      (total, current) =>
        total + current.pricePerPieceVatIncluded * current.amount,
      0
    );
    const totalVat = vat25 + vat12 + vat6;

    return {
      vat25,
      vat12,
      vat6,
      vat0,
      totalBeforeVat,
      total: totalBeforeVat + totalVat,
      totalVat,
    };
  }, [receiptFormRows]);

  const handleOnRemoveRow = useCallback(
    (index: number) => {
      const copyOfRows = parseWithDate(JSON.stringify(receiptFormRows));
      copyOfRows.splice(index, 1);
      setReceiptRows(copyOfRows);
    },
    [receiptFormRows, setReceiptRows]
  );

  const receiptRows = useMemo<ReceiptRow[]>(
    () => receiptFormRows.map(ReceiptRow.fromFormModel),
    [receiptFormRows]
  );
  const handleOnClickGeneratePdf = useCallback(() => {
    generatePdf(
      companyInformation,
      customerInformation,
      file,
      receiptInformation,
      receiptRows.map(
        (row): ReceiptRowViewModel => ({
          date: Intl.DateTimeFormat("sv-SE").format(new Date(row.date)),
          description: row.description || " ",
          amount: `${row.amount} st`,
          pricePerPiece: `${row.pricePerPieceVatExcluded} kr`,
          vatPercentage: `${row.vatPercentage} %`,
          vat: `${row.vatPerPiece} kr`,
          total: `${row.totalWithVatIncluded} kr`,
        })
      ),
      receiptTotalInformation
    );
  }, [
    generatePdf,
    companyInformation,
    customerInformation,
    file,
    receiptInformation,
    receiptRows,
    receiptTotalInformation,
  ]);

  return (
    <>
      <button className="button" onClick={() => setForm(forms.company)}>
        Redigera företag
      </button>
      <button className="button" onClick={() => setForm(forms.customer)}>
        Redigera kund
      </button>
      <button className="button" onClick={() => setForm(forms.receipt)}>
        Redigera kvitto
      </button>
      <button className="button" onClick={() => setForm(forms.rows)}>
        Redigera rader
      </button>
      <button onClick={handleOnClickGeneratePdf}>Generera PDF</button>
      <input type="file" onChange={onFileSelected} name="arst" />

      {form === forms.company ? (
        <div className="company-information-form-container">
          {companyInformationForm}
        </div>
      ) : (
        <></>
      )}

      {form === forms.customer ? (
        <div className="customer-information-form-container">
          {customerInformationForm}
        </div>
      ) : (
        <></>
      )}

      {form === forms.receipt ? (
        <div className="receipt-information-form-container">
          {receiptInformationForm}
        </div>
      ) : (
        <></>
      )}

      {form === forms.rows ? (
        <div className="receipt-rows-form-container">
          {currentReceiptRowForm}
          <button onClick={handleOnAddRow}>Lägg till</button>
          {receiptRows.map((row, index) => (
            <div>
              {Intl.DateTimeFormat("sv-SE").format(new Date(row.date))},{" "}
              {row.description}, {row.amount}, {row.pricePerPieceVatExcluded},{" "}
              {row.vatPercentage}, {row.vatPerPiece}, {row.totalWithVatIncluded}{" "}
              <button onClick={() => handleOnRemoveRow(index)}>Ta bort</button>
            </div>
          ))}
          <table>
            <thead>
              <tr>
                <td>{translate("date")}</td>
                <td>{translate("description")}</td>
                <td>{translate("amount")}</td>
                <td>{translate("pricePerPiece")}</td>
                <td>{translate("vatPercentage")}</td>
                <td>{translate("vat")}</td>
                <td>{translate("total")}</td>
              </tr>
            </thead>
            <tbody>
              {receiptRows.map((row) => (
                <tr>
                  <td>{Intl.DateTimeFormat("sv-SE").format(row.date)}</td>
                  <td>{row.description}</td>
                  <td>{row.amount}</td>
                  <td>{row.pricePerPieceVatExcluded}</td>
                  <td>{row.vatPercentage}</td>
                  <td>{row.vatPerPiece}</td>
                  <td>{row.totalWithVatIncluded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default App;
