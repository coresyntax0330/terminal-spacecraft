import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";

// import style
import styles from "@/assets/css/dashboard/buyspace.module.css";

// import assets
import SphereImg from "@/assets/images/sphere.gif";

const BuySpace = () => {
  const dispatch = useDispatch();

  // Ordered sequence
  const elements = [
    { type: "title", text: "Buy Space Station" },
    {
      type: "subTitle",
      text: "Purchase a mining station to deploy your first ship and start earning UFO tokens",
    },
    { type: "image" }, // static image
    {
      type: "deployBtn",
      text: "> 1. Deploy station [0.1 ETH]",
      action: () => dispatch(pageSet("miningcore")),
    },
    { type: "text", text: "*Insufficent $eth balance" },
  ];

  const [displayed, setDisplayed] = useState([]); // finished lines
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (lineIndex < elements.length) {
      const current = elements[lineIndex];
      // image doesn't need typing
      if (current.type === "image") {
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
  }, [charIndex, lineIndex]);

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

      {/* SUBTITLE */}
      {displayed
        .filter((el) => el.type === "subTitle")
        .map((el, i) => (
          <div key={`sub-${i}`} className={styles.subTitle}>
            {el.text}
          </div>
        ))}
      {lineIndex < elements.length &&
        elements[lineIndex].type === "subTitle" && (
          <div className={styles.subTitle}>{currentLine}</div>
        )}

      {/* IMAGE */}
      {displayed.find((el) => el.type === "image") && (
        <div className={styles.wrapper}>
          <Image
            src={SphereImg}
            alt="ship"
            priority
            className={styles.shipImg}
          />
        </div>
      )}

      {/* DEPLOY BUTTON */}
      {displayed
        .filter((el) => el.type === "deployBtn")
        .map((el, i) => (
          <button
            key={`btn-${i}`}
            type="button"
            className={styles.deployBtn}
            onClick={el.action || undefined}
          >
            {el.text}
          </button>
        ))}
      {lineIndex < elements.length &&
        elements[lineIndex].type === "deployBtn" && (
          <button type="button" className={styles.deployBtn}>
            {currentLine}
          </button>
        )}

      {/* FOOTER TEXT */}
      {displayed
        .filter((el) => el.type === "text")
        .map((el, i) => (
          <div key={`text-${i}`} className={styles.text}>
            {el.text}
          </div>
        ))}
      {lineIndex < elements.length && elements[lineIndex].type === "text" && (
        <div className={styles.text}>{currentLine}</div>
      )}
    </div>
  );
};

export default BuySpace;
