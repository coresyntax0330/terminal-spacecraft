import React, { useState } from "react";
import Image from "next/image";

// import style
import styles from "@/assets/css/main.module.css";

// import assets
import BackgroundImg from "@/assets/images/background.png";
import MobileBackgroundImg from "@/assets/images/mobile_background.png";
import MobileNavbarImg from "@/assets/images/mobile_navbar.png";

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
  const [isNavbar, setIsNavbar] = useState(false);

  return (
    <div className={styles.mainSection}>
      <Image
        src={BackgroundImg}
        alt="Background"
        className={styles.backgroundImg}
        priority
        quality={100}
      />
      <Image
        src={MobileBackgroundImg}
        alt="Background"
        className={styles.mobileBackgroundImg}
        priority
        quality={100}
      />
      <div className={styles.bodySection}>
        <div className={styles.wrapperSection}>
          <div className={styles.leftSection}>
            <Dashboard />
          </div>
          <div
            className={styles.rightSection}
            style={{
              right: isNavbar
                ? "0px"
                : "calc((368 / 402 * -100vw) + (32 / 402 * 100vw))",
            }}
          >
            <div className={styles.rightSubSection}>
              <div className={styles.predictionSection}>
                <Prediction />
              </div>
              <div className={styles.resultSection}>
                <Result />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastProvider>
        <DashboardSection />
        <div
          className={styles.mobileNavbarSection}
          style={{
            right: isNavbar
              ? "0px"
              : "calc((368 / 402 * -100vw) + (32 / 402 * 100vw))",
          }}
        >
          <div className={styles.mobileNavbarSubSection}>
            <Image
              src={MobileNavbarImg}
              alt="Navbar"
              className={styles.mobileNavbarBackgroundimg}
              priority
              quality={100}
            />
            <button
              type="button"
              className={styles.navbarBtn}
              onClick={() => setIsNavbar(!isNavbar)}
            />
            <ResultSection />
            <PredictionSection />
          </div>
        </div>
        <FooterSection />
      </ToastProvider>
    </div>
  );
};

export default Main;
