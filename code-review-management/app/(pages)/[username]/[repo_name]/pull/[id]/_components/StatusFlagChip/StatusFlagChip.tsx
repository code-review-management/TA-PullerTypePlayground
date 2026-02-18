import Image from "next/image";
import styles from "./StatusFlagChip.module.css"
import { Status, COLOR_CLASSES, ICONS, TEXT } from "./statusConstants";

export default function StatusFlagChip({ status }:{
    status: Status,
}) {
    const colorClass = COLOR_CLASSES[status];
    const iconSrc = ICONS[status];
    const textDisplay = TEXT[status]

    return(
        <div className={`${styles.statusFlagChip} ${colorClass}`}>
            <Image src={`/icons/${iconSrc}`} alt={status} height={20} width={20}/>
            <p>{textDisplay}</p>
        </div>
    );
}
