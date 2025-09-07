import React from "react";
import { useDispatch } from "react-redux";
import { pageSet } from "@/redux/slices/pageSlice";

// import style
import styles from "@/assets/css/dashboard/claimpage.module.css";

const ClaimPage = () => {
  const dispatch = useDispatch();

  return (
    <div className={styles.main}>
      <div className={styles.section}>
        <div className={styles.headerSection}>
          <div className={styles.headerTitle}>Operation Confirmation</div>
          <button
            className={styles.closeBtn}
            type="button"
            onClick={() => dispatch(pageSet(""))}
          >
            [&times;]
          </button>
        </div>
        <div
          className={styles.subTitle}
        >{`Confirm to authorize {{ ACTION }}.`}</div>
        <div className={styles.resourceSection}>
          <div>{`Resource: {{RESOURCE}}`}</div>
          <div>{`Amount/Value: {{VALUE}}`}</div>
          <div>{`Estimated Fees: {{FEE}}`}</div>
          <div>{`From: {{SOURCE}}`}</div>
          <div>{`To: {{DESTINATION}}`}</div>
        </div>
        <div className={styles.confirmText}>Proceed with Authorization?</div>
        <div className={styles.btnGroup}>
          <button
            type="button"
            className={styles.btn}
            onClick={() => dispatch(pageSet("start"))}
          >
            &gt; 1. YES
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => dispatch(pageSet("start"))}
          >
            &gt; 2. NO
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimPage;
