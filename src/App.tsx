import { ChangeEventHandler, useCallback, useMemo } from "react";
import {
  CompanyInformation,
  CustomerInformation,
  ReceiptInformation,
} from "./types";
import useForm from "./use-form";
import useLocalStorage, { parseWithDate } from "./use-local-storage";
import usePdf from "./use-pdf";
import {
  ReceiptRow,
  ReceiptRowFormModel,
  toViewModel,
} from "./domain/receipt-row";
import {
  RecieptTotalInformationViewModel,
  calculateReceiptTotal,
  toReceiptTotalViewModel,
} from "./domain/receipt-total";

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
  description: "",
  pricePerPieceVatIncluded: 0,
  vatPercentage: 25,
  amount: 1,
};
const forms = {
  company: "company",
  customer: "customer",
  receipt: "receipt",
  rows: "rows",
  menu: "menu",
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

  const receiptRows = useMemo<ReceiptRow[]>(
    () => receiptFormRows.map(ReceiptRow.fromFormModel),
    [receiptFormRows]
  );

  const receiptTotalInformation = useMemo<RecieptTotalInformationViewModel>(
    () => toReceiptTotalViewModel(calculateReceiptTotal(receiptRows), "kr"),
    [receiptRows]
  );

  const handleOnRemoveRow = useCallback(
    (index: number) => {
      const copyOfRows = parseWithDate(JSON.stringify(receiptFormRows));
      copyOfRows.splice(index, 1);
      setReceiptRows(copyOfRows);
    },
    [receiptFormRows, setReceiptRows]
  );

  const handleOnClickGeneratePdf = useCallback(() => {
    generatePdf(
      companyInformation,
      customerInformation,
      file,
      receiptInformation,
      receiptRows.map(toViewModel),
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
      {form !== forms.menu ? (
        <div className="receipt-rows-form-container">
          <div className="inputs">
            <button
              className="button primary"
              onClick={() => setForm(forms.menu)}
            >
              Öppna meny
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}

      {form === forms.menu ? (
        <div className="receipt-rows-form-container">
          <div className="inputs">
            <h1>Kvitto</h1>
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
            <button className="button" onClick={handleOnClickGeneratePdf}>
              Generera PDF
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}

      {form === forms.company ? (
        <div className="company-information-form-container">
          <div className="inputs">{companyInformationForm}</div>
        </div>
      ) : (
        <></>
      )}

      {form === forms.customer ? (
        <div className="customer-information-form-container">
          <div className="inputs">{customerInformationForm}</div>
        </div>
      ) : (
        <></>
      )}

      {form === forms.receipt ? (
        <div className="receipt-information-form-container">
          <div className="inputs">
            {receiptInformationForm}
            <label htmlFor="logotype">test</label>
            <input
              className="button"
              type="file"
              onChange={onFileSelected}
              name="logotype"
            />
          </div>
        </div>
      ) : (
        <></>
      )}

      {form === forms.rows ? (
        <div className="receipt-rows-form-container">
          <div className="inputs">
            {currentReceiptRowForm}
            <button
              className="button primary add-button"
              onClick={handleOnAddRow}
            >
              Lägg till
            </button>
            <hr />
            {receiptRows.map((row, index) => (
              <div className="receipt-row">
                <div className="description">{row.description}</div>
                <div className="amount">{row.amount}st</div>
                <button
                  className="receipt-row-remove-button"
                  onClick={() => handleOnRemoveRow(index)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default App;
