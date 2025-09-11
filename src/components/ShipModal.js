import React, { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import Image from "next/image";

// import style
import styles from "@/assets/css/dashboard/shipmodal.module.css";

// import assets
import ShipArachnidImg from "@/assets/images/ships/Arachnid.png";
import ShipArcBlasterImg from "@/assets/images/ships/ArcBlaster.png";
import ShipAreisuImg from "@/assets/images/ships/Areisu.png";
import ShipBisonImg from "@/assets/images/ships/Bison.png";
import ShipCargoImg from "@/assets/images/ships/Cargo.png";
import ShipCrossbowImg from "@/assets/images/ships/Crossbow.png";
import ShipCruxioImg from "@/assets/images/ships/Cruxio.png";
import ShipDestructorImg from "@/assets/images/ships/Destructor.png";
import ShipDiabloImg from "@/assets/images/ships/Diablo.png";
import ShipDivergerImg from "@/assets/images/ships/Diverger.png";
import ShipDodgeChargerImg from "@/assets/images/ships/DodgeCharger.png";
import ShipEmptyImg from "@/assets/images/ships/empty.png";
import ShipEndraImg from "@/assets/images/ships/Endra.png";
import ShipFirebirdImg from "@/assets/images/ships/Firebird.png";
import ShipHarbingerImg from "@/assets/images/ships/Harbinger.png";
import ShipHullImg from "@/assets/images/ships/Hull.png";
import ShipMjolnirMarkVImg from "@/assets/images/ships/MjolnirMarkV.png";
import ShipNorthStarImg from "@/assets/images/ships/NorthStar.png";
import ShipNTeslaImg from "@/assets/images/ships/NTesla.png";
import ShipPointBreakImg from "@/assets/images/ships/PointBreak.png";
import ShipRavenImg from "@/assets/images/ships/Raven.png";
import ShipSciFighterImg from "@/assets/images/ships/SciFighter.png";
import ShipScorpionImg from "@/assets/images/ships/Scorpion.png";
import ShipSeraphImg from "@/assets/images/ships/Seraph.png";
import ShipSkyjetImg from "@/assets/images/ships/Skyjet.png";
import ShipStarblasterImg from "@/assets/images/ships/Starblaster.png";
import ShipStarSparrowImg from "@/assets/images/ships/StarSparrow.png";
import ShipSwitchBladeImg from "@/assets/images/ships/SwitchBlade.png";
import ShipTridentImg from "@/assets/images/ships/Trident.png";
import ShipVanguardImg from "@/assets/images/ships/Vanguard.png";

// import component
import { spacecraftPurchaseContractAddress } from "@/utils/contract";
import { spacecraftPurchaseABI } from "@/utils/abis/spacecraftPurchase";
import { useToast } from "@/components/ToastProvider";

const SHIP_IMAGES = {
  Arachnid: ShipArachnidImg,
  ArcBlaster: ShipArcBlasterImg,
  Areisu: ShipAreisuImg,
  Bison: ShipBisonImg,
  Cargo: ShipCargoImg,
  Crossbow: ShipCrossbowImg,
  Cruxio: ShipCruxioImg,
  Destructor: ShipDestructorImg,
  Diablo: ShipDiabloImg,
  Diverger: ShipDivergerImg,
  DodgeCharger: ShipDodgeChargerImg,
  Empty: ShipEmptyImg,
  Endra: ShipEndraImg,
  Firebird: ShipFirebirdImg,
  Harbinger: ShipHarbingerImg,
  Hull: ShipHullImg,
  MjolnirMarkV: ShipMjolnirMarkVImg,
  NorthStar: ShipNorthStarImg,
  NTesla: ShipNTeslaImg,
  PointBreak: ShipPointBreakImg,
  Raven: ShipRavenImg,
  SciFighter: ShipSciFighterImg,
  Scorpion: ShipScorpionImg,
  Seraph: ShipSeraphImg,
  Skyjet: ShipSkyjetImg,
  Starblaster: ShipStarblasterImg,
  StarSparrow: ShipStarSparrowImg,
  SwitchBlade: ShipSwitchBladeImg,
  Trident: ShipTridentImg,
  Vanguard: ShipVanguardImg,
};

const ShipModal = ({ setShipFlag, shipGame }) => {
  const { showToast } = useToast();
  const { writeContract, data: txHash, error: writeError } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const [shipActive, setShipActive] = useState(false);

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
