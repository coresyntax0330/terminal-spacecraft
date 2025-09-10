import React from "react";
import { useDispatch } from "react-redux";
import { useAccount } from "wagmi";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";

// import style
import styles from "@/assets/css/layout/footerSection.module.css";

// import assets
import MiningImg from "@/assets/images/buttons/mining.png";
import DatabaseImg from "@/assets/images/buttons/database.png";
import RankingImg from "@/assets/images/buttons/ranking.png";
import ManualImg from "@/assets/images/buttons/manual.png";
import ClaimImg from "@/assets/images/buttons/claim.png";

// hover images
import MiningHoverImg from "@/assets/images/buttons/mining_hover.png";
import DatabaseHoverImg from "@/assets/images/buttons/database_hover.png";
import RankingHoverImg from "@/assets/images/buttons/ranking_hover.png";
import ManualHoverImg from "@/assets/images/buttons/manual_hover.png";
import ClaimHoverImg from "@/assets/images/buttons/claim_hover.png";

// press images
import MiningPressImg from "@/assets/images/buttons/mining_press.png";
import DatabasePressImg from "@/assets/images/buttons/database_press.png";
import RankingPressImg from "@/assets/images/buttons/ranking_press.png";
import ManualPressImg from "@/assets/images/buttons/manual_press.png";
import ClaimPressImg from "@/assets/images/buttons/claim_press.png";

// import components
import FooterButton from "@/components/FooterButton";
import { playButtonClick, playClaim } from "@/utils/sounds";
import { useToast } from "@/components/ToastProvider";

const FooterSection = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { isConnected } = useAccount();

  return (
    <div className={styles.footerSection}>
      <div className={styles.mainSection}>
        <div className={styles.leftSection}>
          <FooterButton
            defaultImg={MiningImg}
            hoverImg={MiningHoverImg}
            pressImg={MiningPressImg}
            alt="Mining Button"
            className={styles.buttonImg}
            style={{ left: "10px" }}
            onClick={() => {
              if (isConnected) {
                dispatch(pageSet("miningcore"));
                playButtonClick();
              } else {
                showToast("Please connect wallet.");
              }
            }}
          />
          <FooterButton
            defaultImg={DatabaseImg}
            hoverImg={DatabaseHoverImg}
            pressImg={DatabasePressImg}
            alt="Database Button"
            className={styles.buttonImg}
            style={{ left: "182px" }}
            onClick={() => {
              if (isConnected) {
                dispatch(pageSet("databasepage"));
                playButtonClick();
              } else {
                showToast("Please connect wallet.");
              }
            }}
          />
          <FooterButton
            defaultImg={RankingImg}
            hoverImg={RankingHoverImg}
            pressImg={RankingPressImg}
            alt="Ranking Button"
            className={styles.buttonImg}
            style={{ right: "184px" }}
            onClick={() => {
              if (isConnected) {
                dispatch(pageSet("rankingpage"));
                playButtonClick();
              } else {
                showToast("Please connect wallet.");
              }
            }}
          />
          <FooterButton
            defaultImg={ManualImg}
            hoverImg={ManualHoverImg}
            pressImg={ManualPressImg}
            alt="Manual Button"
            className={styles.buttonImg}
            style={{ right: "12px" }}
            onClick={() => {
              if (isConnected) {
                dispatch(pageSet("manualpage"));
                playButtonClick();
              } else {
                showToast("Please connect wallet.");
              }
            }}
          />
        </div>
        <div className={styles.rightSection}>
          <FooterButton
            defaultImg={ClaimImg}
            hoverImg={ClaimHoverImg}
            pressImg={ClaimPressImg}
            alt="Claim Button"
            className={styles.buttonRightImg}
            style={{ right: "50%", transform: "translateX(50%)" }}
            onClick={() => {
              dispatch(pageSet("claimpage"));
              playClaim();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FooterSection;
