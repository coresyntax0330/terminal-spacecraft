import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

// import slice
import { pageSet } from "@/redux/slices/pageSlice";

// import style
import styles from "@/assets/css/dashboard/claimpage.module.css";

// import utils
import { rewardContractAddress } from "@/utils/contract";
import { rewardABI } from "@/utils/abis/reward";
import { useToast } from "@/components/ToastProvider";

const ClaimPage = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [buyLoading, setBuyLoading] = useState(false);
  const { writeContract, data: txHash, error: writeError } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  // Handle Buy Spacecraft button click
  const handleClaimRewards = async () => {
    try {
      setBuyLoading(true);

      await writeContract({
        address: rewardContractAddress,
        abi: rewardABI,
        functionName: "claimRewards",
      });
    } catch (err) {
      console.error("Error occurred while claiming:", err);
      showToast("Error occurred while claiming");
      setBuyLoading(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("Claimed successfully!");
      setBuyLoading(true);
      dispatch(pageSet(""));
    }
    console.log(writeError, "--erro--");
  }, [isSuccess, writeError]);

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
            onClick={() => handleClaimRewards()}
            disabled={buyLoading}
          >
            &gt; 1. {buyLoading ? "Loading..." : "Yes"}
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => dispatch(pageSet(""))}
          >
            &gt; 2. NO
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimPage;
