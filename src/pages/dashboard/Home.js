import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useAccount } from "wagmi";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";
import { walletStatusSet } from "@/redux/slices/walletSlice";

// import style
import styles from "@/assets/css/dashboard/home.module.css";

// import assets
import LogoImg from "@/assets/images/logo.gif";

// import components
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { playStart } from "@/utils/sounds";
import { useToast } from "@/components/ToastProvider";
import { playAddWallet } from "@/utils/sounds";

const Home = () => {
  const dispatch = useDispatch();
  const { isConnected } = useAccount();
  const { showToast } = useToast();

  // Ordered elements
  const elements = [
    { type: "title", text: "ABSTRACTORS" },
    {
      type: "walletBtn",
      text: "Connect Wallet",
    },
    {
      type: "btn",
      text: "> 1. START SYSTEM",
      action: () => {
        dispatch(pageSet("start"));
        playStart();
      },
    },
    {
      type: "btn",
      text: "> 2. OPERATIONS MANUAL",
      action: () => {
        window.open("https://manual.abstractors.io/", "_blank");
      },
    },
    {
      type: "btn",
      text: "> 3. SUPPLY DEPOT",
      action: () => {
        window.open("https://opensea.io/", "_blank");
      },
    },
  ];

  const [displayed, setDisplayed] = useState([]); // finished lines
  const [currentLine, setCurrentLine] = useState(""); // typing line
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (skipped) return;

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
  }, [charIndex, lineIndex, skipped]);

  useEffect(() => {
    const handleDoubleClick = () => {
      if (!skipped && lineIndex < elements.length) {
        // instantly show all content
        setDisplayed(elements);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex(elements.length);
        setSkipped(true);
      }
    };

    window.addEventListener("dblclick", handleDoubleClick);
    return () => window.removeEventListener("dblclick", handleDoubleClick);
  }, [skipped, lineIndex]);

  useEffect(() => {
    if (isConnected) {
      showToast("Wallet Added!");
      dispatch(walletStatusSet(true));
      playAddWallet();
    }
  }, [isConnected]);

  return (
    <div className={styles.wrapper}>
      <Image src={LogoImg} alt="logo" className={styles.logoImg} priority />

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
        {isConnected
          ? displayed
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
              ))
          : displayed
              .filter((el) => el.type === "walletBtn")
              .map((el, idx) => (
                <ConnectWalletButton key={idx} title={el.text} />
              ))}

        {isConnected
          ? lineIndex < elements.length &&
            elements[lineIndex].type === "btn" && (
              <button type="button" className={styles.btn}>
                {currentLine}
              </button>
            )
          : lineIndex < elements.length &&
            elements[lineIndex].type === "walletBtn" && (
              <ConnectWalletButton title={currentLine} />
            )}
      </div>
    </div>
  );
};

export default Home;
