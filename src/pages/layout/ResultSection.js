import React from "react";

// import style
import styles from "@/assets/css/layout/resultSection.module.css";

// import components
import Home from "../result/Home";

const ResultSection = () => {
  return (
    <div className={styles.resultSection}>
      <div className={styles.mainSection}>
        <Home />
      </div>
    </div>
  );
};

export default ResultSection;
