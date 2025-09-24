import React, { useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";

// import style
import styles from "@/assets/css/result/home.module.css";

// import utils
import {
  abstractorTokenContractAddress,
  rewardContractAddress,
} from "@/utils/contract";
import { abstractorTokenContractABI } from "@/utils/abis/abstractor";
import { rewardABI } from "@/utils/abis/reward";

const Home = () => {
  const { address } = useAccount();

  const { data: shipPower, isSuccess: isShipPowerSuccess } = useReadContract({
    address: rewardContractAddress,
    abi: rewardABI,
    functionName: "getFleetPower",
    args: address ? [address] : undefined,
  });

  const { data: totalShipPower, isSuccess: isTotalShipPowerSuccess } =
    useReadContract({
      address: rewardContractAddress,
      abi: rewardABI,
      functionName: "getTotalActiveFleetPower",
    });

  const { data: totalClaimedToken, isSuccess: isTotalClaimedTokenSuccess } =
    useReadContract({
      address: rewardContractAddress,
      abi: rewardABI,
      functionName: "getTotalClaimed",
      args: address ? [address] : undefined,
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

  const { data: balance, isSuccess: isBalanceSuccess } = useReadContract({
    address: abstractorTokenContractAddress,
    abi: abstractorTokenContractABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  return (
    <div className={styles.main}>
      <div className={styles.wrapper}>
        <div className={styles.title}>Station Control</div>
        <div className={styles.item}>
          <div className={styles.name}>UFO Balance:</div>
          <div className={styles.name}>
            {isBalanceSuccess
              ? Number(
                  Number(
                    Number(balance?.toString()) / 1000000000000000000
                  ).toFixed(2)
                )
              : 0}{" "}
            UFO
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.name}>Station Status:</div>
          <div className={styles.name}>Active</div>
        </div>
        <div className={styles.item}>
          <div className={styles.name}>Fleet Power:</div>
          <div className={styles.name}>
            {isShipPowerSuccess ? Number(shipPower) : 0}
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.name}>Hourly Earnings:</div>
          <div className={styles.name}>
            {isHourlyEarningsSuccess
              ? Number(
                  Number(
                    Number(hourlyEarnings?.toString()) / 1000000000000000000
                  ).toFixed(2)
                )
              : 0.0}{" "}
            UFO
          </div>
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.title}>Network Stats</div>
        {/* <div className={styles.item}>
          <div className={styles.name}>Next Emission:</div>
          <div className={styles.name}>0 Blocks</div>
        </div> */}
        <div className={styles.item}>
          <div className={styles.name}>Emission Per block:</div>
          <div className={styles.name}>
            {isPendingRewardsSuccess
              ? Number(
                  Number(
                    Number(pendingRewards[1]?.toString()) / 1000000000000000000
                  ).toFixed(2)
                )
              : 0.0}{" "}
            UFO
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.name}>Total Fleet Power:</div>
          <div className={styles.name}>
            {isTotalShipPowerSuccess ? totalShipPower : 0}
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.name}>Total Burned:</div>
          <div className={styles.name}>0.00</div>
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.title}>Mining Ship</div>
        <div className={styles.item}>
          <div className={styles.name}>Ship Type:</div>
          <div className={styles.name}>Scout-Class</div>
        </div>
        <div className={styles.item}>
          <div className={styles.name}>Mining Rate:</div>
          <div className={styles.name}>2.5 THZ/s</div>
        </div>
        <div className={styles.item}>
          <div className={styles.name}>Fleet Share:</div>
          <div className={styles.name}>0.003765%</div>
        </div>
        <div className={styles.item}>
          <div className={styles.name}>Daily Yield:</div>
          <div className={styles.name}>0.00 UFO</div>
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.item}>
          <div className={styles.name}>Earned:</div>
          <div className={styles.name}>
            {isTotalClaimedTokenSuccess
              ? Number(
                  Number(
                    Number(totalClaimedToken) / 1000000000000000000
                  ).toFixed(2)
                )
              : 0}{" "}
            UFO
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
