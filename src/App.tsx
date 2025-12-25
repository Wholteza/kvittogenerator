import { ChangeEventHandler, useCallback, useEffect, useMemo, useRef } from "react";
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
import useStoredValues, { StoredRecord } from "./hooks/use-stored-values";
import ReceiptInformation from "./components/receipt-information";
import PaymentTermsInput from "./components/payment-terms-input";
import { Picker } from "./components/picker";
import "./app.scss";

const customerDefaultState: CustomerInformation = { Address: { City: "", Street: "", ZipCode: "" }, Identity: { Name: "", OrganizationNumber: "" } }
const serviceDefaultState: ReceiptRowFormModel = {
  amount: 1, date: new Date(), description: "", pricePerPieceVatIncluded: 0, vatPercentage: 25
}

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

type Export = {
  companyInformation: CompanyInformation,
  customers: StoredRecord<CustomerInformation>,
  rows: StoredRecord<ReceiptRowFormModel>
}

const generateCustomerKey = (customer: CustomerInformation) => {
  if (customer.Identity.OrganizationNumber)
    return `${customer.Identity.Name} (${customer.Identity.OrganizationNumber})`;
  return customer.Identity.Name
};
const generateServiceKey = (row: ReceiptRowFormModel) => {
  return `${row.description}-${row.amount}st-${row.pricePerPieceVatIncluded}kr-${row.vatPercentage}%`;
};

const App = () => {
  useLocalStorageMigrations(1);

  const { addItem: addCustomer, removeItem: removeCustomer, keys: customerKeys, selectedKey: selectedCustomerKey, selectKey: selectCustomerKey, values: customers, makeExport: makeCustomersExport, doImport: doCustomersImport } = useStoredValues<CustomerInformation>("existingCustomers", generateCustomerKey);
  const { addItem: storeService, removeItem: removeService, keys: servicesKeys, selectedKey: selectedServiceKey, selectKey: selectServiceKey, values: services, selectedItem: selectedService, makeExport: makeRowsExport, doImport: doRowsImport } = useStoredValues<ReceiptRowFormModel>("services", generateServiceKey);

  const [companyInformationForm, companyInformation, setCompanyInformation] =
    useForm<CompanyInformation>("companyInformation", testCompanyInformation);
  const [customerInformationForm, customerInformation, setCustomerInformation
  ] =
    useForm<CustomerInformation>(
      "customerInformation",
      testCustomerInformation);
  const [receiptFormRows, setReceiptRows, setReceiptRowsViaUpdater] = useLocalStorage<
    ReceiptRowFormModel[]
  >("receiptRows", []);
  const [_, receiptInformation, _setReceiptInformation, setReceiptInformation] =
    useForm<ReceiptInformationV2>("receiptInformation", testReceiptInformation);
  const [currentReceiptRowForm, currentReceiptRow, _setCurrentReceiptRow, setCurrentReceiptRowWithUpdater] =
    useForm<ReceiptRowFormModel>("currentReceiptRow", testReceiptRow);
  const [form, setForm] = useLocalStorage<string>("selectedForm", forms.menu);
  const [file, setFile] = useLocalStorage<string>("logotype", "");

  const formElementRef = useRef<HTMLInputElement>(null);

  const { generatePdf } = usePdf();

  const onDownload = useCallback(() => {

    const data = {
      companyInformation: companyInformation,
      customers: makeCustomersExport(),
      rows: makeRowsExport(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Intl.DateTimeFormat("sv-SE").format(new Date());
    link.href = url;
    link.download = `receipt_backup-${date}.json`;
    link.click();
    link.remove();
  }, [companyInformation, makeCustomersExport, makeRowsExport])

  const onImportButtonClicked = () => {
    const ref = document.getElementById("upload");
    if (!ref) return;
    ref.click();
  }

  const onImportFileRead = (result: string) => {
    const data: Export | null = JSON.parse(result, (key, value) => {
      const dateKeys = ["date"];
      if (dateKeys.includes(key)) {
        return new Date(value)
      }
      return value;
    });

    if (!data) console.error("Backup is corrupt.")
    if (data?.companyInformation) {
      console.log("Setting company information from import: ", data.companyInformation);
      setCompanyInformation(data.companyInformation)
    }
    if (data?.rows) {
      console.log("Setting rows from import: ", data.rows);
      doRowsImport(data.rows)
    }
    if (data?.customers) {
      console.log("Setting customers from import: ", data.customers);
      doCustomersImport(data.customers)
    }
    console.log(data)

  }

  const onImportFileSelected: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file, "utf-8");
    reader.onload = () => {
      const result = reader.result;
      const isString = (x: unknown): x is string => typeof x === "string" && !!x;
      if (isString(result)) onImportFileRead(result)
    }
  };

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

  const existingCustomerOptions = useMemo(() => {
    return customerKeys.map(k => (<option key={k}>{k}</option>))
  }, [customerKeys]);

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
    const rows = [...receiptRows];
    if (rows.length === 0 && selectedService) {
      rows.push(ReceiptRow.fromFormModel({ ...selectedService, date: receiptInformation.date }))
    }
    const total = toReceiptTotalViewModel(calculateReceiptTotal(rows), "kr")
    generatePdf(
      companyInformation,
      customerInformation,
      file,
      receiptInformation,
      rows.map(toViewModel),
      total
    );
  }, [
    generatePdf,
    companyInformation,
    customerInformation,
    file,
    receiptInformation,
    receiptRows,
    receiptTotalInformation,
    selectedService
  ]);

  const onCustomerSelected = useCallback((key) => {
    console.log("Customer was selected", key)

    selectCustomerKey(key);

    const customer = customers.find(c => generateCustomerKey(c) === key);
    console.log("Found customer", customer);
    setCustomerInformation(customer ?? customerDefaultState)
  }, [selectCustomerKey, setCustomerInformation, customers]);

  const saveCustomer = useCallback(() => {
    console.log("Saving customer")
    const customer = customerInformation;
    addCustomer(customer)
    selectCustomerKey(generateCustomerKey(customer))
    setForm(forms.menu)
  }, [addCustomer, customerInformation, selectCustomerKey, setForm])

  const deleteCustomer = useCallback(() => {
    const customer = customerInformation;
    const key = generateCustomerKey(customer);
    removeCustomer(customer)
    let newSelectedCustomer = customers.find(c => generateCustomerKey(c) !== key)
    selectCustomerKey(newSelectedCustomer ? generateCustomerKey(newSelectedCustomer) : undefined);
    newSelectedCustomer = newSelectedCustomer ?? customerDefaultState;
    setCustomerInformation(newSelectedCustomer);
    setForm(forms.menu)
  }, [customerInformation, customers, removeCustomer, selectCustomerKey, setCustomerInformation, setForm]);

  // Update dates automatically when the receipt date is updated
  useEffect(() => {
    const date = receiptInformation.date;
    console.log("Updating all dates to:", date)
    setCurrentReceiptRowWithUpdater((prev) => ({ ...prev, date }));
    setReceiptRowsViaUpdater((prev) => prev.map((r) => ({ ...r, date })))
  }, [receiptInformation.date, setCurrentReceiptRowWithUpdater, setReceiptRowsViaUpdater])

  const handleOnSaveService = useCallback(() => {
    const item = currentReceiptRow;
    storeService(item);
    selectServiceKey(generateServiceKey(item))
  }, [currentReceiptRow, storeService, selectServiceKey]);

  const handleOnDeleteService = useCallback(() => {
    const item = currentReceiptRow;
    const itemKey = generateServiceKey(item)
    removeService(item);

    const newItemKey = servicesKeys.find(k => k !== itemKey);
    const newItem = services.find(s => generateServiceKey(s) === newItemKey)
    selectServiceKey(newItemKey)
    setCurrentReceiptRowWithUpdater(() => newItem ?? serviceDefaultState)
  }, [currentReceiptRow, removeService, servicesKeys, services, selectServiceKey, setCurrentReceiptRowWithUpdater]);

  const handleOnServiceSelected = useCallback((key: string) => {
    const item = services.find(s => generateServiceKey(s) === key) ?? serviceDefaultState;
    item.date = receiptInformation.date;
    selectServiceKey(key)
    setCurrentReceiptRowWithUpdater(() => item)
  }, [services, selectServiceKey, setCurrentReceiptRowWithUpdater, receiptInformation]);

  return (
    <>
      {form === forms.menu ? (
        <></>
      ) : (
        <div className="container-without-padding">
          <div className="inputs">
            <button
              className="button primary back-to-menu-button"
              onClick={() => setForm(forms.menu)}
            >
              Tillbaka till menyn
            </button>
          </div>
        </div>
      )}

      {form === forms.menu ? (
        <div className="container menu">
          <div className="menu-wrapper">
            <h1>Skapa Kvitto</h1>
            <ReceiptInformation setReceiptInformation={setReceiptInformation} receiptInformation={receiptInformation} />
            <div className="customer-row">
              <label>Kund</label>
              <div className="picker">
                <Picker title="Välj kund" keys={customerKeys} selectedKey={selectedCustomerKey} onSelected={onCustomerSelected} />
                <button onClick={() => setForm(forms.customer)}>
                  📝
                </button>
              </div>
            </div>
            <div className="service-row">
              <label>Tjänst</label>
              <div className="picker">
                <Picker title="Välj tjänst" keys={servicesKeys} selectedKey={selectedServiceKey} onSelected={handleOnServiceSelected} />
                <button onClick={() => setForm(forms.rows)}>
                  📝
                </button>
              </div>
            </div>
            <button className="generate-pdf-button" onClick={handleOnClickGeneratePdf}>
              Generera PDF 📄
            </button>
            <div
              style={{ position: "fixed", bottom: 20, left: 20, cursor: "pointer", fontSize: "3rem" }}
              onClick={() => setForm(forms.company)}
            >
              ⚙️
            </div>
            <div
              style={{ position: "fixed", bottom: 20, left: 80, cursor: "pointer", fontSize: "3rem" }}
              onClick={() => onDownload()}
            >
              📥
            </div>
            <div
              style={{ position: "fixed", bottom: 20, left: 140, cursor: "pointer", fontSize: "3rem" }}
              onClick={() => onImportButtonClicked()}
            >
              📤
            </div>
            <input type="file" id="upload" style={{ display: "none" }}
              onChange={onImportFileSelected}
            />
          </div>
        </div >
      ) : (
        <></>
      )}

      {
        form === forms.company ? (
          <div className="container">
            <div className="inputs">
              {companyInformationForm}
              <PaymentTermsInput receiptInformation={receiptInformation} setReceiptInformation={setReceiptInformation} />
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
                    className="button upload-logotype-button"
                    onClick={() => formElementRef?.current?.click()}
                  >
                    Ladda upp logotyp
                  </button>
                  <input
                    className="button upload-logotype-input"
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
        )
      }

      {
        form === forms.customer ? (
          <div className="container">
            <div className="inputs">{customerInformationForm}
              <div style={{ marginTop: "2rem", paddingLeft: "2rem", display: "flex", justifyContent: "space-evenly" }}>
                <button className="save-customer-button" onClick={saveCustomer}>Spara kund</button>
                <button className="delete-customer-button" onClick={deleteCustomer}>Ta bort kund</button>
              </div>
            </div>
          </div >
        ) : (
          <></>
        )
      }

      {
        form === forms.rows ? (

          <div className="container">
            <select className="edit-service-selector" value={selectedServiceKey} onChange={(e) => handleOnServiceSelected(e.target.value)}>{servicesKeys.map(key => (<option key={key}>{key}</option>))}
              {servicesKeys.length === 0 ? <option key="empty" value="">Spara en tjänst</option> : <></>}
            </select>
            <div className="inputs">
              {currentReceiptRowForm}
              <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "1rem" }}>
                <button className="save-service-button" onClick={handleOnSaveService}>Spara tjänst</button>
                <button className="delete-service-button" onClick={handleOnDeleteService}>Ta bort tjänst</button>
              </div>
              <button
                className="button primary add-button"
                onClick={handleOnAddRow}
              >
                Lägg till kvittorad
              </button>
              {receiptRows.length ? <hr /> : <></>}
              {receiptRows.map((row, index) => (
                <div className="receipt-row">
                  <div className="description">{`${row.date.getFullYear()}-${(row.date.getMonth() + 1).toLocaleString().padStart(2, "0")}-${(row.date.getDate()).toLocaleString().padStart(2, "0")}`}</div>
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
