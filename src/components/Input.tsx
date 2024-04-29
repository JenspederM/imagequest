import { useState } from "react";

export function Input(props: {
  id: string;
  label: string;
  currentValue?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  maxChars?: number;
}) {
  const [value, setValue] = useState(props.currentValue || "");

  function _onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (props.maxChars && e.target.value.length > props.maxChars) {
      return;
    }
    setValue(e.target.value);
    props.onChange(e.target.value);
  }
  return (
    <div className="form-control w-full">
      <div className="label">
        <span className="label-text">{props.label}</span>
        {props.maxChars && (
          <span className="label-text-alt">
            {value.length}/{props.maxChars}
          </span>
        )}
      </div>
      <input
        type="text"
        id={props.id}
        placeholder={props.placeholder}
        className="input input-bordered w-full placeholder-primary"
        value={value}
        onChange={_onChange}
      />
    </div>
  );
}
