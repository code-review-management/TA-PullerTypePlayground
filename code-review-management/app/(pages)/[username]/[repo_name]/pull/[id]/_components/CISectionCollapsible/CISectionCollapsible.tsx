import Image from "next/image";
import styles from "./CISectionCollapsible.module.css"
import { ReactNode, useState } from "react";

export default function CISectionCollapsible({ iconSrc, headerText, children } : {
    iconSrc?: string,
    headerText: string,
    children: ReactNode,
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleIsOpen = () => setIsOpen((prev) => !prev);

    return(
        <div className={styles.CISectionCollapsible}>
            <div className={styles.CISectionTop}>
                <div className={styles.info}>
                    { iconSrc && <Image src={iconSrc} alt={iconSrc} width={16} height={16} />}
                    <h5 className={styles.collapsibleHeader}>{headerText}</h5>
                </div>
                <button className={styles.chevronButton} onClick={toggleIsOpen}>
                    <Image className={`${styles.chevron} ${!isOpen && styles.closedChevron}`} src="/icons/chevron_down_secondary.svg" alt="Chevron down" width={20} height={20} />
                </button>
            </div>
            {isOpen && 
                <div>{children}</div>
            }
        </div>
    );
}
