import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import {
  useAccount,
  useBalance,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";

// import style
import styles from "@/assets/css/dashboard/buyspace.module.css";

// import assets
import SphereImg from "@/assets/images/sphere.gif";

// Smart Contract details
import { stationPurchaseContractAddress } from "@/utils/contract";
import { stationPurchaseABI } from "@/utils/abis/stationPurchase";
import ExplainLine from "@/components/ExplainLine";
import { useToast } from "@/components/ToastProvider";

const BuySpace = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { writeContract, data: txHash, error: writeError } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  // Fetching Account balance
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    watch: true,
  });

  const formattedBalance = balance
    ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
    : "0.0000 ETH";

  const [displayed, setDisplayed] = useState([]); // finished lines
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

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
      action: () => handleBuyStation(),
    },
    { type: "text", text: `*Insufficent ${formattedBalance} Balance` },
  ];

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
      showToast("Buy Station Success!");
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
      showToast("Error buying station.");
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
          <ExplainLine
            explainStyle={{
              top: "80px",
              left: "0",
            }}
            textStyle={{
              order: "1",
            }}
            dragStyle={{
              order: "2",
              transform: "translate(1px, 8px) rotate(25deg)",
            }}
            text="Automatic UFO Generation"
          />
          <ExplainLine
            explainStyle={{
              top: "50%",
              left: "35px",
              transform: "translateY(-50%)",
            }}
            textStyle={{
              order: "1",
            }}
            dragStyle={{
              order: "2",
            }}
            text="Marketplace Access"
          />
          <ExplainLine
            explainStyle={{
              bottom: "80px",
              left: "0px",
            }}
            textStyle={{
              order: "1",
            }}
            dragStyle={{
              order: "2",
              transform: "translate(-5px, -7px) rotate(-25deg)",
            }}
            text="Automatic UFO Generation"
          />
          <ExplainLine
            explainStyle={{
              top: "80px",
              right: "0px",
            }}
            textStyle={{
              order: "2",
            }}
            dragStyle={{
              order: "1",
              transform: "translate(-2px, 8px) rotate(-25deg)",
            }}
            text="Base Fleet Power: 100-150"
          />
          <ExplainLine
            explainStyle={{
              top: "50%",
              right: "30px",
              transform: "translateY(-50%)",
            }}
            textStyle={{
              order: "2",
            }}
            dragStyle={{
              order: "1",
            }}
            text="Scout-Class Ship NFT"
          />
          <ExplainLine
            explainStyle={{
              bottom: "80px",
              right: "0px",
            }}
            textStyle={{
              order: "2",
            }}
            dragStyle={{
              order: "1",
              transform: "translate(5px, -7px) rotate(25deg)",
            }}
            text="Mining Station (Non-NFT)"
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

      {/* SUFFICIENT BALANCE */}
      {displayed
        .filter((el) => el.type === "text")
        .map((el, i) => (
          <div key={`btn-${i}`} className={styles.text}>
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
