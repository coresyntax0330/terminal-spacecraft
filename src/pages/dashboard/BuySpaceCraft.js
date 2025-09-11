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
import CruxioImg from "@/assets/images/cruxio.png";

// Smart Contract details
import {
  stationContractAddress,
  spacecraftPurchaseContractAddress,
} from "@/utils/contract";
import { spacecraftPurchaseABI } from "@/utils/abis/spacecraftPurchase";
import { stationABI } from "@/utils/abis/station";
import ExplainLine from "@/components/ExplainLine";
import { useToast } from "@/components/ToastProvider";
import { playDeploy } from "@/utils/sounds";

const BuySpaceCraft = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { writeContract, data: txHash, error: writeError } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
    watch: true,
  });

  // ✅ read station info for the connected wallet
  const { data: stationInfo, isSuccess: isReadSuccess } = useReadContract({
    address: stationContractAddress,
    abi: stationABI,
    functionName: "getStationInfo",
    args: address ? [address] : undefined,
  });

  const formattedBalance = balance
    ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
    : "0.0000 ETH";

  const [displayed, setDisplayed] = useState([]); // finished lines
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [buyLoading, setBuyLoading] = useState(false);
  const [skipped, setSkipped] = useState(false);

  // Ordered sequence
  const elements = [
    { type: "title", text: "Buy SpaceCraft" },
    {
      type: "subTitle",
      text: "Purchase a Ship, Deploy IT, And Start generating UFO Tokens",
    },
    { type: "image" }, // static image
    {
      type: "deployBtn",
      text:
        stationInfo && Number(stationInfo[0]) > 0
          ? "> 1. Deploy SpaceCraft [1000 UFO]"
          : "> 1. Purchase station first",
      action: () => {
        if (stationInfo && Number(stationInfo[0]) > 0) {
          handleBuySpaceCraft();
        } else {
          dispatch(pageSet("buyspace"));
        }
      },
    },
    {
      type: "previousBtn",
      text: "> 2. Go to previous page",
      action: () => dispatch(pageSet("alert")),
    },
    { type: "text", text: `*Insufficent ${formattedBalance} Balance` },
  ];

  useEffect(() => {
    if (skipped) return;

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
  }, [charIndex, lineIndex, skipped]);

  useEffect(() => {
    if (isSuccess) {
      showToast("Buy Spacecrafts Success!");
      playDeploy();
      setBuyLoading(true);
      dispatch(pageSet("miningcore"));
    }
  }, [isSuccess, dispatch]);

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

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Handle Buy Spacecraft button click
  const handleBuySpaceCraft = async () => {
    if (stationInfo && Number(stationInfo[0]) > 0) {
      try {
        setBuyLoading(true);

        await writeContract({
          address: spacecraftPurchaseContractAddress,
          abi: spacecraftPurchaseABI,
          functionName: "mint",
          args: [address, stationInfo[0], 1, getRandomInt(150, 250)],
        });
      } catch (err) {
        console.error("Error Buying SpaceCraft:", err);
        showToast("Error Buying SpaceCraft.");
        setBuyLoading(false);
      }
    } else {
      showToast("Please purchase station first");
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
            src={CruxioImg}
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
            text="Base Fleet Power: 125-550"
          />
          <ExplainLine
            explainStyle={{
              top: "50%",
              right: "5px",
              transform: "translateY(-50%)",
            }}
            textStyle={{
              order: "2",
            }}
            dragStyle={{
              order: "1",
            }}
            text="Scout to heavy Ship NFT"
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
            disabled={buyLoading}
          >
            {buyLoading ? "> Loading..." : el.text}
          </button>
        ))}
      {lineIndex < elements.length &&
        elements[lineIndex].type === "deployBtn" && (
          <button type="button" className={styles.deployBtn}>
            {currentLine}
          </button>
        )}

      {/* Previous BUTTON */}
      {displayed
        .filter((el) => el.type === "previousBtn")
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
        elements[lineIndex].type === "previousBtn" && (
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

export default BuySpaceCraft;
