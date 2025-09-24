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
import BuySpaceCraft from "../dashboard/BuySpaceCraft";
import StartBattle from "../dashboard/StartBattle";

const DashboardSection = () => {
  const pagePath = useSelector((state) => state.page.path);

  return (
    <div className={styles.dashboardSection}>
      <div className={styles.mainSection}>
        {pagePath === "" ? (
          <Home />
        ) : pagePath === "start" ? (
          <StartPage />
        ) : pagePath === "alert" ? (
          <AlertPage />
        ) : pagePath === "buyspace" ? (
          <BuySpace />
        ) : pagePath === "buyspacecraft" ? (
          <BuySpaceCraft />
        ) : pagePath === "miningcore" ? (
          <MiningCore />
        ) : pagePath === "databasepage" ? (
          <DatabasePage />
        ) : pagePath === "rankingpage" ? (
          <RankingPage />
        ) : pagePath === "manualpage" ? (
          <ManualPage />
        ) : pagePath === "managementpage" ? (
          <ManagementPage />
        ) : pagePath === "claimpage" ? (
          <ClaimPage />
        ) : pagePath === "startbattle" ? (
          <StartBattle />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default DashboardSection;
