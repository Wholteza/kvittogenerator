type Identity = {
  Name: string;
  OrganizationNumber: string;
};

type CompanyIdentity = Identity & {
  VatNumber: string;
};

type Address = {
  Street: string;
  City: string;
  ZipCode: string;
};

type Contact = {
  Phone: string;
};

type CompanyContact = Contact & {
  Email: string;
  Website: string;
};

type PaymentInformation = {
  Bankgiro: string;
};

export type CompanyInformation = {
  Identity: CompanyIdentity;
  Address: Address;
  ContactInformation: CompanyContact;
  PaymentInformation: PaymentInformation;
};

export type CustomerInformation = {
  Identity: Identity;
  Address: Address;
};

export type ReceiptInformationV1 = {
  date: Date;
  paymentTerms: string;
  number: string;
};

export type ReceiptInformationV2 = {
  date: Date;
  paymentTerms: string;
  receiptNumber: string;
};
