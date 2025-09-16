import React from "react";
import Image from "next/image";

// import style
import styles from "@/assets/css/layout/dashboard.module.css";

// import assets
import BackgroundImg from "@/assets/images/game-background.png";
import MobileBackgroundImg from "@/assets/images/mobile_game_background.png";

const Dashboard = () => {
  return (
    <div className={styles.dashboardSection}>
      <Image
        src={BackgroundImg}
        alt="Background"
        className={styles.backgroundImg}
        priority
        quality={100}
      />
      <Image
        src={MobileBackgroundImg}
        alt="GameBackground"
        className={styles.mobileBackgroundImg}
        priority
        quality={100}
      />
      <div className={styles.backShadow}></div>
    </div>
  );
};

export default Dashboard;
