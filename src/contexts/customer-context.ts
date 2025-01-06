import { createContext } from "react";
import { CustomerInformation } from "~types";

const initialCustomerInformation: CustomerInformation = {
  Identity: {
    Name: "Test Testsson",
    OrganizationNumber: "961010-1010",
  },
  Address: {
    City: "Stockholm",
    Street: "Drottninggatan 1",
    ZipCode: "10101",
  },
};

type CustomerInformationContextProps = {
  state: CustomerInformation;
  setState: (value: CustomerInformation) => void;
};

const CustomerContext = createContext<CustomerInformationContextProps>({
  state: initialCustomerInformation,
  setState: () => {},
});

export default CustomerContext;
export { initialCustomerInformation, type CustomerInformationContextProps };
