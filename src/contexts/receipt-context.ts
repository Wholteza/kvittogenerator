import { createContext } from "react";
import { ReceiptRowFormModel } from "~domain/receipt-row";
import { ReceiptInformationV2 } from "~types";

const initialReceiptInformation: ReceiptInformationV2 = {
  date: new Date(),
  paymentTerms: "Swish",
  receiptNumber: "A1",
};

type ReceiptInformationContextProps = {
  reciept: ReceiptInformationV2;
  setReceipt: (value: ReceiptInformationV2) => void;
  rows: ReceiptRowFormModel[];
  setRows: (value: ReceiptRowFormModel[]) => void;
};

const ReceiptContext = createContext<ReceiptInformationContextProps>({
  reciept: initialReceiptInformation,
  setReceipt: () => {},
  rows: [],
  setRows: () => {},
});

export default ReceiptContext;
export { initialReceiptInformation, type ReceiptInformationContextProps };
