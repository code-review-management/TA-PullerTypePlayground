import styles from "./HeaderButton.module.css"
import Link from "next/link";
import { MouseEventHandler, ReactNode } from "react";

export default function HeaderButton({ onClick, href, variant, children }: {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    href?: string;
    variant?: "primary" | "secondary";
    children: ReactNode
}) {
    const specialtyStyle = variant === "secondary" ? styles.secondary : styles.primary;

    if (onClick && !href) {
        return(
            <button onClick={onClick} className={`${styles.headerButton} ${specialtyStyle}`}>
                {children}
            </button>
        );
    } else if (href && !onClick) {
        return(
            <Link href={href} className={`${styles.headerButton} ${specialtyStyle}`}>
                {children}
            </Link>
        );
    } else {
        return(
            <div className={`${styles.headerButton} ${specialtyStyle}`}>
                {children}
            </div>
        );
    }
    
}