import { ChangeEventHandler, ReactEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const customerDefaultState: CustomerInformation = { Address: { City: "", Street: "", ZipCode: "" }, Identity: { Name: "", OrganizationNumber: "" } }

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

const generateCustomerKey = (customer: CustomerInformation) => {
  if (customer.Identity.OrganizationNumber)
    return `${customer.Identity.Name} (${customer.Identity.OrganizationNumber})`;
  return customer.Identity.Name
};

const App = () => {
  useLocalStorageMigrations(1);

  const [companyInformationForm, companyInformation] =
    useForm<CompanyInformation>("companyInformation", testCompanyInformation);
  const [customerInformationForm, customerInformation, setCustomerInformation
  ] =
    useForm<CustomerInformation>(
      "customerInformation",
      testCustomerInformation);
  const [receiptFormRows, setReceiptRows] = useLocalStorage<
    ReceiptRowFormModel[]
  >("receiptRows", []);
  const [receiptInformationForm, receiptInformation] =
    useForm<ReceiptInformationV2>("receiptInformation", testReceiptInformation);
  const [currentReceiptRowForm, currentReceiptRow] =
    useForm<ReceiptRowFormModel>("currentReceiptRow", testReceiptRow);
  const [form, setForm] = useLocalStorage<string>("selectedForm", forms.menu);
  const [file, setFile] = useLocalStorage<string>("logotype", "");

  const [selectedCustomerKey, setSelectedCustomerKey] = useState<string>(() => "")

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

  const [existingCustomers, setExistingCustomer] = useState<Record<string, CustomerInformation> | undefined>(() => {
    return undefined
  })

  useEffect(() => {
    let storedCustomers: Record<string, CustomerInformation>;
    try {
      const storedCustomersJson = localStorage.getItem("existingCustomers")
      storedCustomers = storedCustomersJson ? JSON.parse(storedCustomersJson) : {};
    }
    catch (e) {
      storedCustomers = {};
    }

    const currentCustomers = existingCustomers;

    const stateNeedsInitialization = currentCustomers === undefined;
    if (stateNeedsInitialization) {

      console.log("State is empty and needs initialization")
      console.log("Stored customers found:", storedCustomers)
      console.log("Existing customers found:", currentCustomers)
      // First we load the stored customer into state.
      console.log("Setting existing customers to:", storedCustomers)
      setExistingCustomer(storedCustomers);

      // decide how to select currenst customer

      // Try to select the currently edited customer from saved list if it exists

      if (customerInformation?.Identity?.Name) {
        const key = generateCustomerKey(customerInformation)
        const storedCustomer = storedCustomers[key];
        if (storedCustomer) {
          console.log("Found currently edited customer in stored customers, setting as selected", storedCustomer)
          setSelectedCustomerKey(key);
          return;
        }
        console.log("Currently edited customer is not a stored customer, selecting \"Unsaved customer\"")
        setSelectedCustomerKey("Unsaved customer");
        return;
      }

      // Otherwise we select the first customer in the stored customers list
      if (Object.keys(storedCustomers).length === 0) return;

      console.log(`Working with ${Object.keys(storedCustomers).length} stored customers`)
      const firstCustomer = storedCustomers[Object.keys(storedCustomers)[0]];
      console.log("Selecting first stored customer:", firstCustomer)
      setCustomerInformation(firstCustomer);
      return;
    }


  }, [customerInformation, existingCustomers, setCustomerInformation])

  const existingCustomerOptions = useMemo(() => {
    return Object.keys(existingCustomers ?? {}).map(k => {
      return (<option key={k}>{k}</option>);
    })
  }, [existingCustomers]);

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

  const onCustomerSelected: ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
    const selectedValue = e.currentTarget.value
    console.log("Customer was selected", selectedValue)
    console.log("value", selectedValue)

    const selectedCustomer = (existingCustomers ?? {})[selectedValue];
    if (!selectedCustomer) {
      console.error("The customer selected does not exist.");
    }

    console.log("Customer was found", selectedCustomer)

    setCustomerInformation(selectedCustomer);
    setSelectedCustomerKey(selectedValue);
  }, [existingCustomers, setCustomerInformation]);

  const saveCustomer = useCallback(() => {
    console.log("Saving customer")
    const customer = customerInformation;
    setExistingCustomer((prevCustomers) => {
      const newCustomers = { ...(prevCustomers ?? {}), [generateCustomerKey(customer)]: customer }
      localStorage.setItem("existingCustomers", JSON.stringify(newCustomers));
      return newCustomers;
    })
    setSelectedCustomerKey(generateCustomerKey(customer))
    setForm(forms.menu)
  }, [customerInformation, setForm])

  const deleteCustomer = useCallback(() => {
    const customer = customerInformation;
    const key = generateCustomerKey(customer);
    setExistingCustomer((prevCustomers) => {
      const newCustomers = Object.keys(prevCustomers ?? {}).reduce<Record<string, CustomerInformation>>((acc, curr) => {
        const currKey = curr;
        const currCustomer = (prevCustomers ?? {})[currKey];
        if (currKey === key) return acc;
        return { ...acc, [currKey]: currCustomer }
      }, {} as Record<string, CustomerInformation>);
      localStorage.setItem("existingCustomers", JSON.stringify(newCustomers));
      return newCustomers;
    })
    const newSelectedCustomerKey = Object.keys(existingCustomers ?? {}).find(c => c !== key);
    setSelectedCustomerKey(newSelectedCustomerKey ?? "");
    const newSelectedCustomer: CustomerInformation = newSelectedCustomerKey ? existingCustomers?.[newSelectedCustomerKey] ?? customerDefaultState : customerDefaultState;
    setCustomerInformation(newSelectedCustomer);
    setForm(forms.menu)
  }, [customerInformation, existingCustomers, setCustomerInformation, setForm]);



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
            <h1>Meny</h1>
            <div style={{ marginBottom: 20 }}>{receiptInformationForm}</div>
            <select onChange={onCustomerSelected} value={selectedCustomerKey} style={{ marginBottom: 20 }}>
              {existingCustomerOptions}
              {existingCustomerOptions.length === 0 ? <option key="empty" value="">Spara din kund</option> : <></>}
            </select>
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
          <div className="inputs">{customerInformationForm}
            <div style={{ marginTop: "2rem", paddingLeft: "2rem", display: "flex", justifyContent: "space-evenly" }}>
              <button onClick={saveCustomer}>Spara kund</button>
              <button onClick={deleteCustomer}>Ta bort kund</button>
            </div>
          </div>
        </div >
      ) : (
        <></>
      )}

      {
        form === forms.rows ? (
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
        )
      }
    </>
  );
};

export default App;
