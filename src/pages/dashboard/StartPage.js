import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";

// import styles
import styles from "@/assets/css/dashboard/startpage.module.css";

const StartPage = () => {
  const messages = [
    "Initializing Abstractors Core...",
    "Loading Fleet Protocols...",
    "Verifying Stations NFT Registry...",
    "Connecting To Interstellar NETWORK...",
    "Status: ONLINE...",
  ];

  const [displayed, setDisplayed] = useState([]); // finished lines
  const [currentLine, setCurrentLine] = useState(""); // being typed
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    if (lineIndex < messages.length) {
      const currentText = messages[lineIndex];
      if (charIndex < currentText.length) {
        const timeout = setTimeout(() => {
          setCurrentLine((prev) => prev + currentText[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 15); // typing speed
        return () => clearTimeout(timeout);
      } else {
        // line finished
        setDisplayed((prev) => [...prev, currentText]);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex((prev) => prev + 1);
      }
    } else if (lineIndex === messages.length) {
      // all finished -> redirect
      const timer = setTimeout(() => {
        dispatch(pageSet("alert"));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [charIndex, lineIndex]);

  return (
    <div className={styles.main}>
      {/* Finished lines */}
      {displayed.map((msg, index) => (
        <div key={index} className={styles.item}>
          &gt; {msg}
        </div>
      ))}

      {/* Currently typing line */}
      {lineIndex < messages.length && (
        <div className={styles.item}>&gt; {currentLine}</div>
      )}
    </div>
  );
};

export default StartPage;
