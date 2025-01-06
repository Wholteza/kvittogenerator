import { ChangeEventHandler } from "react";
import "./input.scss";

type Props = {
  label?: string;
  value: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
};

const Input = ({ value, label, onChange, className }: Props): JSX.Element => {
  return (
    <div className="input">
      <label htmlFor={label}>
        {label}
        <input
          className={` ${className}`}
          id={label}
          name={label}
          value={value}
          placeholder={label}
          onChange={onChange}
        />
      </label>
    </div>
  );
};

export default Input;
