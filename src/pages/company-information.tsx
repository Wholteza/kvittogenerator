import { useContext, useState } from "react";
import TextInput from "~components/text-input";
import Typography from "~components/typography";
import { type CompanyInformation } from "~types";

import "./company-information.scss";
import CompanyContext from "~contexts/company-context";

const CompanyInformation = () => {
  const { state, setState } = useContext(CompanyContext);

  return (
    <div className="page-company-information">
      <Typography size="heading">Redigera Företagsinformation</Typography>
      <Typography size="subheading">Identitet</Typography>
      <div className="form-section">
        <TextInput
          label="Namn"
          value={state.Identity.Name}
          onChange={(v) =>
            setState({
              ...state,
              Identity: { ...state.Identity, Name: v },
            })
          }
        />
        <TextInput
          label="Organisationsnummer"
          value={state.Identity.OrganizationNumber}
          onChange={(v) =>
            setState({
              ...state,
              Identity: { ...state.Identity, OrganizationNumber: v },
            })
          }
        />
        <TextInput
          label="Momsnummer"
          value={state.Identity.VatNumber}
          onChange={(v) =>
            setState({
              ...state,
              Identity: { ...state.Identity, VatNumber: v },
            })
          }
        />
      </div>
      <Typography size="subheading">Kontaktinformation</Typography>
      <div className="form-section">
        <TextInput
          label="E-post"
          value={state.ContactInformation.Email}
          onChange={(v) =>
            setState({
              ...state,
              ContactInformation: { ...state.ContactInformation, Email: v },
            })
          }
        />
        <TextInput
          label="Telefonnummer"
          value={state.ContactInformation.Phone}
          onChange={(v) =>
            setState({
              ...state,
              ContactInformation: { ...state.ContactInformation, Phone: v },
            })
          }
        />
        <TextInput
          label="Hemsida"
          value={state.ContactInformation.Website}
          onChange={(v) =>
            setState({
              ...state,
              ContactInformation: { ...state.ContactInformation, Website: v },
            })
          }
        />
      </div>
      <Typography size="subheading">Adress</Typography>
      <div className="form-section">
        <TextInput
          label="Gatuadress"
          value={state.Address.Street}
          onChange={(v) =>
            setState({
              ...state,
              Address: { ...state.Address, Street: v },
            })
          }
        />
        <TextInput
          label="Postnummer"
          value={state.Address.ZipCode}
          onChange={(v) =>
            setState({
              ...state,
              Address: { ...state.Address, ZipCode: v },
            })
          }
        />
        <TextInput
          label="Stad"
          value={state.Address.City}
          onChange={(v) =>
            setState({
              ...state,
              Address: { ...state.Address, City: v },
            })
          }
        />
      </div>
      <Typography size="subheading">Betalinformation</Typography>
      <div className="form-section">
        <TextInput
          label="Bankgiro"
          value={state.PaymentInformation.Bankgiro}
          onChange={(v) =>
            setState({
              ...state,
              PaymentInformation: { ...state.PaymentInformation, Bankgiro: v },
            })
          }
        />
      </div>
    </div>
  );
};

export default CompanyInformation;
