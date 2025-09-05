import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";

// import styles
import styles from "@/assets/css/dashboard/alertpage.module.css";

const AlertPage = () => {
  return (
    <div className={styles.main}>
      <div className={styles.alertTitle}>[Alert]</div>
      <div className={styles.alertTitle}>No Station Detected!</div>
      <div className={styles.subText}>
        Purchase a mining station to deploy your first ship and start earning
        UFO tokens
      </div>
      <div className={styles.stationPackage}>
        <div className={styles.packageTitle}>[ Station Package ]</div>
        <div className={styles.packageText}>Station Core Asset (Non-NFT)</div>
        <div className={styles.packageText}>2x Random Ship NFTS</div>
        <div className={styles.packageText}>Base Fleet Power: 200-250</div>
      </div>
      <button type="button" className={styles.deployBtn}>
        &gt; 1. Deploy Station [0.1 ETH]
      </button>
      <div className={styles.systemNotes}>
        <div className={styles.notesItem}>[ System Notes ]</div>
        <div className={styles.notesItem}>
          *One Station per wallet address required.
        </div>
        <div className={styles.notesItem}>
          *Payment executed via connected wallet.
        </div>
        <div className={styles.notesItem}>
          *Ship NFTs minted instantly after confirmation.
        </div>
      </div>
    </div>
  );
};

export default AlertPage;
