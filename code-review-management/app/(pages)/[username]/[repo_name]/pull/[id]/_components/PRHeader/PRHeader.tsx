import HeaderButton from "@/app/(pages)/_components/HeaderButton/HeaderButton";
import styles from "./PRHeader.module.css"

export default function PRHeader() {
    return(
        <div className={styles.PRHeader}>
            <HeaderButton variant="secondary">View Files</HeaderButton>
            <HeaderButton variant="secondary">Add review</HeaderButton>
            <HeaderButton>Merge</HeaderButton>
        </div>
    );
}