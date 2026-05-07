import Image from "next/image"
import styles from "./Hero.module.css"

export default function Hero() {
    return <div className={styles.hero}>
        <div className={styles.heroColumnLeft}>
            <h1 className={styles.heroTitleText}>We pull, you review.</h1>
            <p className={styles.heroSubtext}>Get started in just two easy steps.</p>
            <div className={styles.heroButtonSection}></div>
        </div>
        <div className={styles.heroImageWrapper}>
            <Image src="landing_page/hero_image.svg" alt="PullerType bear on iceberg" fill/>
        </div>
    </div>
}