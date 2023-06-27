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
  Contact: Contact;
};

export type ReceiptInformation = {
  date: Date;
  number: string;
  paymentTerms: string;
};

export type ReceiptFormRow = {
  date: Date;
  description: string;
  amount: number;
  pricePerPiece: number;
  total: number;
  vatPercentage: number;
  vat: number;
};

export type RecieptTotalInformation = {
  vat25: number;
  vat12: number;
  vat6: number;
  vat0: number;
  totalBeforeVat: number;
  totalVat: number;
  total: number;
};
