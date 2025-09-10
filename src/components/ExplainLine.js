import React from "react";

// import style
import styles from "@/assets/css/dashboard/buyspace.module.css";

const ExplainLine = ({ explainStyle, textStyle, dragStyle, text }) => {
  return (
    <div className={styles.lineExplain} style={explainStyle}>
      <div className={styles.lineText} style={textStyle}>
        {text}
      </div>
      <div className={styles.lineDrag} style={dragStyle}>
        &nbsp;
      </div>
    </div>
  );
};

export default ExplainLine;
