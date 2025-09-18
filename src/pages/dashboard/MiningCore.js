import React, { useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import Image from "next/image";
import { useDispatch } from "react-redux";

// import component
import { useToast } from "@/components/ToastProvider";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";

// import style
import styles from "@/assets/css/dashboard/miningcore.module.css";

// import assets
import Tier1Img from "@/assets/images/station/tier1_1.gif";
import Tier2Img from "@/assets/images/station/tier2_1.gif";
import Tier3Img from "@/assets/images/station/tier3_1.gif";
import Tier4Img from "@/assets/images/station/tier4_1.gif";
import Tier5Img from "@/assets/images/station/tier5_1.gif";

// import contracts
import {
  abstractorTokenContractAddress,
  stationContractAddress,
} from "@/utils/contract";
import { stationABI } from "@/utils/abis/station";
import { abstractorTokenContractABI } from "@/utils/abis/abstractor";

// import utils
import { playUpgrade } from "@/utils/sounds";

const MiningCore = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { address } = useAccount();

  const {
    data: stationInfo,
    isSuccess,
    refetch: stationInfoContractRefetch,
  } = useReadContract({
    address: stationContractAddress,
    abi: stationABI,
    functionName: "getStationInfo",
    args: address ? [address] : undefined,
  });

  const [displayed, setDisplayed] = useState([]); // finished items
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const [ready, setReady] = useState(false);
  const [stationTier, setStationTier] = useState(0);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [refetchedStatus, setRefetchedStatus] = useState(false);

  // ✅ two separate write hooks
  const {
    writeContract: writeApprove,
    data: approveHash,
    isPending: isApprovePending,
  } = useWriteContract();

  const {
    writeContract: writeUpgrade,
    data: upgradeHash,
    isPending: isUpgradePending,
  } = useWriteContract();

  // ✅ tx waiters
  const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });
  const { isSuccess: isUpgradeSuccess } = useWaitForTransactionReceipt({
    hash: upgradeHash,
  });

  const handleApproveUFOToken = async () => {
    if (stationInfo && Number(stationInfo[0]) > 0) {
      console.log(stationTier, "--stationTier--");

      try {
        setUpgradeLoading(true);
        writeApprove({
          address: abstractorTokenContractAddress,
          abi: abstractorTokenContractABI,
          functionName: "approve",
          args: [
            stationContractAddress,
            stationTier === 1
              ? 10000000000000000000n
              : stationTier === 2
              ? 30000000000000000000n
              : stationTier === 3
              ? 80000000000000000000n
              : 550000000000000000000n,
          ],
        });
      } catch (err) {
        console.error("Error Approving UFO Token:", err);
        showToast("Error UFO Approving Token");
        setUpgradeLoading(false);
      }
    } else {
      showToast("Please purchase station first");
    }
  };

  const handleUpgradeStation = async () => {
    try {
      writeUpgrade({
        address: stationContractAddress,
        abi: stationABI,
        functionName: "upgradeStation",
      });
    } catch (err) {
      console.error("Error Upgrading Station:", err);
      showToast("Error while Upgrading Station");
      setBuyLoading(false);
    }
  };

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
      type: "upgradeBtn",
      text: `${
        stationTier === 5
          ? "> 1. Upgraded Max"
          : `> 1. Upgrade Module [${
              stationTier === 1
                ? "10"
                : stationTier === 2
                ? "30"
                : stationTier === 3
                ? "80"
                : stationTier === 4
                ? "550"
                : "0"
            } UFO]`
      }`,
      action: () => {},
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

  useEffect(() => {
    if (isSuccess && stationInfo) {
      if (refetchedStatus) {
        console.log(stationInfo[0], "---station info---");

        setStationTier(Number(stationInfo[0]));
      } else {
        setReady(true);

        setDisplayed([]);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex(0);

        setStationTier(Number(stationInfo[0]));
      }
    }
  }, [isSuccess, stationInfo, refetchedStatus]);

  useEffect(() => {
    if (isApproveSuccess) {
      showToast("UFO Token Approved!");
      handleUpgradeStation();
    }
  }, [isApproveSuccess]);

  // buy success → final success
  useEffect(() => {
    if (isUpgradeSuccess) {
      showToast("Station Upgrade Success!");
      playUpgrade();
      setUpgradeLoading(false);
      setRefetchedStatus(true);
      stationInfoContractRefetch();
    }
  }, [isUpgradeSuccess]);

  useEffect(() => {
    if (!ready) return;

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
  }, [charIndex, lineIndex, skipped, ready]);

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

  if (!ready) {
    return <div className={styles.main}>Loading station info...</div>;
  }

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
            src={
              stationTier === 1
                ? Tier1Img
                : stationTier === 2
                ? Tier2Img
                : stationTier === 3
                ? Tier3Img
                : stationTier === 4
                ? Tier4Img
                : Tier5Img
            }
            alt="ship"
            className={styles.shipImg}
            priority
            quality={100}
            unoptimized
          />
        </div>
      )}

      {/* BUTTONS */}
      <div className={styles.btnGroup}>
        {displayed
          .filter((el) => el.type === "upgradeBtn")
          .map((el, i) => (
            <button
              key={`upgradeBtn-${i}`}
              type="button"
              className={styles.btn}
              onClick={() => handleApproveUFOToken()}
              disabled={
                stationTier === 5 ||
                upgradeLoading ||
                isApprovePending ||
                isUpgradePending
              }
            >
              {upgradeLoading
                ? "> Loading..."
                : `${
                    stationTier === 5
                      ? "> 1. Upgraded Max"
                      : `> 1. Upgrade Module [${
                          stationTier === 1
                            ? "10"
                            : stationTier === 2
                            ? "30"
                            : stationTier === 3
                            ? "80"
                            : stationTier === 4
                            ? "550"
                            : "0"
                        } UFO]`
                  }`}
            </button>
          ))}
        {lineIndex < elements.length && elements[lineIndex].type === "btn" && (
          <button type="button" className={styles.btn}>
            {currentLine}
          </button>
        )}

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
