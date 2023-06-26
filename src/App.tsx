import { ChangeEventHandler, useState } from "react";
import { CompanyInformation, CustomerInformation } from "./types";
import useForm from "./use-form";
import usePdf from "./use-pdf";

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
  },
};

const testCustomerInformation: CustomerInformation = {
  Identity: {
    Name: "Arst Arstsson",
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

const forms = {
  company: "company",
  customer: "customer",
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

  const [form, setForm] = useState<string>(forms.company);

  const [file, setFile] = useState<File>();

  const { generatePdf } = usePdf();

  const onFileSelected: ChangeEventHandler<HTMLInputElement> = (event) => {
    console.warn(event);
    const file = event.target?.files?.[0];
    if (!file) return;
    setFile(file);
  };

  return (
    <>
      <button onClick={() => setForm(forms.company)}>Redigera företag</button>
      <button onClick={() => setForm(forms.customer)}>Redigera kund</button>
      <button onClick={() => setForm(forms.rows)}>Redigera rader</button>
      <button
        onClick={() =>
          generatePdf(companyInformation, customerInformation, file)
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
    </>
  );
};

export default App;
