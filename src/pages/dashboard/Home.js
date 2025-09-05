import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";

// import style
import styles from "@/assets/css/dashboard/home.module.css";

// import assets
import LogoImg from "@/assets/images/logo.gif";

const Home = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Image src={LogoImg} alt="logo" className={styles.logoImg} priority />
      <div className={styles.title}>ABSTRACTORS</div>
      <div className={styles.menu}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => dispatch(pageSet("start"))}
        >
          &gt; 1. START SYSTEM
        </button>
        <button type="button" className={styles.btn}>
          &gt; 2. OPERATIONS MANUAL
        </button>
        <button type="button" className={styles.btn}>
          &gt; 3. SUPPLY DEPOT
        </button>
      </div>
    </>
  );
};

export default Home;
