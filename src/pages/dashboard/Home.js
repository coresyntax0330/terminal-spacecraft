import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";

// import style
import styles from "@/assets/css/dashboard/home.module.css";

// import assets
import LogoImg from "@/assets/images/logo.gif";

// import component
import { ConnectWalletButton } from "@/components/connect-wallet-button";

const Home = () => {
  const dispatch = useDispatch();

  // Ordered elements
  const elements = [
    { type: "title", text: "ABSTRACTORS" },
    {
      type: "btn",
      text: "> 1. START SYSTEM",
      action: () => dispatch(pageSet("start")),
    },
    { type: "btn", text: "> 2. OPERATIONS MANUAL" },
    { type: "btn", text: "> 3. SUPPLY DEPOT" },
  ];

  const [displayed, setDisplayed] = useState([]); // finished lines
  const [currentLine, setCurrentLine] = useState(""); // typing line
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (lineIndex < elements.length) {
      const currentText = elements[lineIndex].text;
      if (charIndex < currentText.length) {
        const timeout = setTimeout(() => {
          setCurrentLine((prev) => prev + currentText[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 15); // typing speed
        return () => clearTimeout(timeout);
      } else {
        setDisplayed((prev) => [
          ...prev,
          { ...elements[lineIndex], text: currentText },
        ]);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex((prev) => prev + 1);
      }
    }
  }, [charIndex, lineIndex]);

  return (
    <div className={styles.wrapper}>
      <Image src={LogoImg} alt="logo" className={styles.logoImg} priority />

      <ConnectWalletButton />
      {/* Title */}
      {displayed.find((el) => el.type === "title") && (
        <div className={styles.title}>
          {displayed.find((el) => el.type === "title")?.text}
        </div>
      )}
      {lineIndex < elements.length && elements[lineIndex].type === "title" && (
        <div className={styles.title}>{currentLine}</div>
      )}

      {/* Menu wrapper */}
      <div className={styles.menu}>
        {/* Finished buttons */}
        {displayed
          .filter((el) => el.type === "btn")
          .map((el, idx) => (
            <button
              key={idx}
              type="button"
              className={styles.btn}
              onClick={el.action || undefined}
            >
              {el.text}
            </button>
          ))}

        {/* Typing button */}
        {lineIndex < elements.length && elements[lineIndex].type === "btn" && (
          <button type="button" className={styles.btn}>
            {currentLine}
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
