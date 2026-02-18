import Image from "next/image";
import styles from "./CISectionCollapsible.module.css"

export default function CISectionCollapsible({ iconSrc, headerText } : {
    iconSrc?: string,
    headerText: string,
}) {
    return(
        <div className={styles.CISectionCollapsible}>
            <div className={styles.info}>
                { iconSrc && <Image src={iconSrc} alt={iconSrc} width={16} height={16} />}
                <h5>{headerText}</h5>
            </div>
            
        </div>
    );
}
