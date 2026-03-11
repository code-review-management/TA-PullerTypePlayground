import { ReactNode } from "react";
import styles from "./RadioGroup.module.css";

export interface RadioOption<T extends string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

export default function RadioGroup<T extends string>({
  name,
  options,
  selected,
  onChange,
}: {
  name: string;
  options: RadioOption<T>[];
  selected: T | null;
  onChange: (value: T) => void;
}) {
  return (
    <div className={styles.radioGroup}>
      {options.map(({ value, label, disabled }) => (
        <label key={value}>
          <input
            type="radio"
            name={name}
            value={value}
            required
            disabled={disabled}
            defaultChecked={selected === value}
            onChange={() => onChange(value)}
          />
          {label}
        </label>
      ))}
    </div>
  );
}
