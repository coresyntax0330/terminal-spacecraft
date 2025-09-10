import React from "react";
import Image from "next/image";

// import style
import styles from "@/assets/css/main.module.css";

// import assets
import BackgroundImg from "@/assets/images/background.png";

// import components
import Dashboard from "./layout/Dashboard";
import Prediction from "./layout/Prediction";
import Result from "./layout/Result";
import DashboardSection from "./layout/DashboardSection";
import ResultSection from "./layout/ResultSection";
import PredictionSection from "./layout/PredictionSection";
import FooterSection from "./layout/FooterSection";
import ToastProvider from "@/components/ToastProvider";

const Main = () => {
  return (
    <div className={styles.mainSection}>
      <Image
        src={BackgroundImg}
        alt="Background"
        className={styles.backgroundImg}
        priority
        fill
      />
      <div className={styles.bodySection}>
        <div className={styles.wrapperSection}>
          <div className={styles.leftSection}>
            <Dashboard />
          </div>
          <div className={styles.rightSection}>
            <div className={styles.predictionSection}>
              <Prediction />
            </div>
            <div className={styles.resultSection}>
              <Result />
            </div>
          </div>
        </div>
      </div>

      <ToastProvider>
        <DashboardSection />
        <ResultSection />
        <PredictionSection />
        <FooterSection />
      </ToastProvider>
    </div>
  );
};

export default Main;
