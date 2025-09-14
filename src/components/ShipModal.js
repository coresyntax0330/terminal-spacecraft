import React, { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import Image from "next/image";

// import style
import styles from "@/assets/css/dashboard/shipmodal.module.css";

// import component
import { spacecraftPurchaseContractAddress } from "@/utils/contract";
import { spacecraftPurchaseABI } from "@/utils/abis/spacecraftPurchase";
import { useToast } from "@/components/ToastProvider";

const ShipModal = ({ setShipFlag, shipGame }) => {
  const { showToast } = useToast();
  const { writeContract, data: txHash, error: writeError } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const handleToggleShipActive = async (tokenId, status) => {
    try {
      await writeContract({
        address: spacecraftPurchaseContractAddress,
        abi: spacecraftPurchaseABI,
        functionName: "toggleActive",
        args: [tokenId, !status],
      });
    } catch (err) {
      console.error("Error Toggle Active SpaceCraft:", err);
      showToast("Error Toggle Active SpaceCraft.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      showToast("Toggle Success!");
      setShipFlag(false);
    }
  }, [isSuccess]);

  return (
    <div className={styles.main}>
      <div className={styles.headerSection}>
        <div className={styles.headerTitle}>{shipGame.name}</div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setShipFlag(false)}
        >
          [&times;]
        </button>
      </div>
      <div className={styles.wrapper}>
        <Image
          src={shipGame.image}
          alt="ship"
          className={styles.shipImg}
          width={342}
          height={312}
          priority
        />
        <div className={styles.descSection}>
          <div className={styles.desc}>FLEET POWER: {shipGame.fleetPower}</div>
          <div className={styles.desc}>LOREM IPSUM PROPELLANT POWER</div>
          <div className={styles.desc}>LOREM IPSUM (Non-NFT)</div>
        </div>
      </div>
      <div className={styles.content}>{shipGame.description}</div>
      <div className={styles.deploySection}>
        <div className={styles.text}>Deploy</div>
        <button
          type="button"
          className={shipGame.status ? styles.status : styles.offstatus}
          onClick={() =>
            handleToggleShipActive(shipGame.tokenId, shipGame.status)
          }
        >
          {shipGame.status ? "On" : "Off"}
        </button>
      </div>
      <div className={styles.system}>
        <div className={styles.note}>[ System Notes ]</div>
        <div className={styles.note}>
          *One Station per wallet address required.
        </div>
      </div>
    </div>
  );
};

export default ShipModal;
