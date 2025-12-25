import { ChangeEventHandler, useCallback } from 'react'
import { ReceiptInformationV2 } from 'types';
import "./payment-terms-input.scss";

const PaymentTermsInput = ({ setReceiptInformation, receiptInformation }: { setReceiptInformation: (updatingMethod: (prev: ReceiptInformationV2) => ReceiptInformationV2) => void, receiptInformation: ReceiptInformationV2 }) => {

  const updateField: ChangeEventHandler<HTMLInputElement> = useCallback((element) => {
    const field = element.currentTarget.id
    const value = element.currentTarget.value;
    setReceiptInformation((prev) => {
      return { ...prev, [field]: value }
    })
  }, [setReceiptInformation])

  return (<div className="payment-terms-input-component">
    <label>Betalningsvilkor</label>
    <input placeholder="Betalningsvilkor" onChange={updateField} value={receiptInformation.paymentTerms} type='text' id='paymentTerms' />
  </div>)
}

export default PaymentTermsInput;
