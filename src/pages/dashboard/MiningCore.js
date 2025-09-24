import React, { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useReadContract,
  useReadContracts,
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
  rewardContractAddress,
  spacecraftPurchaseContractAddress,
  stationContractAddress,
} from "@/utils/contract";
import { abstractorTokenContractABI } from "@/utils/abis/abstractor";
import { stationABI } from "@/utils/abis/station";
import { rewardABI } from "@/utils/abis/reward";
import { spacecraftPurchaseABI } from "@/utils/abis/spacecraftPurchase";

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

  const {
    data: balanceToken,
    isSuccess: isBalanceTokenSuccess,
    refetch: balanceTokenRefetch,
  } = useReadContract({
    address: abstractorTokenContractAddress,
    abi: abstractorTokenContractABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: totalShipPower, isSuccess: isTotalShipPowerSuccess } =
    useReadContract({
      address: rewardContractAddress,
      abi: rewardABI,
      functionName: "getTotalActiveFleetPower",
    });

  const { data: tokenIds, isSuccess: isTokenSuccess } = useReadContract({
    address: spacecraftPurchaseContractAddress,
    abi: spacecraftPurchaseABI,
    functionName: "getOwnedShips",
    args: address ? [address] : undefined,
  });

  const { data: tokenActiveData, isSuccess: isActiveSuccess } =
    useReadContracts({
      contracts: (tokenIds || []).map((id) => ({
        address: spacecraftPurchaseContractAddress,
        abi: spacecraftPurchaseABI,
        functionName: "isActive",
        args: [id],
      })),
    });

  const { data: pendingRewards, isSuccess: isPendingRewardsSuccess } =
    useReadContract({
      address: rewardContractAddress,
      abi: rewardABI,
      functionName: "calculatePendingRewards",
      args: address ? [address] : undefined,
    });

  const { data: hourlyEarnings, isSuccess: isHourlyEarningsSuccess } =
    useReadContract({
      address: rewardContractAddress,
      abi: rewardABI,
      functionName: "getUserHourlyEmission",
      args: address ? [address] : undefined,
    });

  const { data: totalClaimedToken, isSuccess: isTotalClaimedTokenSuccess } =
    useReadContract({
      address: rewardContractAddress,
      abi: rewardABI,
      functionName: "getTotalClaimed",
      args: address ? [address] : undefined,
    });

  const activeTokens = useMemo(() => {
    if (!tokenIds || !tokenActiveData) return [];

    return tokenIds.filter((_, idx) => tokenActiveData[idx]?.result === true);
  }, [tokenIds, tokenActiveData]);

  const totalCount = tokenIds?.length ?? 0;
  const activeCount = activeTokens.length;

  const formattedTotal = String(totalCount).padStart(2, "0");
  const formattedActive = String(activeCount).padStart(2, "0");

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
      if (isBalanceTokenSuccess) {
        const toDoTokenBalance =
          stationTier === 1
            ? 10
            : stationTier === 2
            ? 30
            : stationTier === 3
            ? 80
            : 550;

        if (
          Number(
            Number(
              Number(balanceToken?.toString()) / 1000000000000000000
            ).toFixed(2)
          ) < toDoTokenBalance
        ) {
          showToast("Insufficient Token Balance!");
        } else {
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
        }
      } else {
        showToast("Please wait! Loading assets...");
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
    { type: "leftSectionFleetSlots", text: "Fleet slots Detected: [0/0]" },
    { type: "leftSectionTotalFleetPower", text: "Total Fleet Power: [0]" },
    { type: "leftSectionTarget", text: "Target: [Level 1]" },

    { type: "rightSection", text: "Mining Module... [Online]" },
    { type: "rightSectionClaimable", text: "Claimable: 0.0 UFO" },
    { type: "rightSectionHourly", text: "Hourly Emission: 0.0 UFO" },
    { type: "rightSectionMined", text: "Mined Today: 0.0 UFO" },

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
      balanceTokenRefetch();
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
          {displayed
            .filter((el) => el.type === "leftSectionFleetSlots")
            .map((el, i) => (
              <div
                key={`left-${i}`}
              >{`Fleet slots Detected: [${formattedActive}/${formattedTotal}]`}</div>
            ))}
          {lineIndex < elements.length &&
            elements[lineIndex].type === "leftSectionFleetSlots" && (
              <div>{currentLine}</div>
            )}
          {displayed
            .filter((el) => el.type === "leftSectionTotalFleetPower")
            .map((el, i) => (
              <div key={`left-${i}`}>{`Total Fleet Power: [${
                isTotalShipPowerSuccess ? totalShipPower : 0
              }]`}</div>
            ))}
          {lineIndex < elements.length &&
            elements[lineIndex].type === "leftSectionTotalFleetPower" && (
              <div>{currentLine}</div>
            )}
          {displayed
            .filter((el) => el.type === "leftSectionTarget")
            .map((el, i) => (
              <div key={`left-${i}`}>{`Target: [Level ${stationInfo[0]}]`}</div>
            ))}
          {lineIndex < elements.length &&
            elements[lineIndex].type === "leftSectionTarget" && (
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
          {displayed
            .filter((el) => el.type === "rightSectionClaimable")
            .map((el, i) => (
              <div key={`right-${i}`}>
                Claimable:{" "}
                {isPendingRewardsSuccess
                  ? Number(
                      Number(
                        Number(pendingRewards[0]?.toString()) /
                          1000000000000000000
                      ).toFixed(2)
                    )
                  : 0.0}{" "}
                UFO
              </div>
            ))}
          {lineIndex < elements.length &&
            elements[lineIndex].type === "rightSectionClaimable" && (
              <div>{currentLine}</div>
            )}
          {displayed
            .filter((el) => el.type === "rightSectionHourly")
            .map((el, i) => (
              <div key={`right-${i}`}>
                Hourly Emission:{" "}
                {isHourlyEarningsSuccess
                  ? Number(
                      Number(
                        Number(hourlyEarnings?.toString()) / 1000000000000000000
                      ).toFixed(2)
                    )
                  : 0.0}{" "}
                UFO
              </div>
            ))}
          {lineIndex < elements.length &&
            elements[lineIndex].type === "rightSectionHourly" && (
              <div>{currentLine}</div>
            )}
          {displayed
            .filter((el) => el.type === "rightSectionMined")
            .map((el, i) => (
              <div key={`right-${i}`}>
                Mined Today:{" "}
                {isTotalClaimedTokenSuccess
                  ? Number(
                      Number(
                        Number(totalClaimedToken) / 1000000000000000000
                      ).toFixed(2)
                    )
                  : 0}{" "}
                UFO
              </div>
            ))}
          {lineIndex < elements.length &&
            elements[lineIndex].type === "rightSectionMined" && (
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
        {lineIndex < elements.length &&
          elements[lineIndex].type === "upgradeBtn" && (
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
