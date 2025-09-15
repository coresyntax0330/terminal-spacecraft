import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// import redux slice
import { pageSet } from "@/redux/slices/pageSlice";

// import style
import styles from "@/assets/css/dashboard/startpage.module.css";

const StartPage = () => {
  const messages = [
    "Initializing Abstractors Core...",
    "Loading Fleet Protocols...",
    "Verifying Stations NFT Registry...",
    "Connecting To Interstellar NETWORK...",
    "Status: ONLINE...",
  ];

  const [displayed, setDisplayed] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [skipped, setSkipped] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (skipped) return;

    if (lineIndex < messages.length) {
      const currentText = messages[lineIndex];
      if (charIndex < currentText.length) {
        const timeout = setTimeout(() => {
          setCurrentLine((prev) => prev + currentText[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 15);
        return () => clearTimeout(timeout);
      } else {
        setDisplayed((prev) => [...prev, currentText]);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex((prev) => prev + 1);
      }
    } else if (lineIndex === messages.length) {
      // ✅ finished typing, now branch based on stationInfo
      const timer = setTimeout(() => {
        dispatch(pageSet("alert"));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [charIndex, lineIndex, skipped]);

  useEffect(() => {
    let lastTap = 0;

    const handleDoubleClick = () => {
      if (!skipped && lineIndex < messages.length) {
        // instantly show all content
        setDisplayed(messages);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex(messages.length);
        setSkipped(true);

        const timer = setTimeout(() => {
          dispatch(pageSet("alert"));
        }, 500);
        return () => clearTimeout(timer);
      }
    };

    const handleTouch = () => {
      const now = Date.now();
      const timeSince = now - lastTap;

      if (timeSince < 300 && timeSince > 0) {
        // double tap detected
        handleDoubleClick();
      }

      lastTap = now;
    };

    window.addEventListener("dblclick", handleDoubleClick);
    window.addEventListener("touchend", handleTouch); // mobile

    return () => {
      window.removeEventListener("dblclick", handleDoubleClick);
      window.removeEventListener("touchend", handleTouch);
    };
  }, [skipped, lineIndex]);

  return (
    <div className={styles.main}>
      {displayed.map((msg, index) => (
        <div key={index} className={styles.item}>
          &gt; {msg}
        </div>
      ))}
      {lineIndex < messages.length && (
        <div className={styles.item}>&gt; {currentLine}</div>
      )}
    </div>
  );
};

export default StartPage;
