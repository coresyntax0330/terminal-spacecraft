import React from "react";
import { useSelector } from "react-redux";

// import style
import styles from "@/assets/css/layout/dashboardSection.module.css";

// import component
import Home from "../dashboard/Home";
import StartPage from "../dashboard/StartPage";

const DashboardSection = () => {
  const pagePath = useSelector((state) => state.page.path);

  return (
    <div className={styles.dashboardSection}>
      <div className={styles.mainSection}>
        {pagePath === "" ? (
          <Home />
        ) : pagePath === "start" ? (
          <StartPage />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default DashboardSection;
