import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAccount, useReadContract } from "wagmi";

import { stationABI } from "@/utils/abis/station";
import { stationContractAddress } from "@/utils/contract";
import { pageSet } from "@/redux/slices/pageSlice";
import styles from "@/assets/css/dashboard/startpage.module.css";

const StartPage = () => {
  const messages = [
    "Initializing Abstractors Core...",
    "Loading Fleet Protocols...",
    "Verifying Stations NFT Registry...",
    "Connecting To Interstellar NETWORK...",
    "Status: ONLINE...",
  ];

  const [displayed, setDisplayed] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();

  // ✅ read station info for the connected wallet
  const { data: stationInfo, isSuccess } = useReadContract({
    address: stationContractAddress,
    abi: stationABI,
    functionName: "getStationInfo",
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (lineIndex < messages.length) {
      const currentText = messages[lineIndex];
      if (charIndex < currentText.length) {
        const timeout = setTimeout(() => {
          setCurrentLine((prev) => prev + currentText[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 15);
        return () => clearTimeout(timeout);
      } else {
        setDisplayed((prev) => [...prev, currentText]);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex((prev) => prev + 1);
      }
    } else if (lineIndex === messages.length && isConnected && isSuccess) {
      // ✅ finished typing, now branch based on stationInfo
      const timer = setTimeout(() => {
        if (stationInfo && Number(stationInfo[0]) > 0) {
          // if tier > 0 => owns station
          dispatch(pageSet("miningcore"));
        } else {
          dispatch(pageSet("alert"));
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [charIndex, lineIndex, isConnected, isSuccess, stationInfo, dispatch]);

  return (
    <div className={styles.main}>
      {displayed.map((msg, index) => (
        <div key={index} className={styles.item}>
          &gt; {msg}
        </div>
      ))}
      {lineIndex < messages.length && (
        <div className={styles.item}>&gt; {currentLine}</div>
      )}
    </div>
  );
};

export default StartPage;
