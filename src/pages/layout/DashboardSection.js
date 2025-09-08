import React from "react";
import { useSelector } from "react-redux";

// import style
import styles from "@/assets/css/layout/dashboardSection.module.css";

// import component
import Home from "../dashboard/Home";
import StartPage from "../dashboard/StartPage";
import AlertPage from "../dashboard/AlertPage";
import BuySpace from "../dashboard/BuySpace";
import MiningCore from "../dashboard/MiningCore";
import DatabasePage from "../dashboard/DatabasePage";
import RankingPage from "../dashboard/RankingPage";
import ManualPage from "../dashboard/ManualPage";
import ManagementPage from "../dashboard/ManagementPage";
import ClaimPage from "../dashboard/ClaimPage";

const DashboardSection = () => {
  const pagePath = useSelector((state) => state.page.path);
  const walletStatus = useSelector((state) => state.wallet.status);

  return (
    <div className={styles.dashboardSection}>
      <div className={styles.mainSection}>
        {pagePath === "" ? (
          <Home />
        ) : pagePath === "start" ? (
          walletStatus ? (
            <StartPage />
          ) : (
            <Home />
          )
        ) : pagePath === "alert" ? (
          walletStatus ? (
            <AlertPage />
          ) : (
            <Home />
          )
        ) : pagePath === "buyspace" ? (
          walletStatus ? (
            <BuySpace />
          ) : (
            <Home />
          )
        ) : pagePath === "miningcore" ? (
          walletStatus ? (
            <MiningCore />
          ) : (
            <Home />
          )
        ) : pagePath === "databasepage" ? (
          walletStatus ? (
            <DatabasePage />
          ) : (
            <Home />
          )
        ) : pagePath === "rankingpage" ? (
          walletStatus ? (
            <RankingPage />
          ) : (
            <Home />
          )
        ) : pagePath === "manualpage" ? (
          walletStatus ? (
            <ManualPage />
          ) : (
            <Home />
          )
        ) : pagePath === "managementpage" ? (
          walletStatus ? (
            <ManagementPage />
          ) : (
            <Home />
          )
        ) : pagePath === "claimpage" ? (
          walletStatus ? (
            <ClaimPage />
          ) : (
            <Home />
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default DashboardSection;
