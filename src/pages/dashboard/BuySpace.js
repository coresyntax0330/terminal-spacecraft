import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";

// import style
import styles from "@/assets/css/dashboard/buyspace.module.css";

// import assets
import SphereImg from "@/assets/images/sphere.gif";

const BuySpace = () => {
  const dispatch = useDispatch();

  return (
    <div className={styles.main}>
      <div className={styles.title}>Buy Space Station</div>
      <div className={styles.subTitle}>
        Purchase a mining station to deploy your first ship and start earning
        UFO tokens
      </div>
      <div className={styles.wrapper}>
        <Image src={SphereImg} alt="ship" priority className={styles.shipImg} />
      </div>
      <button
        type="button"
        className={styles.deployBtn}
        onClick={() => dispatch(pageSet("miningcore"))}
      >
        &gt; 1. Deploy station [0.1 ETH]
      </button>
      <div className={styles.text}>*Insufficent $eth balance</div>
    </div>
  );
};

export default BuySpace;
