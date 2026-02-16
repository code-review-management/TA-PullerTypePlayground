import Image from "next/image";
import styles from "./StateChip.module.css"
import { State, COLOR_CLASSES, ICONS } from "./stateConstants";

export default function StateChip({ state }:{
    state: State,
}) {
    const colorClass = COLOR_CLASSES[state];
    const iconSrc = ICONS[state];
    const stateDisplay = `${state[0].toUpperCase()}${state.slice(1)}`;

    return(
        <div className={`${styles.stateChip} ${colorClass}`}>
            <Image src={`/icons/${iconSrc}`} alt={state} height={16} width={16}/>
            <p>{stateDisplay}</p>
        </div>
    );
}
