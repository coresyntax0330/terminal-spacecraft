import React from "react";

// import style
import styles from "@/assets/css/layout/predictionSection.module.css";

// import components
import Home from "../prediction/Home";

const PredictionSection = () => {
  return (
    <div className={styles.predictionSection}>
      <div className={styles.mainSection}>
        <Home />
      </div>
    </div>
  );
};

export default PredictionSection;
