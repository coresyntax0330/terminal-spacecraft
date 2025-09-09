import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useAccount, useBalance } from "wagmi";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";

// import styles
import styles from "@/assets/css/dashboard/alertpage.module.css";
import { ConnectWalletButton } from "@/components/connect-wallet-button";

const AlertPage = () => {
  const dispatch = useDispatch();
  const { isConnected, status, address } = useAccount();

  // Ordered messages grouped by section
  const sections = [
    { container: "alertTitle", items: ["[Alert]", "No Station Detected!"] },
    {
      container: "subText",
      items: [
        "Purchase a mining station to deploy your first ship and start earning UFO tokens",
      ],
    },
    {
      container: "stationPackage",
      items: [
        { type: "packageTitle", text: "[ Station Package ]" },
        { type: "packageText", text: "Station Core Asset (Non-NFT)" },
        { type: "packageText", text: "2x Random Ship NFTS" },
        { type: "packageText", text: "Base Fleet Power: 200-250" },
      ],
    },
    {
      container: "deployBtn",
      items: [
        {
          type: "deployBtn",
          text: "> 1. Deploy Station [0.1 ETH]",
          action: () => dispatch(pageSet("buyspace")),
        },
      ],
    },

    {
      container: "systemNotes",
      items: [
        { type: "notesItem", text: "[ System Notes ]" },
        {
          type: "notesItem",
          text: "*One Station per wallet address required.",
        },
        { type: "notesItem", text: "*Payment executed via connected wallet." },
        {
          type: "notesItem",
          text: "*Ship NFTs minted instantly after confirmation.",
        },
      ],
    },
  ];

  // Flatten to typing sequence
  const elements = sections.flatMap((section) =>
    section.items.map((item) =>
      typeof item === "string"
        ? { type: section.container, text: item }
        : { ...item, container: section.container }
    )
  );

  const [displayed, setDisplayed] = useState([]); // finished lines
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showBorderBar, setShowBorderBar] = useState(false);

  useEffect(() => {
    if (lineIndex === 3) {
      setShowBorderBar(true);
    }

    if (lineIndex < elements.length) {
      const currentText = elements[lineIndex].text;
      if (charIndex < currentText.length) {
        const timeout = setTimeout(() => {
          setCurrentLine((prev) => prev + currentText[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 15);
        return () => clearTimeout(timeout);
      } else {
        setDisplayed((prev) => [...prev, elements[lineIndex]]);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex((prev) => prev + 1);
      }
    }
  }, [charIndex, lineIndex]);

  return (
    <div className={styles.main}>
      {/* ALERT TITLES */}
      {displayed
        .filter((el) => el.type === "alertTitle")
        .map((el, i) => (
          <div key={`alert-${i}`} className={styles.alertTitle}>
            {el.text}
          </div>
        ))}
      {lineIndex < elements.length &&
        elements[lineIndex].type === "alertTitle" && (
          <div className={styles.alertTitle}>{currentLine}</div>
        )}

      {/* SUBTEXT */}
      {displayed
        .filter((el) => el.type === "subText")
        .map((el, i) => (
          <div key={`sub-${i}`} className={styles.subText}>
            {el.text}
          </div>
        ))}
      {lineIndex < elements.length &&
        elements[lineIndex].type === "subText" && (
          <div className={styles.subText}>{currentLine}</div>
        )}

      {/* STATION PACKAGE */}
      <div
        className={styles.stationPackage}
        style={{ display: showBorderBar ? "flex" : "none" }}
      >
        {displayed
          .filter((el) => el.container === "stationPackage")
          .map((el, i) => (
            <div key={`pkg-${i}`} className={styles[el.type]}>
              {el.text}
            </div>
          ))}
        {lineIndex < elements.length &&
          elements[lineIndex].container === "stationPackage" && (
            <div className={styles[elements[lineIndex].type]}>
              {currentLine}
            </div>
          )}
      </div>

      {/* DEPLOY BUTTON */}
      {displayed
        .filter((el) => el.type === "deployBtn")
        .map((el, i) =>
          !isConnected ? (
            <ConnectWalletButton />
          ) : (
            <button
              key={`btn-${i}`}
              type="button"
              className={styles.deployBtn}
              onClick={el.action || undefined}
            >
              {el.text}
            </button>
          )
        )}
      {lineIndex < elements.length &&
        elements[lineIndex].type === "deployBtn" && (
          <button type="button" className={styles.deployBtn}>
            {currentLine}
          </button>
        )}

      {/* SYSTEM NOTES */}
      <div className={styles.systemNotes}>
        {displayed
          .filter((el) => el.container === "systemNotes")
          .map((el, i) => (
            <div key={`note-${i}`} className={styles.notesItem}>
              {el.text}
            </div>
          ))}
        {lineIndex < elements.length &&
          elements[lineIndex].container === "systemNotes" && (
            <div className={styles.notesItem}>{currentLine}</div>
          )}
      </div>
    </div>
  );
};

export default AlertPage;
