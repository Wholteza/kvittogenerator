type Identity = {
  Name: string;
  OrganizationNumber: string;
  VatNumber: string;
};

type Address = {
  Street: string;
  City: string;
  ZipCode: string;
};

type ContactInformation = {
  Phone: string;
  Email: string;
  Website: string;
};

type PaymentInformation = {
  Bankgiro: string;
};

export type CompanyInformation = {
  Identity: Identity;
  Address: Address;
  ContactInformation: ContactInformation;
  PaymentInformation: PaymentInformation;
};

export type ReceiptInformation = {
  date: Date;
  number: string;
  paymentTerms: string;
};
