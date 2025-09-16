import React from "react";
import Image from "next/image";

// import style
import styles from "@/assets/css/layout/prediction.module.css";

// import assets
import BackgroundImg from "@/assets/images/game-background.png";

const Prediction = () => {
  return (
    <div className={styles.predictionSection}>
      <Image
        src={BackgroundImg}
        alt="Background"
        className={styles.backgroundImg}
        priority
        quality={100}
      />
      <div className={styles.backShadow}></div>
    </div>
  );
};

export default Prediction;
