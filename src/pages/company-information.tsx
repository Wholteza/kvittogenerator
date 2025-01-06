import { useState } from "react";
import TextInput from "~components/text-input";
import Typography from "~components/typography";
import { type CompanyInformation } from "~types";

import "./company-information.scss";

const initialState: CompanyInformation = {
  Identity: {
    Name: "Test AB",
    OrganizationNumber: "1234",
    VatNumber: "4231",
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

const CompanyInformation = () => {
  const [state, setState] = useState<CompanyInformation>(initialState);

  return (
    <div className="page-company-information">
      <Typography size="heading">Redigera Företagsinformation</Typography>
      <Typography size="subheading">Identitet</Typography>
      <div className="form-section">
        <TextInput
          label="Namn"
          value={state.Identity.Name}
          onChange={(v) =>
            setState((p) => ({ ...p, Identity: { ...p.Identity, Name: v } }))
          }
        />
        <TextInput
          label="OrganizationNumber"
          value={state.Identity.OrganizationNumber}
          onChange={(v) =>
            setState((p) => ({
              ...p,
              Identity: { ...p.Identity, OrganizationNumber: v },
            }))
          }
        />
        <TextInput
          label="VatNumber"
          value={state.Identity.VatNumber}
          onChange={(v) =>
            setState((p) => ({
              ...p,
              Identity: { ...p.Identity, VatNumber: v },
            }))
          }
        />
      </div>
      <Typography size="subheading">Kontaktinformation</Typography>
      <div className="form-section">
        <TextInput
          label="E-post"
          value={state.ContactInformation.Email}
          onChange={(v) =>
            setState((p) => ({
              ...p,
              ContactInformation: { ...p.ContactInformation, Email: v },
            }))
          }
        />
        <TextInput
          label="Telefonnummer"
          value={state.ContactInformation.Phone}
          onChange={(v) =>
            setState((p) => ({
              ...p,
              ContactInformation: { ...p.ContactInformation, Phone: v },
            }))
          }
        />
        <TextInput
          label="Hemsida"
          value={state.ContactInformation.Website}
          onChange={(v) =>
            setState((p) => ({
              ...p,
              ContactInformation: { ...p.ContactInformation, Website: v },
            }))
          }
        />
      </div>
      <Typography size="subheading">Adress</Typography>
      <div className="form-section">
        <TextInput
          label="Gatuadress"
          value={state.Address.Street}
          onChange={(v) =>
            setState((p) => ({
              ...p,
              Address: { ...p.Address, Street: v },
            }))
          }
        />
        <TextInput
          label="Postnummer"
          value={state.Address.ZipCode}
          onChange={(v) =>
            setState((p) => ({
              ...p,
              Address: { ...p.Address, ZipCode: v },
            }))
          }
        />
        <TextInput
          label="Stad"
          value={state.Address.City}
          onChange={(v) =>
            setState((p) => ({
              ...p,
              Address: { ...p.Address, City: v },
            }))
          }
        />
      </div>
    </div>
  );
};

export default CompanyInformation;
