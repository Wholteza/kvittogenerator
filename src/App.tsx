import { ChangeEventHandler, useState } from "react";
import { CompanyInformation } from "./types";
import useLocalStorage from "./use-local-storage";
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
    Plusgiro: "0000-000",
    Iban: "0000000",
    Swift: "0000000",
  },
};

const App = () => {
  const [companyInformation] = useLocalStorage<CompanyInformation>(
    "companyInformation",
    testCompanyInformation
  );
  const [customerInformation] = useLocalStorage<CompanyInformation>(
    "customerInformation",
    testCompanyInformation
  );

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
      <button
        onClick={() =>
          generatePdf(companyInformation, customerInformation, file)
        }
      >
        generate pdf
      </button>
      <input type="file" onChange={onFileSelected}></input>
      <div>{file?.name}</div>
    </>
  );
};

export default App;
