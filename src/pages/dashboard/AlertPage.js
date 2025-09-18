import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAccount, useReadContract } from "wagmi";

// import components
import { stationABI } from "@/utils/abis/station";
import { stationContractAddress } from "@/utils/contract";
import { useToast } from "@/components/ToastProvider";
import { ConnectWalletButton } from "@/components/connect-wallet-button";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";
import { stationStatusSet } from "@/redux/slices/stationSlice";

// import styles
import styles from "@/assets/css/dashboard/alertpage.module.css";

function AlertPage() {
  const dispatch = useDispatch();
  const { isConnected, address } = useAccount();
  const { showToast } = useToast();

  // ✅ read station info
  const { data: stationInfo, isSuccess } = useReadContract({
    address: stationContractAddress,
    abi: stationABI,
    functionName: "getStationInfo",
    args: address ? [address] : undefined,
  });

  // Typing animation states
  const [displayed, setDisplayed] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showBorderBar, setShowBorderBar] = useState(false);
  const [showSpaceBorderBar, setShowSpaceBorderBar] = useState(false);
  const [skipped, setSkipped] = useState(false);

  // Readiness flag
  const [ready, setReady] = useState(false);

  // When stationInfo arrives → reset typing animation
  useEffect(() => {
    if (isSuccess && stationInfo) {
      setReady(true);

      setDisplayed([]);
      setCurrentLine("");
      setCharIndex(0);
      setLineIndex(0);
      setShowBorderBar(false);
      setShowSpaceBorderBar(false);

      if (Number(stationInfo[0]) > 0) {
        showToast("You already have station.");
      }
    }
  }, [isSuccess, stationInfo, showToast]);

  // Ordered messages grouped by section
  const sections = [
    {
      container: "alertTitle",
      items: [
        "[Alert]",
        Number(stationInfo?.[0]) > 0
          ? "Station Detected!"
          : "No Station Detected!",
      ],
    },
    {
      container: "subText",
      items: [
        "Purchase a mining station to deploy your first ship and start earning UFO tokens",
      ],
    },
    {
      container: "systemNotes",
      items: [
        { type: "notesItem", text: "[ System Notes ]" },
        {
          type: "notesItem",
          text: "> One Station per wallet address required.",
        },
        { type: "notesItem", text: "> Payment executed via connected wallet." },
        {
          type: "notesItem",
          text: "> Ship NFTs minted instantly after confirmation.",
        },
      ],
    },
    {
      container: "stationPackage",
      items: [
        { type: "packageTitle", text: "[ Station Pack ]" },
        { type: "packageText", text: "Station Core Asset" },
        { type: "packageText", text: "2x Random Ship NFTS" },
        { type: "packageText", text: "Base Fleet Power: 200-800" },
      ],
    },
    {
      container: "deployBtn",
      items: [
        {
          type: "deployBtn",
          text:
            Number(stationInfo?.[0]) > 0
              ? "> Go to Mining Page"
              : "> 1. Deploy Station [0.001 ETH]",
          action: () => {
            if (Number(stationInfo?.[0]) > 0) {
              dispatch(pageSet("miningcore"));
            } else {
              dispatch(pageSet("buyspace"));
            }
          },
        },
      ],
    },
    {
      container: "spacecraftsPackage",
      items: [
        { type: "packageTitle", text: "[ Spacecrafts Pack ]" },
        { type: "packageText", text: "Boosted Pack" },
        { type: "packageText", text: "2x Random Ship NFTS" },
        { type: "packageText", text: "Base Fleet Power: 125-550" },
      ],
    },
    {
      container: "deploySpaceBtn",
      items: [
        {
          type: "deploySpaceBtn",
          text: "> 1. Deploy Spacecrafts Pack [1000 UFO]",
          action: () => dispatch(pageSet("buyspacecraft")),
        },
      ],
    },
  ];

  const elements = sections.flatMap((section) =>
    section.items.map((item) =>
      typeof item === "string"
        ? { type: section.container, text: item }
        : { ...item, container: section.container }
    )
  );

  // Typing effect (runs only when ready)
  useEffect(() => {
    if (!ready) return;

    if (skipped) return;

    if (lineIndex === 7) setShowBorderBar(true);
    if (lineIndex === 12) setShowSpaceBorderBar(true);

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
  }, [charIndex, lineIndex, elements, ready, skipped]);

  useEffect(() => {
    let lastTap = 0;

    const handleDoubleClick = () => {
      if (!skipped && lineIndex < elements.length) {
        // instantly show all content
        setDisplayed(elements);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex(elements.length);
        setShowBorderBar(true);
        setShowSpaceBorderBar(true);
        setSkipped(true);
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

  // ⬅️ Important: hooks are all above this return
  if (!ready) {
    return <div className={styles.main}>Loading station info...</div>;
  }

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
            <ConnectWalletButton key={`btn-${i}`} />
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

      {/* SPACECRAFTS PACKAGE */}
      <div
        className={styles.stationPackage}
        style={{ display: showSpaceBorderBar ? "flex" : "none" }}
      >
        {displayed
          .filter((el) => el.container === "spacecraftsPackage")
          .map((el, i) => (
            <div key={`pkg-${i}`} className={styles[el.type]}>
              {el.text}
            </div>
          ))}
        {lineIndex < elements.length &&
          elements[lineIndex].container === "spacecraftsPackage" && (
            <div className={styles[elements[lineIndex].type]}>
              {currentLine}
            </div>
          )}
      </div>

      {/* DEPLOY SPACE BUTTON */}
      {displayed
        .filter((el) => el.type === "deploySpaceBtn")
        .map((el, i) =>
          !isConnected ? (
            <ConnectWalletButton key={`btn-space-${i}`} />
          ) : (
            <button
              key={`btn-space-${i}`}
              type="button"
              className={styles.deployBtn}
              onClick={el.action || undefined}
            >
              {el.text}
            </button>
          )
        )}
      {lineIndex < elements.length &&
        elements[lineIndex].type === "deploySpaceBtn" && (
          <button type="button" className={styles.deployBtn}>
            {currentLine}
          </button>
        )}
    </div>
  );
}

export default AlertPage;
