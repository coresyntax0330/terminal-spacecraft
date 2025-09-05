import React from "react";
import Image from "next/image";

// import style
import styles from "@/assets/css/layout/result.module.css";

// import assets
import BackgroundImg from "@/assets/images/game-background.png";

const Result = () => {
  return (
    <div className={styles.resultSection}>
      <Image
        src={BackgroundImg}
        alt="Background"
        className={styles.backgroundImg}
        priority
      />
      <div className={styles.backShadow}></div>
    </div>
  );
};

export default Result;
