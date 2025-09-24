import React from "react";
import { useAccount, useReadContract } from "wagmi";
import { LuCopy } from "react-icons/lu";

// import style
import styles from "@/assets/css/prediction/home.module.css";

// import components
import UFOChart from "@/components/UFOChart";
import { useToast } from "@/components/ToastProvider";

// import utils
import { abstractorTokenContractABI } from "@/utils/abis/abstractor";
import { abstractorTokenContractAddress } from "@/utils/contract";

const Home = () => {
  const { isConnected, status, address } = useAccount();
  const { showToast } = useToast();

  const { data: balance, isSuccess } = useReadContract({
    address: abstractorTokenContractAddress,
    abi: abstractorTokenContractABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const handleCopy = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      showToast("Copied!");
    }
  };

  return (
    <div className={styles.main}>
      <UFOChart />
      <div className={styles.info}>
        <div className={styles.wrapper}>
          <div className={styles.name}>Wallet:</div>
          <div className={styles.wallet}>
            <div className={styles.value}>
              {isConnected
                ? address.substring(0, 8) +
                  "..." +
                  address.substring(address.length - 8)
                : status}
            </div>
            {isConnected ? (
              <>
                <button type="button" onClick={handleCopy}>
                  <LuCopy size={12} />
                </button>
              </>
            ) : null}
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.name}>Token:</div>
          <div className={styles.value}>
            {isConnected
              ? isSuccess
                ? Number(
                    Number(
                      Number(balance?.toString()) / 1000000000000000000
                    ).toFixed(2)
                  ) + " UFO"
                : "Loading..."
              : status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
