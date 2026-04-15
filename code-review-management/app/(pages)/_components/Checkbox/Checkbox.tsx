import Image from "next/image";
import styles from "./Checkbox.module.css";
import { useState } from "react";

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
