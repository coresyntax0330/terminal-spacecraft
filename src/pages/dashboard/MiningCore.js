import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";

// import style
import styles from "@/assets/css/dashboard/miningcore.module.css";

// import assets
import SphereImg from "@/assets/images/sphere.gif";

const MiningCore = () => {
  const dispatch = useDispatch();

  // Ordered sequence of elements
  const elements = [
    { type: "title", text: "Mining Core" },

    { type: "leftSection", text: "Initializing Station Check... [Online]" },
    { type: "leftSection", text: "Fleet slots Detected: [05/09]" },
    { type: "leftSection", text: "Total Fleet Power: [4820]" },
    { type: "leftSection", text: "Target: [Level 4]" },

    { type: "rightSection", text: "Mining Module... [Online]" },
    { type: "rightSection", text: "Claimable: 124.5 $UFO" },
    { type: "rightSection", text: "Hourly Emission: 56.7 $UFO" },
    { type: "rightSection", text: "Mined Today: 987.6 $UFO" },

    { type: "image" },

    {
      type: "btn",
      text: "> 1. Upgrade Module [250 UFO]",
      action: () => dispatch(pageSet("alert")),
    },
    {
      type: "btn",
      text: "> 2. Fleet Management",
      action: () => dispatch(pageSet("managementpage")),
    },
    { type: "btn", text: "> 3. Supply Depot" },
    {
      type: "btn",
      text: "> 4. Go to previous page",
      action: () => dispatch(pageSet("alert")),
    },
  ];

  const [displayed, setDisplayed] = useState([]); // finished items
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (skipped) return;

    if (lineIndex < elements.length) {
      const current = elements[lineIndex];
      if (current.type === "image") {
        // show image instantly
        setDisplayed((prev) => [...prev, current]);
        setLineIndex((prev) => prev + 1);
        return;
      }

      const currentText = current.text;
      if (charIndex < currentText.length) {
        const timeout = setTimeout(() => {
          setCurrentLine((prev) => prev + currentText[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 15);
        return () => clearTimeout(timeout);
      } else {
        setDisplayed((prev) => [...prev, current]);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex((prev) => prev + 1);
      }
    }
  }, [charIndex, lineIndex, skipped]);

  useEffect(() => {
    let lastTap = 0;

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
      {/* TITLE */}
      {displayed
        .filter((el) => el.type === "title")
        .map((el, i) => (
          <div key={`title-${i}`} className={styles.title}>
            {el.text}
          </div>
        ))}
      {lineIndex < elements.length && elements[lineIndex].type === "title" && (
        <div className={styles.title}>{currentLine}</div>
      )}

      {/* SECTION (left + right) */}
      <div className={styles.section}>
        <div className={styles.leftSection}>
          {displayed
            .filter((el) => el.type === "leftSection")
            .map((el, i) => (
              <div key={`left-${i}`}>{el.text}</div>
            ))}
          {lineIndex < elements.length &&
            elements[lineIndex].type === "leftSection" && (
              <div>{currentLine}</div>
            )}
        </div>

        <div className={styles.rightSection}>
          {displayed
            .filter((el) => el.type === "rightSection")
            .map((el, i) => (
              <div key={`right-${i}`}>{el.text}</div>
            ))}
          {lineIndex < elements.length &&
            elements[lineIndex].type === "rightSection" && (
              <div>{currentLine}</div>
            )}
        </div>
      </div>

      {/* IMAGE */}
      {displayed.find((el) => el.type === "image") && (
        <div className={styles.wrapper}>
          <Image
            src={SphereImg}
            alt="ship"
            className={styles.shipImg}
            priority
            quality={100}
          />
        </div>
      )}

      {/* BUTTONS */}
      <div className={styles.btnGroup}>
        {displayed
          .filter((el) => el.type === "btn")
          .map((el, i) => (
            <button
              key={`btn-${i}`}
              type="button"
              className={styles.btn}
              onClick={el.action || undefined}
            >
              {el.text}
            </button>
          ))}
        {lineIndex < elements.length && elements[lineIndex].type === "btn" && (
          <button type="button" className={styles.btn}>
            {currentLine}
          </button>
        )}
      </div>
    </div>
  );
};

export default MiningCore;
