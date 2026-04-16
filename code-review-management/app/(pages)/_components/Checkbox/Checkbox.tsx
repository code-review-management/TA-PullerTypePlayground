import Image from "next/image";
import styles from "./Checkbox.module.css";
import { useState } from "react";

/**
 * Styled Checkbox component.
 * @param id Unique ID for the checkbox. Can be used to link labels to the checkbox
 * @param name Name of the checkbox value. Gets passed into onChange
 * @param onChange Callback triggered when checkbox value changes.
 */
export default function Checkbox({
  id,
  name,
  onChange,
}: {
  id: string;
  name: string;
  onChange: (name: string, isChecked: boolean) => void;
}) {
  const [checked, setChecked] = useState(false);
  return (
    <div className={styles.checkboxWrapper}>
      <input
        type="checkbox"
        id={id}
        name={name}
        className={styles.checkbox}
        onChange={(e) => {
          const isChecked = e.target.checked;
          setChecked(isChecked);
          onChange(name, isChecked);
        }}
      />
      {checked && (
        <div className={styles.checkImage}>
          <Image
            src="/icons/check_small.svg"
            height={10}
            width={12}
            alt="Checkmark"
          />
        </div>
      )}
    </div>
  );
}
