import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useAccount, useBalance, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";

// import style
import styles from "@/assets/css/dashboard/buyspace.module.css";

// import assets
import SphereImg from "@/assets/images/sphere.gif";
import { parseEther } from "viem";

// Smart Contract details
import { stationPurchaseContractAddress } from "@/utils/contract";
import { stationPurchaseABI } from "@/utils/abis/stationPurchase";

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
      text: "> 1. Deploy station [0.001 ETH]",
      // action: () => dispatch(pageSet("miningcore")),
      action: () => handleBuyStation(),
    },
    { type: "text", text: "*Insufficent $eth balance" },
  ];

  // Fetching Account balance
  const { isConnected, status, address } = useAccount();
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
    watch: true,
  });

  // ✅ Hooks at the top level
  const { writeContract, data: txHash, error: writeError } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const formattedBalance = balance
    ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
    : "0.0000 ETH";

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

  useEffect(() => {
    if (isSuccess) {
      dispatch(pageSet("miningcore"));
    }
  }, [isSuccess, dispatch]);

  // Handle Buy Station button click
  const handleBuyStation = async () => {
    try {
      await writeContract({
        address: stationPurchaseContractAddress,
        abi: stationPurchaseABI,
        functionName: "buyStation",
        value: parseEther("0.001"),
      });
    } catch (err) {
      console.error("Error buying station:", err);
    }
  };

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
      {formattedBalance < 0.001 ? (<>{displayed
        .filter((el) => el.type === "text")
        .map((el, i) => (
          <div key={`text-${i}`} className={styles.text}>
            {el.text}
          </div>
        ))}
        {lineIndex < elements.length && elements[lineIndex].type === "text" && (
          <div className={styles.text}>{currentLine}</div>
        )}</>) : (<div className={styles.text}>You have sufficient balance: {formattedBalance}</div>)}

    </div>
  );
};

export default BuySpace;
