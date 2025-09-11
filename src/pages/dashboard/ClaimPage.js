import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useAccount,
  useReadContract,
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
  const { address } = useAccount();
  const { writeContract, data: txHash, error: writeError } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const { data: pendingRewards, isSuccess: isPendingRewardsSuccess } =
    useReadContract({
      address: rewardContractAddress,
      abi: rewardABI,
      functionName: "calculatePendingRewards",
      args: address ? [address] : undefined,
    });

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
        <div className={styles.subTitle}>Confirm to authorize Withdraw</div>
        <div className={styles.resourceSection}>
          <div>Resource: UFO</div>
          <div>
            Amount/Value:{" "}
            {isPendingRewardsSuccess
              ? Number(
                  Number(
                    Number(pendingRewards[0]?.toString()) / 1000000000000000000
                  ).toFixed(4)
                )
              : 0.0}{" "}
            UFO
          </div>
          <div>Estimated Fees: 0.001 ETH</div>
          <div>From: In Game Wallet</div>
          <div>{`To: ${address}`}</div>
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
