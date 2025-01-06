import Input from "~components/input";
import Typography from "~components/typography";
import { faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";

import "./create-receipt.scss";
import Button from "~components/button";

const CreateReceipt = () => {
  const rows = [
    { date: new Date(), description: "Test", price: 0, tax: 0, amount: 0 },
    { date: new Date(), description: "Test", price: 0, tax: 0, amount: 0 },
    { date: new Date(), description: "Test", price: 0, tax: 0, amount: 0 },
    { date: new Date(), description: "Test", price: 0, tax: 0, amount: 0 },
  ];

  return (
    <div className="page-create-receipt">
      <Typography size="heading">Skapa kvitto</Typography>
      <Typography size="subheading">Kvittodata</Typography>
      <div className="receipt-data">
        <Input label="Kvittonummer" value="" />
        <Input label="Kvittodatum" value="" />
        <Input label="Betalningsvilkor" value="" />
      </div>
      <Typography size="subheading">Kunddata</Typography>
      <div className="receipt-data">
        <Input label="Namn" value="" />
        <Input label="Personnummer" value="" />
        <Input label="Gatuadress" value="" />
        <Input label="Postnummer" value="" />
        <Input label="Stad" value="" />
      </div>
      <Typography size="subheading">Kvittorader</Typography>
      <div className="receipt-rows-form">
        <Input label="Datum" value="" />
        <Input label="Beskrivning" value="" />
        <Input label="Styckpris" value="" />
        <Input label="Moms %" value="" />
        <Input label="Antal" value="" />
        <Button icon={faPlus}></Button>
      </div>
      <div className="rows">
        {rows.map((r) => (
          <div className="row">
            <div>
              <div className="label">
                <Typography type="bold">Datum</Typography>
              </div>
              <div className="value">{r.date.toLocaleDateString("SE-sv")}</div>
            </div>
            <div>
              <div className="label">
                <Typography type="bold">Beskrivning</Typography>
              </div>
              <div className="value">{r.description}</div>
            </div>
            <div>
              <div className="label">
                <Typography type="bold">Styckpris</Typography>
              </div>
              <div className="value">{r.price}</div>
            </div>
            <div>
              <div className="label">
                <Typography type="bold">Moms %</Typography>
              </div>
              <div className="value">{r.tax}</div>
            </div>
            <div>
              <div className="label">
                <Typography type="bold">Antal</Typography>
              </div>
              <div className="value">{r.amount}</div>
            </div>
            <div>
              <Button icon={faTrashCan}>Radera</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CreateReceipt;
