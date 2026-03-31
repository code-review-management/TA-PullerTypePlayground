import { ReactNode } from "react";
import IconTooltip from "../IconTooltip/IconTooltip";
import styles from "./RadioGroup.module.css";

export interface RadioOption<T extends string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
  tooltip?: string;
}

/**
 * List of radio buttons in the same group. Used for forms.
 *
 * @param name: Name attribute shared by all radio buttons in the group.
 * @param options: List of `RadioOption` objects to render as radio buttons.
 * @param selected: Value of the currently selected radio button.
 * @param onChange: Callback fired when the user selects a different radio button.
 */
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
      {options.map(({ value, label, disabled, tooltip }) => (
        <label
          key={value}
          {...(tooltip && {
            "data-tooltip-id": "radio-group",
            "data-tooltip-content": tooltip,
            "data-tooltip-place": "bottom-start",
            "data-tooltip-delay-show": 100,
          })}
        >
          <input
            type="radio"
            name={name}
            value={value}
            required
            disabled={disabled}
            checked={selected === value}
            onChange={() => onChange(value)}
          />
          {label}
        </label>
      ))}
      <IconTooltip id="radio-group" />
    </div>
  );
}
