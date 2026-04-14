import Image from "next/image";
import styles from "./Checkbox.module.css";

export default function Checkbox({
  id,
  name,
  onChange,
}: {
  id: string;
  name: string;
  onChange: (name: string, isChecked: boolean) => void;
}) {
  return (
    <div className={styles.checkboxWrapper}>
      <input
        type="checkbox"
        id={id}
        name={name}
        className={styles.checkbox}
        onChange={(e) => {
          const isChecked = e.target.checked;
          onChange(name, isChecked);
        }}
      />
      <div className={styles.checkImage}>
        <Image
          src="/icons/check_small.svg"
          height={10}
          width={12}
          alt="Checkmark"
        />
      </div>
    </div>
  );
}
