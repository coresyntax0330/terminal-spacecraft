import React, { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import Image from "next/image";

// import style
import styles from "@/assets/css/dashboard/shipmodal.module.css";

// import assets
import ShipBisonImg from "@/assets/images/ships/Bison.png";
import ShipDiabloImg from "@/assets/images/ships/Diablo.png";
import ShipCargoImg from "@/assets/images/ships/Cargo.png";

// import component
import { spacecraftPurchaseContractAddress } from "@/utils/contract";
import { spacecraftPurchaseABI } from "@/utils/abis/spacecraftPurchase";
import { useToast } from "@/components/ToastProvider";

const SHIP_IMAGES = {
  Bison: ShipBisonImg,
  Diablo: ShipDiabloImg,
  Cargo: ShipCargoImg,
};

const ShipModal = ({ setShipFlag, shipGame }) => {
  const { showToast } = useToast();
  const { writeContract, data: txHash, error: writeError } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const [shipActive, setShipActive] = useState(
    shipGame.status === "On" ? true : false
  );

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
      setShipActive(!shipActive);
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
          src={
            shipGame && shipGame.hasImage && shipGame.imageKey
              ? SHIP_IMAGES[shipGame.imageKey]
              : ShipEmptyImg
          }
          alt="ship"
          className={styles.shipImg}
          priority
        />
        <div className={styles.descSection}>
          <div className={styles.desc}>FLEET POWER: 125</div>
          <div className={styles.desc}>LOREM IPSUM PROPELLANT POWER</div>
          <div className={styles.desc}>LOREM IPSUM (Non-NFT)</div>
        </div>
      </div>
      <div className={styles.content}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged.
      </div>
      <div className={styles.deploySection}>
        <div className={styles.text}>Deploy</div>
        <button
          type="button"
          className={styles.status}
          onClick={() => handleToggleShipActive(shipGame.tokenId, shipActive)}
        >
          {shipActive ? "On" : "Off"}
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
