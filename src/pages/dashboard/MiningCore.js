import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";

// import style
import styles from "@/assets/css/dashboard/miningcore.module.css";

// import assets
import SphereImg from "@/assets/images/sphere.gif";

const MiningCore = () => {
  const dispatch = useDispatch();

  return (
    <div className={styles.main}>
      <div className={styles.title}>Mining Core</div>
      <div className={styles.section}>
        <div className={styles.leftSection}>
          <div>Initializing Station Check... [Online]</div>
          <div>Fleet slots Detected: [05/09]</div>
          <div>Total Fleet Power: [4820]</div>
          <div>Target: [Level 4]</div>
        </div>
        <div className={styles.rightSection}>
          <div>Mining Module... [Online]</div>
          <div>Claimable: 124.5 $UFO</div>
          <div>Hourly Emission: 56.7 $UFO</div>
          <div>Mined Today: 987.6 $UFO</div>
        </div>
      </div>
      <div className={styles.wrapper}>
        <Image src={SphereImg} alt="ship" className={styles.shipImg} priority />
      </div>
      <div className={styles.btnGroup}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => dispatch(pageSet("alert"))}
        >
          &gt; 1. Upgrade Module [250 UFO]
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={() => dispatch(pageSet("managementpage"))}
        >
          &gt; 2. Fleet Management
        </button>
        <button type="button" className={styles.btn}>
          &gt; 3. Supply Depot
        </button>
      </div>
    </div>
  );
};

export default MiningCore;
