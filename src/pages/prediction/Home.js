import React from "react";
import Image from "next/image";

// import style
import styles from "@/assets/css/prediction/home.module.css";

// import assets
import ChartImg from "@/assets/images/chart.png";
import UFOChart from "@/components/UFOChart";

const Home = () => {
  return (
    <div className={styles.main}>
      <UFOChart />
      <div className={styles.info}>
        <div className={styles.wrapper}>
          <div className={styles.name}>Wallet:</div>
          <div className={styles.value}>0x928b273h2826718d8912371o28327</div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.name}>Token:</div>
          <div className={styles.value}>1,250.00 UFO</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
