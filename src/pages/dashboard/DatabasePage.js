import React from "react";
import { useDispatch } from "react-redux";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";
import { walletStatusSet } from "@/redux/slices/walletSlice";

// import style
import styles from "@/assets/css/dashboard/databasepage.module.css";

// import component
import { useToast } from "@/components/ToastProvider";

// import abi
import { abstractorTokenContractAddress } from "@/utils/contract";
import { abstractorTokenContractABI } from "@/utils/abis/abstractor";

const DatabasePage = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { showToast } = useToast();
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
  });

  const { data: balanceToken, isSuccess } = useReadContract({
    address: abstractorTokenContractAddress,
    abi: abstractorTokenContractABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { logout } = useLoginWithAbstract();

  const handleCopy = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      showToast("Copied!");
    }
  };

  const formattedBalance = balance
    ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
    : "0.0000 ETH";

  return (
    <div className={styles.main}>
      <div className={styles.title}>Database</div>
      <div className={styles.subTitle}>
        You wallet information and ETH balances
      </div>
      <div className={styles.wrapper}>
        <div className={styles.item}>
          <div className={styles.text}>Token Balances</div>
        </div>
        <div className={styles.item}>
          <div className={styles.text}>ETH</div>
          <div className={styles.text}>
            {!isBalanceLoading ? formattedBalance : "Loading..."}
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.text}>Token</div>
          <div className={styles.text}>
            {isSuccess
              ? Number(
                  Number(
                    Number(balanceToken?.toString()) / 1000000000000000000
                  ).toFixed(2)
                ) + " UFO"
              : "Loading..."}
          </div>
        </div>
        <div className={styles.barItem}>
          <div className={styles.barText}>
            {address ? address : "Loading..."}
          </div>
          <div className={styles.barMobileText}>
            {address
              ? address.substring(0, 8) +
                "..." +
                address.substring(address.length - 8)
              : "Loading..."}
          </div>
          <button type="button" className={styles.btnText} onClick={handleCopy}>
            [Copy]
          </button>
        </div>
      </div>
      <div className={styles.subTitle}>
        Share your referral link with a fellow space degen and earn a 2.5% bonus
        of whatever eth their ship mines
      </div>
      <div className={styles.wrapper}>
        <div className={styles.item}>
          <div className={styles.text}>Referrals</div>
        </div>
        <div className={styles.item}>
          <div className={styles.text}>Total Referrals:</div>
          <div className={styles.text}>0</div>
        </div>
        <div className={styles.item}>
          <div className={styles.text}>Total Earned:</div>
          <div className={styles.text}>0 $ETH</div>
        </div>
        <div className={styles.barItem}>
          <div className={styles.barText}>
            HTTP://LOREMIPSUM.ETH/REF/0xba46...28do02
          </div>
          <div className={styles.barMobileText}>
            {"HTTP://LOREMIPSUM.ETH/REF/0xba46...28do02".substring(0, 12) +
              "..." +
              "HTTP://LOREMIPSUM.ETH/REF/0xba46...28do02".substring(
                "HTTP://LOREMIPSUM.ETH/REF/0xba46...28do02".length - 8
              )}
          </div>
          <button type="button" className={styles.btnText} onClick={handleCopy}>
            [Copy]
          </button>
        </div>
      </div>
      <button
        type="button"
        className={styles.btn}
        onClick={() => {
          logout();
          setTimeout(() => {
            showToast("Wallet Disconnected!");
            dispatch(pageSet(""));
            dispatch(walletStatusSet(false));
          }, [500]);
        }}
      >
        &gt; 1. Disconnect
      </button>
    </div>
  );
};

export default DatabasePage;
