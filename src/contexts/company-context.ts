import { createContext } from "react";
import { CompanyInformation } from "~types";

const initialCompanyInformation: CompanyInformation = {
  Identity: {
    Name: "Test AB",
    OrganizationNumber: "11111111-2222",
    VatNumber: "1122334455SE",
  },
  ContactInformation: {
    Email: "email@example.org",
    Phone: "0700000000",
    Website: "kvitto.zacke.dev",
  },
  Address: {
    City: "Stockholm",
    Street: "Gustav Adolfs Torg 1",
    ZipCode: "11111",
  },
  PaymentInformation: {
    Bankgiro: "000-0000",
  },
};

type CompanyInformationContextProps = {
  state: CompanyInformation;
  setState: (value: CompanyInformation) => void;
};

const CompanyContext = createContext<CompanyInformationContextProps>({
  state: initialCompanyInformation,
  setState: () => {},
});

export default CompanyContext;
export { initialCompanyInformation, type CompanyInformationContextProps };
