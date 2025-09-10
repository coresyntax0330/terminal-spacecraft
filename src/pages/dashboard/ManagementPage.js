import React, { useEffect, useMemo, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import Image from "next/image";

// import style
import styles from "@/assets/css/dashboard/managementpage.module.css";

// import assets
import ShipBisonImg from "@/assets/images/ships/Bison.png";
import ShipDiabloImg from "@/assets/images/ships/Diablo.png";
import ShipCargoImg from "@/assets/images/ships/Cargo.png";
import ShipEmptyImg from "@/assets/images/ships/empty.png";

// import components
import ShipModal from "@/components/ShipModal";
import ShipEmptyModal from "@/components/ShipEmptyModal";

// Smart Contract details
import { spacecraftPurchaseContractAddress } from "@/utils/contract";
import { spacecraftPurchaseABI } from "@/utils/abis/spacecraftPurchase";

const SHIP_IMAGES = {
  Bison: ShipBisonImg,
  Diablo: ShipDiabloImg,
  Cargo: ShipCargoImg,
};

const getPaginationRange = ({ currentPage, totalPages, siblingCount = 1 }) => {
  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const totalNumbers = siblingCount * 2 + 5; // first, last, current, 2*siblings
  if (totalPages <= totalNumbers) return range(1, totalPages);

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftRange = range(1, 3 + 2 * siblingCount);
    return [...leftRange, "…", totalPages];
  }
  if (showLeftDots && !showRightDots) {
    const rightRange = range(
      totalPages - (3 + 2 * siblingCount) + 1,
      totalPages
    );
    return [1, "…", ...rightRange];
  }
  return [1, "…", ...range(leftSibling, rightSibling), "…", totalPages];
};

const TOTAL_ROWS = 80;

const ships = [
  { name: "Bison-01", imageKey: "Bison", img: ShipBisonImg },
  { name: "Diablo-01", imageKey: "Diablo", img: ShipDiabloImg },
  { name: "Cargo-01", imageKey: "Cargo", img: ShipCargoImg },
  // { name: "", imageKey: "", img: ShipEmptyImg }, // empty case
];

const getRandomStatus = () => (Math.random() > 0.5 ? "On" : "Off");

const getRandomFleetPower = () => Math.floor(Math.random() * 200) + 50; // between 50–250

const makeRows = (tokenIds) => {
  return tokenIds.map((item, i) => {
    const ship = ships[Math.floor(Math.random() * ships.length)];

    return {
      tokenId: item,
      name: ship.name || `Empty-${i + 1}`,
      status: getRandomStatus(),
      fleetPower: ship.imageKey ? getRandomFleetPower() : 0,
      hasImage: !!ship.imageKey,
      imageKey: ship.imageKey,
    };
  });
};

const PAGE_SIZE = 6;

const ManagementPage = () => {
  const [shipFlag, setShipFlag] = useState(false);
  const [shipEmptyFlag, setShipEmptyFlag] = useState(false);
  const [shipGame, setShipGame] = useState({});
  const [page, setPage] = useState(1);

  const { isConnected, status, address } = useAccount();
  // ✅ read station info for the connected wallet
  const { data: tokenIds, success: isTokenSuccess } = useReadContract({
    address: spacecraftPurchaseContractAddress,
    abi: spacecraftPurchaseABI,
    functionName: "getOwnedShips",
    args: address ? [address] : undefined,
  });

  const [allRows, setAllRows] = useState([]); // store all rows AFTER contract call
  const [pageRowsData, setPageRowsData] = useState([]);

  useEffect(() => {
    if (tokenIds) {
      const rows = makeRows(tokenIds);
      setAllRows(rows);
      setPage(1); // reset to page 1 when new data arrives
    }
  }, [tokenIds, isTokenSuccess]);

  // In real app, you'd fetch data here and paginate server-side if you prefer.

  const totalPages = Math.max(1, Math.ceil(allRows.length / PAGE_SIZE));

  useEffect(() => {
    const start = (page - 1) * PAGE_SIZE;
    setPageRowsData(allRows.slice(start, start + PAGE_SIZE));
  }, [page, allRows]);

  const pageRange = useMemo(
    () =>
      getPaginationRange({ currentPage: page, totalPages, siblingCount: 1 }),
    [page, totalPages]
  );

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));
  const next = () => goTo(page + 1);
  const prev = () => goTo(page - 1);

  const handleClickShipItem = (gameItem) => {
    if (gameItem.hasImage) {
      setShipFlag(true);
      setShipGame(gameItem);
    } else {
      setShipEmptyFlag(true);
      setShipGame({});
    }
  };

  return (
    <div className={styles.main}>
      {shipFlag ? (
        <ShipModal setShipFlag={setShipFlag} shipGame={shipGame} />
      ) : shipEmptyFlag ? (
        <ShipEmptyModal setShipEmptyFlag={setShipEmptyFlag} />
      ) : (
        <>
          <div className={styles.title}>Fleet Management</div>
          <div className={styles.wrapper}>
            <div className={styles.header}>
              <div>&gt; 1. Update Capability +1 Slot [40 UFO]</div>
              <div>
                [{page}/{totalPages}]
              </div>
            </div>
            <div className={styles.list}>
              {pageRowsData.map((item, i) => {
                return (
                  <button
                    className={styles.item}
                    key={i}
                    onClick={() => handleClickShipItem(item)}
                  >
                    <div className={styles.subItem}>
                      {item ? (
                        item.hasImage ? (
                          <div className={styles.shipTitle}>{item.name}</div>
                        ) : (
                          <div className={styles.shipEmptyTitle}>
                            Ship Capability
                          </div>
                        )
                      ) : (
                        <div className={styles.shipEmptyTitle}>
                          Ship Capability
                        </div>
                      )}

                      <div className={styles.imgSection}>
                        <Image
                          src={
                            item && item.hasImage && item.imageKey
                              ? SHIP_IMAGES[item.imageKey]
                              : ShipEmptyImg
                          }
                          alt="ship"
                          className={styles.shipImg}
                          priority
                        />
                      </div>
                      {item && item.hasImage && item.imageKey ? (
                        <div className={styles.footerSection}>
                          <div className={styles.footerItem}>
                            <div className={styles.footerText}>Status</div>
                            <div className={styles.footerText}>
                              {item ? item.status : "OFF"}
                            </div>
                          </div>
                          <div className={styles.footerItem}>
                            <div className={styles.footerText}>Fleet Power</div>
                            <div className={styles.footerText}>
                              {item ? item.fleetPower : "-"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.footerSection}>
                          <div className={styles.footerEmptyItem}>
                            <div className={styles.footerText}>
                              &gt; 1. Buy: 40 UFO
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className={styles.footerBody}>
            {/* Prev */}
            <button
              type="button"
              onClick={prev}
              disabled={page === 1}
              aria-label="Previous page"
              style={{
                opacity: page === 1 ? 0.4 : 1,
                cursor: page === 1 ? "default" : "pointer",
              }}
            >
              [&lt;]
            </button>

            {/* Numbers + ellipses */}
            {pageRange.map((token, idx) =>
              token === "…" ? (
                <span
                  key={`dots-${idx}`}
                  style={{
                    userSelect: "none",
                  }}
                >
                  [ ... ]
                </span>
              ) : (
                <button
                  type="button"
                  key={token}
                  onClick={() => goTo(token)}
                  aria-current={token === page ? "page" : undefined}
                  style={{
                    background: token === page ? "#4AFF41" : "transparent",
                    boxShadow:
                      token === page
                        ? "inset 0 0 8px rgba(124,252,0,.3)"
                        : "none",
                    color: token === page ? "#000" : "#4AFF41",
                    cursor: token === page ? "default" : "pointer",
                  }}
                >
                  [{token}]
                </button>
              )
            )}

            {/* Next */}
            <button
              type="button"
              onClick={next}
              disabled={page === totalPages}
              aria-label="Next page"
              style={{
                background: "transparent",
                opacity: page === totalPages ? 0.4 : 1,
                cursor: page === totalPages ? "default" : "pointer",
              }}
            >
              [&gt;]
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagementPage;
