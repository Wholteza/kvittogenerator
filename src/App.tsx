import { ChangeEventHandler, useState } from "react";
import {
  CompanyInformation,
  CustomerInformation,
  ReceiptInformation,
} from "./types";
import useForm from "./use-form";
import useLocalStorage from "./use-local-storage";
import usePdf from "./use-pdf";

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
  const [receiptInformationForm, receiptInformation] =
    useForm<ReceiptInformation>("receiptInformation", testReceiptInformation);

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

  return (
    <>
      <button onClick={() => setForm(forms.company)}>Redigera företag</button>
      <button onClick={() => setForm(forms.customer)}>Redigera kund</button>
      <button onClick={() => setForm(forms.receipt)}>Redigera kvitto</button>
      <button onClick={() => setForm(forms.rows)}>Redigera rader</button>
      <button
        onClick={() =>
          generatePdf(
            companyInformation,
            customerInformation,
            file,
            receiptInformation
          )
        }
      >
        Generera PDF
      </button>
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
    </>
  );
};

export default App;
