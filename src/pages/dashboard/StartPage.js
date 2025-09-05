import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";

// import styles
import styles from "@/assets/css/dashboard/startpage.module.css";

const StartPage = () => {
  const messages = [
    "Initializing Abstractors Core...",
    "Loading Fleet Protocols...",
    "Verifying Stations NFT Registry...",
    "Connecting To Interstellar NETWORK...",
    "Status: ONLINE...",
  ];

  const [visibleCount, setVisibleCount] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (visibleCount < messages.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, 500); // show new item every 1s
      return () => clearTimeout(timer);
    } else if (visibleCount === messages.length) {
      // ✅ finished showing all items
      setTimeout(() => {
        dispatch(pageSet("alert"));
      }, 100);
    }
  }, [visibleCount, messages.length]);

  return (
    <div className={styles.main}>
      {messages.slice(0, visibleCount).map((msg, index) => (
        <div key={index} className={styles.item}>
          &gt; {msg}
        </div>
      ))}
    </div>
  );
};

export default StartPage;
