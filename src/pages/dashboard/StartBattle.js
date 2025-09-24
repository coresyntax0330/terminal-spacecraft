import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAccount, useReadContract, useReadContracts } from "wagmi";

// import utils
import { useToast } from "@/components/ToastProvider";

// import images
import ArachnidImg from "@/assets/images/ships/Arachnid.png";
import DestroyImg from "@/assets/images/red.png";
import HasImg from "@/assets/images/green.png";

// import contracts and abis
import { spacecraftPurchaseContractAddress } from "@/utils/contract";
import { spacecraftPurchaseABI } from "@/utils/abis/spacecraftPurchase";

// import style
import styles from "@/assets/css/dashboard/startbattle.module.css";

const StartBattle = () => {
  const player1Count = 12;
  const player2Count = 10;

  const rows = 7; // 10 rows
  const cols = 4; // 6 columns
  const cellSize = 60; // px

  const { showToast } = useToast();

  const [player1Ships, setPlayer1Ships] = useState([]);
  const [player2Ships, setPlayer2Ships] = useState([]);
  const [destroyedCells, setDestroyedCells] = useState({ p1: [], p2: [] });
  const [turn, setTurn] = useState("p1");
  const [gameOver, setGameOver] = useState(false);
  const [flash, setFlash] = useState(null); // "p1" or "p2"
  const [ready, setReady] = useState(false);

  const intervalRef = useRef(null);

  const { address } = useAccount();

  // 1. Get owned ships (tokenIds)
  const { data: tokenIds, isSuccess: isTokenSuccess } = useReadContract({
    address: spacecraftPurchaseContractAddress,
    abi: spacecraftPurchaseABI,
    functionName: "getOwnedShips",
    args: address ? [address] : undefined,
  });

  // 2. Fetch tokenURI for each token
  const { data: tokenUriData, isSuccess: isUriSuccess } = useReadContracts({
    contracts: (tokenIds || []).map((id) => ({
      address: spacecraftPurchaseContractAddress,
      abi: spacecraftPurchaseABI,
      functionName: "tokenURI",
      args: [id],
    })),
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

  /// --- Generate random ship positions ---
  const generateRandomPositions = (count) => {
    const positions = [];
    while (positions.length < count) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      const key = `${row}-${col}`;
      if (!positions.includes(key)) {
        positions.push(key);
      }
    }
    return positions;
  };

  const fetchMetadata = async () => {
    // if (
    //   !isTokenSuccess ||
    //   !tokenIds ||
    //   !isUriSuccess ||
    //   !tokenUriData ||
    //   !tokenActiveData ||
    //   !isActiveSuccess
    // )
    //   return;
  };

  useEffect(() => {
    console.log("--hi--");
    if (isTokenSuccess && isUriSuccess && isActiveSuccess) {
      setReady(true);

      fetchMetadata();

      console.log(tokenIds, "---tokenIds---");
      console.log(tokenUriData, "---tokenUriData---");
      console.log(tokenActiveData, "---tokenActiveData---");
    }
  }, [
    isTokenSuccess,
    isUriSuccess,
    isActiveSuccess,
    tokenIds,
    tokenUriData,
    tokenActiveData,
  ]);

  // --- Init ships ---
  useEffect(() => {
    setPlayer1Ships(generateRandomPositions(player1Count));
    setPlayer2Ships(generateRandomPositions(player2Count));
  }, [player1Count, player2Count]);

  // --- Main battle loop ---
  useEffect(() => {
    if (player1Ships.length === 0 || player2Ships.length === 0) return;
    if (gameOver) return;
    if (!ready) return;

    intervalRef.current = setInterval(() => {
      // ✅ Check winner before any attack
      if (destroyedCells.p1.length >= player1Ships.length) {
        endGame(false);
        return;
      }
      if (destroyedCells.p2.length >= player2Ships.length) {
        endGame(true);
        return;
      }

      // Attack phase
      if (turn === "p1") {
        setFlash("p1");
        attack("p1", "p2");
        setTurn("p2");
      } else {
        setFlash("p2");
        attack("p2", "p1");
        setTurn("p1");
      }

      // remove flash after 400ms (so it only blinks once per turn)
      setTimeout(() => setFlash(null), 400);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [turn, player1Ships, player2Ships, destroyedCells, gameOver, ready]);

  // --- End game ---
  const endGame = (winnerFlag) => {
    clearInterval(intervalRef.current);
    setGameOver(true);
    showToast(winnerFlag ? "You won!" : "You Lose!");
    setFlash(winnerFlag ? "p1" : "p2");
  };

  // --- Attack logic ---
  const attack = (attacker, defender) => {
    if (gameOver) return;

    const defenderShips = defender === "p1" ? player1Ships : player2Ships;
    const defenderDestroyed = destroyedCells[defender];

    // available targets = defender ships not destroyed yet
    const liveTargets = defenderShips.filter(
      (pos) => !defenderDestroyed.includes(pos)
    );
    if (liveTargets.length === 0) return;

    // pick random target
    const target = liveTargets[Math.floor(Math.random() * liveTargets.length)];

    // mark as destroyed
    setDestroyedCells((prev) => ({
      ...prev,
      [defender]: [...prev[defender], target],
    }));
  };

  // --- Render grid ---
  const renderCell = (row, col, ships, destroyed) => {
    const key = `${row}-${col}`;
    const hasShip = ships.includes(key);
    const isDestroyed = destroyed.includes(key);

    return (
      <div
        key={key}
        style={{
          width: cellSize,
          height: cellSize,
        }}
        className={styles.cellItem}
      >
        {hasShip && !isDestroyed && (
          <Image alt="ship" src={ArachnidImg} className={styles.gameImg} />
        )}
        {hasShip && !isDestroyed && (
          <Image alt="green" src={HasImg} className={styles.gameBackImg} />
        )}
        {isDestroyed && (
          <Image alt="red" src={DestroyImg} className={styles.gameBackImg} />
        )}
      </div>
    );
  };

  const renderGrid = (ships, destroyed, player) => (
    <div
      style={{
        display: "grid",
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        boxShadow:
          flash === player
            ? "0 0 2px 0px #4aff41, 0 0 10px 0px #4aff41"
            : "none",
      }}
      className={styles.gridItem}
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) =>
          renderCell(r, c, ships, destroyed)
        )
      )}
    </div>
  );

  if (!ready) {
    return <div>Loading assets...</div>;
  }

  return (
    <div className={styles.main}>
      <div className={styles.battleShipTitle}>Battle Ship</div>
      <div className={styles.subText}>Player1 VS Player2</div>

      <div className={styles.battleContent}>
        {renderGrid(player1Ships, destroyedCells.p1, "p1")}
        <div className={styles.vsText}>VS</div>
        {renderGrid(player2Ships, destroyedCells.p2, "p2")}
      </div>
    </div>
  );
};

export default StartBattle;
