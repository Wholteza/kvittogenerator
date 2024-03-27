import { ChangeEventHandler, useCallback, useMemo, useRef } from "react";
import {
  CompanyInformation,
  CustomerInformation,
  ReceiptInformationV2,
} from "./types";
import useForm from "./hooks/use-form/use-form";
import useLocalStorage from "./use-local-storage";
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
import { parseWithDateHydration } from "./helpers/parse-helpers";
import { useLocalStorageMigrations } from "./hooks/use-local-storage-migrations";
import translate from "./internationalization/translate";
import Input from "./components/input";

const testCompanyInformation: CompanyInformation = {
  Identity: {
    Name: "",
    OrganizationNumber: "",
    VatNumber: "",
  },
  ContactInformation: {
    Email: "",
    Phone: "",
    Website: "",
  },
  Address: {
    City: "",
    Street: "",
    ZipCode: "",
  },
  PaymentInformation: {
    Bankgiro: "",
  },
};

const testCustomerInformation: CustomerInformation = {
  Identity: {
    Name: "",
    OrganizationNumber: "",
  },
  Address: {
    City: "",
    Street: "",
    ZipCode: "",
  },
};

const testReceiptInformation: ReceiptInformationV2 = {
  receiptNumber: "",
  date: new Date(Date.now()),
  paymentTerms: "",
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
  rows: "rows",
  menu: "menu",
} as const;

const App = () => {
  useLocalStorageMigrations(1);

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
    useForm<ReceiptInformationV2>("receiptInformation", testReceiptInformation);
  const [currentReceiptRowForm, currentReceiptRow] =
    useForm<ReceiptRowFormModel>("currentReceiptRow", testReceiptRow);
  const [form, setForm] = useLocalStorage<string>("selectedForm", forms.menu);
  const [file, setFile] = useLocalStorage<string>("logotype", "");

  const formElementRef = useRef<HTMLInputElement>(null);

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
      parseWithDateHydration<ReceiptRowFormModel>(
        JSON.stringify(currentReceiptRow)
      ),
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
      const copyOfRows = parseWithDateHydration<ReceiptRowFormModel[]>(
        JSON.stringify(receiptFormRows)
      );
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
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-evenly",
        }}
      >
        <div>{receiptInformationForm}</div>
        <div>{customerInformationForm}</div>
        <div>
          {currentReceiptRowForm}
          <button onClick={handleOnAddRow}>Lägg till</button>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex" }}>
          <div>
            <Input value={"A1"} label="Kvittonummer" />
            <Input
              value={"Swish"}
              label="Betalningsvilkor"
              style={{ marginTop: 5 }}
            />
          </div>
          <Input value={new Date()} label="Datum" style={{ marginLeft: 10 }} />
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", marginLeft: 30 }}
        >
          <div style={{ display: "flex" }}>
            <Input value={"arst"} label="Namn" style={{ marginLeft: 10 }} />
            <Input
              value={"arst"}
              label="Personnummer"
              style={{ marginLeft: 10 }}
            />
          </div>
          <div style={{ display: "flex" }}>
            <Input value={"Stad"} label="Stad" style={{ marginLeft: 10 }} />
            <Input
              value={"Gatuadress"}
              label="Gatuadress"
              style={{ marginLeft: 10 }}
            />
            <Input
              value={"Postnummer"}
              label="Postnummer"
              style={{ marginLeft: 10 }}
            />
          </div>
        </div>
      </div>
      <div>
        {receiptRows.map((row, index) => (
          <div style={{ display: "flex" }}>
            <div>{row.description}</div>
            <div>{row.amount}st</div>
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
  );

  return (
    <>
      {form === forms.menu ? (
        <></>
      ) : (
        <div className="container-without-padding">
          <div className="inputs">
            <button
              className="button primary"
              onClick={() => setForm(forms.menu)}
            >
              Tillbaka till menyn
            </button>
          </div>
        </div>
      )}

      {form === forms.menu ? (
        <div className="container">
          <div className="inputs">
            <h1>{translate("receiptGenerator")}</h1>
            <div style={{ marginBottom: 20 }}>{receiptInformationForm}</div>
            <button className="button" onClick={() => setForm(forms.customer)}>
              Redigera kund
            </button>
            <button className="button" onClick={() => setForm(forms.rows)}>
              Redigera rader
            </button>
            <button className="button" onClick={handleOnClickGeneratePdf}>
              Generera PDF
            </button>
            <button
              className="button secondary"
              onClick={() => setForm(forms.company)}
            >
              Redigera företag
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}

      {form === forms.company ? (
        <div className="container">
          <div className="inputs">
            {companyInformationForm}
            {file.length ? (
              <button
                className="button remove-logotype-button"
                onClick={() => setFile("")}
              >
                Ta bort logotyp
              </button>
            ) : (
              <>
                <button
                  style={{ marginTop: "1rem" }}
                  className="button"
                  onClick={() => formElementRef?.current?.click()}
                >
                  Ladda upp logotyp
                </button>
                <input
                  className="button"
                  type="file"
                  onChange={onFileSelected}
                  name="logotype"
                  ref={formElementRef}
                />
              </>
            )}
            {file.length ? <img src={file} className="logotype" /> : <></>}
          </div>
        </div>
      ) : (
        <></>
      )}

      {form === forms.customer ? (
        <div className="container">
          <div className="inputs">{customerInformationForm}</div>
        </div>
      ) : (
        <></>
      )}

      {form === forms.rows ? (
        <div className="container">
          <div className="inputs">
            {currentReceiptRowForm}
            <button
              className="button primary add-button"
              onClick={handleOnAddRow}
            >
              Lägg till
            </button>
            {receiptRows.length ? <hr /> : <></>}
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
