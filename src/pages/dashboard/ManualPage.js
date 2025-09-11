import React, { useEffect, useState } from "react";

// import style
import styles from "@/assets/css/dashboard/manualpage.module.css";

const ManualPage = () => {
  const sections = [
    {
      subTitle: "Quick Summary",
      texts: [
        "Buy a Spacecraft Pack (Starter or market).",
        "Deploy Spacecrafts into your fleet. They start generating $UFO every hour.",
        "Reinvest $UFO into more Spacecrafts or upgrades to scale your Fleet Power and earnings.",
      ],
    },
    {
      subTitle: "Player Goals",
      texts: [
        "Build a fleet that produces predictable hourly $UFO.",
        "Decide the strategy: broad (many Tier 1 Spacecrafts) or deep (fewer high-tier ships + upgrades).",
        "Leverage packs, seasonal events, and marketplace trades to increase Fleet Power.",
      ],
    },
    {
      subTitle: "Suggested Play Styles",
      texts: [
        "Casual: Buy a starter pack, collect hourly $UFO, gradually expand.",
        "Strategic/Investor: Optimize tier & Level mix, reinvest for compounding yield.",
        "Collector: Target rare Tier 3 & Tier 4 Spacecrafts and limited packs.",
      ],
    },
  ];

  const miningSection = [
    "Fleet Mining",
    "The game’s reward engine calculates hourly emissions and credits user accounts in near real time.",
    "Fleet Power: Each Spacecraft contributes Base Fleet Power (determined by tier + level).",
    "Player Share = PlayerFleetPower/TotalFleetPower",
    "Emission Distribution: Every hour, the system allocates the Hourly Emission Pool and distributes rewards proportionally.",
  ];

  const exampleTexts = [
    "[EXAMPLE]",
    "*Global Fleet Power: 100,000",
    "*Your Fleet Power: 1,000 → 1% Share",
    "*Hourly Emission: 100,000 $UFO → Your payout = 1,000 $UFO for that hour.",
  ];

  // Flatten all texts into one sequence
  const elements = [
    { type: "title", text: "Information" },
    ...sections.flatMap((s) => [
      { type: "subTitle", text: s.subTitle },
      ...s.texts.map((t) => ({ type: "text", text: t })),
    ]),
    ...miningSection.map((t) => ({ type: "mineText", text: t })),
    ...exampleTexts.map((t) => ({ type: "text", text: t })),
  ];

  const [displayed, setDisplayed] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showBorderBar, setShowBorderBar] = useState(false);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (skipped) return;

    if (lineIndex === 13) {
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
  }, [charIndex, lineIndex, skipped]);

  useEffect(() => {
    const handleDoubleClick = () => {
      if (!skipped && lineIndex < elements.length) {
        // instantly show all content
        setDisplayed(elements);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex(elements.length);
        setShowBorderBar(true);
        setSkipped(true);
      }
    };

    window.addEventListener("dblclick", handleDoubleClick);
    return () => window.removeEventListener("dblclick", handleDoubleClick);
  }, [skipped, lineIndex]);

  return (
    <div className={styles.main}>
      {/* Title */}
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

      <div className={styles.wrapper}>
        {/* Sections */}
        {sections.map((section, sIdx) => (
          <div key={`section-${sIdx}`} className={styles.section}>
            {/* Subtitle */}
            {displayed.find((el) => el.text === section.subTitle) ? (
              <div className={styles.subTitle}>{section.subTitle}</div>
            ) : lineIndex < elements.length &&
              elements[lineIndex].text === section.subTitle ? (
              <div className={styles.subTitle}>{currentLine}</div>
            ) : null}

            {/* Content */}
            <div className={styles.content}>
              {section.texts.map((t, i) =>
                displayed.find((el) => el.text === t) ? (
                  <div key={i} className={styles.text}>
                    {t}
                  </div>
                ) : lineIndex < elements.length &&
                  elements[lineIndex].text === t ? (
                  <div key={i} className={styles.text}>
                    {currentLine}
                  </div>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mining section */}
      <div
        className={styles.miningSection}
        style={{ display: showBorderBar ? "flex" : "none" }}
      >
        {miningSection.map((t, i) =>
          displayed.find((el) => el.text === t) ? (
            <div key={i} className={styles.mineText}>
              {t}
            </div>
          ) : lineIndex < elements.length && elements[lineIndex].text === t ? (
            <div key={i} className={styles.mineText}>
              {currentLine}
            </div>
          ) : null
        )}
      </div>

      {/* Example block */}
      <div className={styles.content}>
        {exampleTexts.map((t, i) =>
          displayed.find((el) => el.text === t) ? (
            <div key={i} className={styles.text}>
              {t}
            </div>
          ) : lineIndex < elements.length && elements[lineIndex].text === t ? (
            <div key={i} className={styles.text}>
              {currentLine}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default ManualPage;
