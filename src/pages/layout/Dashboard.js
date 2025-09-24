import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

// import style
import styles from "@/assets/css/layout/dashboard.module.css";

// import assets
import RockBackgroundImg from "@/assets/images/bg_rocks.png";
import BackgroundImg from "@/assets/images/game-background.png";
import MobileBackgroundImg from "@/assets/images/mobile_game_background.png";

const Dashboard = () => {
  const pagePath = useSelector((state) => state.page.path);

  return (
    <div className={styles.dashboardSection}>
      <Image
        src={BackgroundImg}
        alt="Background"
        className={styles.backgroundImg}
        priority
        quality={100}
      />
      {pagePath === "startbattle" ? (
        <Image
          src={RockBackgroundImg}
          alt="Background"
          className={styles.rockBackgroundImg}
          priority
          quality={100}
        />
      ) : (
        <></>
      )}

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
