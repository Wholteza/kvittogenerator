import { ChangeEvent, useCallback } from "react";
import Input from "./input";

type Props = {
  value: string;
  label?: string;
  onChange?: (value: string) => void;
};

const TextInput = ({ value, label, onChange }: Props) => {
  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void =>
      onChange?.(e.target.value as string),
    [onChange]
  );

  return <Input value={value} onChange={handleOnChange} label={label} />;
};
export default TextInput;
