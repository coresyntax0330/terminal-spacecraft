import React from "react";
import { useDispatch } from "react-redux";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";

// import style
import styles from "@/assets/css/dashboard/databasepage.module.css";

const DatabasePage = () => {
  const dispatch = useDispatch();

  return (
    <div className={styles.main}>
      <div className={styles.title}>Database</div>
      <div className={styles.subTitle}>
        You wallet information and ETH balances
      </div>
      <div className={styles.wrapper}>
        <div className={styles.item}>
          <div className={styles.text}>Token Balances</div>
        </div>
        <div className={styles.item}>
          <div className={styles.text}>ETH</div>
          <div className={styles.text}>0.000000 $ETH</div>
        </div>
        <div className={styles.item}>
          <div className={styles.text}>ETHLoremIPSUM</div>
          <div className={styles.text}>0 $ETHL</div>
        </div>
        <div className={styles.barItem}>
          <div className={styles.text}>
            0xba46uoa928726123809129012a46uoa928726123312328do02
          </div>
          <div className={styles.text}>[Copy]</div>
        </div>
      </div>
      <div className={styles.subTitle}>
        Share your referral link with a fellow space degen and earn a 2.5% bonus
        of whatever eth their ship mines
      </div>
      <div className={styles.wrapper}>
        <div className={styles.item}>
          <div className={styles.text}>Referrals</div>
        </div>
        <div className={styles.item}>
          <div className={styles.text}>Total Referrals:</div>
          <div className={styles.text}>0</div>
        </div>
        <div className={styles.item}>
          <div className={styles.text}>Total Earned:</div>
          <div className={styles.text}>0 $ETH</div>
        </div>
        <div className={styles.barItem}>
          <div className={styles.text}>
            HTTP://LOREMIPSUM.ETH/REF/0xba46...28do02
          </div>
          <div className={styles.text}>[Copy]</div>
        </div>
      </div>
      <button
        type="button"
        className={styles.btn}
        onClick={() => dispatch(pageSet(""))}
      >
        &gt; 1. Disconnect
      </button>
    </div>
  );
};

export default DatabasePage;
