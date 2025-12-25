import { formatDisplayDate } from '../helpers/date-helpers';
import { ChangeEventHandler, useCallback } from 'react'
import { ReceiptInformationV2 } from 'types';
import "./receipt-information.scss"

const ReceiptInformation = ({ setReceiptInformation, receiptInformation }: { setReceiptInformation: (updatingMethod: (prev: ReceiptInformationV2) => ReceiptInformationV2) => void, receiptInformation: ReceiptInformationV2 }) => {

  const updateField: ChangeEventHandler<HTMLInputElement> = useCallback((element) => {
    const field = element.currentTarget.id
    const value = field === "date" ? element.currentTarget.valueAsDate : element.currentTarget.value;
    setReceiptInformation((prev) => {
      return { ...prev, [field]: value }
    })
  }, [setReceiptInformation])

  return (<div className='receipt-information-wrapper'>
    <label>Kvittonummer</label>
    <input onChange={updateField} value={receiptInformation.receiptNumber} id='receiptNumber' placeholder="Kvittonummer" />
    <label>Datum</label>
    <input placeholder="Datum" onChange={updateField} value={formatDisplayDate(receiptInformation.date)} type='date' id='date' />
  </div>)
}

export default ReceiptInformation;
