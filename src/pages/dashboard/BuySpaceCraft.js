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
  abstractorTokenContractAddress,
} from "@/utils/contract";
import { spacecraftPurchaseABI } from "@/utils/abis/spacecraftPurchase";
import { stationABI } from "@/utils/abis/station";
import { abstractorTokenContractABI } from "@/utils/abis/abstractor";

import ExplainLine from "@/components/ExplainLine";
import { useToast } from "@/components/ToastProvider";
import { playDeploy } from "@/utils/sounds";

const BuySpaceCraft = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { address } = useAccount();
  const { data: balance } = useBalance({ address, watch: true });

  // ✅ two separate write hooks
  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isApprovePending,
  } = useWriteContract();

  const {
    writeContract: writeBuy,
    data: buyHash,
    isPending: isBuyPending,
  } = useWriteContract();

  // ✅ tx waiters
  const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });
  const { isSuccess: isBuySuccess } = useWaitForTransactionReceipt({
    hash: buyHash,
  });

  // ✅ read station info
  const { data: stationInfo } = useReadContract({
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
    { type: "image" },
    {
      type: "deployBtn",
      text:
        stationInfo && Number(stationInfo[0]) > 0
          ? "> 1. Deploy SpaceCraft [10 UFO]"
          : "> 1. Purchase station first",
      action: () => {
        if (stationInfo && Number(stationInfo[0]) > 0) {
          handleApproveUFOToken();
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
    { type: "text", text: `*Insufficient ${formattedBalance} Balance` },
  ];

  // typing animation effect
  useEffect(() => {
    if (skipped) return;

    if (lineIndex < elements.length) {
      const current = elements[lineIndex];
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

  // double-click to skip typing
  useEffect(() => {
    let lastTap = 0;

    const handleDoubleClick = () => {
      if (!skipped && lineIndex < elements.length) {
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

  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // approve
  const handleApproveUFOToken = async () => {
    if (stationInfo && Number(stationInfo[0]) > 0) {
      try {
        setBuyLoading(true);
        writeApprove({
          address: abstractorTokenContractAddress,
          abi: abstractorTokenContractABI,
          functionName: "approve",
          args: [spacecraftPurchaseContractAddress, 10000000000000000000n],
        });
      } catch (err) {
        console.error("Error Approving UFO Token:", err);
        showToast("Error UFO Approving Token");
        setBuyLoading(false);
      }
    } else {
      showToast("Please purchase station first");
    }
  };

  // buy
  const handleBuySpaceCraft = async () => {
    try {
      writeBuy({
        address: spacecraftPurchaseContractAddress,
        abi: spacecraftPurchaseABI,
        functionName: "mint",
        args: [address, 1, getRandomInt(50, 250)],
      });
    } catch (err) {
      console.error("Error Buying SpaceCraft:", err);
      showToast("Error Buying SpaceCraft.");
      setBuyLoading(false);
    }
  };

  // approve success → trigger buy
  useEffect(() => {
    if (isApproveSuccess) {
      showToast("✅ UFO Token Approved!");
      handleBuySpaceCraft();
    }
  }, [isApproveSuccess]);

  // buy success → final success
  useEffect(() => {
    if (isBuySuccess) {
      showToast("🚀 Buy Spacecraft Success!");
      setBuyLoading(false);
      playDeploy();
    }
  }, [isBuySuccess]);

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
            explainStyle={{ top: "80px", left: "0" }}
            text="Automatic UFO Generation"
            textStyle={{ order: "1" }}
            dragStyle={{
              order: "2",
              transform: "translate(1px, 8px) rotate(25deg)",
            }}
          />
          <ExplainLine
            explainStyle={{
              top: "50%",
              left: "35px",
              transform: "translateY(-50%)",
            }}
            text="Marketplace Access"
            textStyle={{ order: "1" }}
            dragStyle={{ order: "2" }}
          />
          <ExplainLine
            explainStyle={{ bottom: "80px", left: "0px" }}
            text="Automatic UFO Generation"
            textStyle={{ order: "1" }}
            dragStyle={{
              order: "2",
              transform: "translate(-5px, -7px) rotate(-25deg)",
            }}
          />
          <ExplainLine
            explainStyle={{ top: "80px", right: "0px" }}
            text="Base Fleet Power: 125-550"
            textStyle={{ order: "2" }}
            dragStyle={{
              order: "1",
              transform: "translate(-2px, 8px) rotate(-25deg)",
            }}
          />
          <ExplainLine
            explainStyle={{
              top: "50%",
              right: "5px",
              transform: "translateY(-50%)",
            }}
            text="Scout to heavy Ship NFT"
            textStyle={{ order: "2" }}
            dragStyle={{ order: "1" }}
          />
          <ExplainLine
            explainStyle={{ bottom: "80px", right: "0px" }}
            text="Mining Station (Non-NFT)"
            textStyle={{ order: "2" }}
            dragStyle={{
              order: "1",
              transform: "translate(5px, -7px) rotate(25deg)",
            }}
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
            disabled={buyLoading || isApprovePending || isBuyPending}
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

      {/* PREVIOUS BUTTON */}
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

      {/* BALANCE TEXT */}
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
