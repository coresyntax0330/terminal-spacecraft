import React, { useEffect, useMemo, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import Image from "next/image";

// import style
import styles from "@/assets/css/dashboard/managementpage.module.css";

// import assets
import ShipArachnidImg from "@/assets/images/ships/Arachnid.png";
import ShipArcBlasterImg from "@/assets/images/ships/ArcBlaster.png";
import ShipAreisuImg from "@/assets/images/ships/Areisu.png";
import ShipBisonImg from "@/assets/images/ships/Bison.png";
import ShipCargoImg from "@/assets/images/ships/Cargo.png";
import ShipCrossbowImg from "@/assets/images/ships/Crossbow.png";
import ShipCruxioImg from "@/assets/images/ships/Cruxio.png";
import ShipDestructorImg from "@/assets/images/ships/Destructor.png";
import ShipDiabloImg from "@/assets/images/ships/Diablo.png";
import ShipDivergerImg from "@/assets/images/ships/Diverger.png";
import ShipDodgeChargerImg from "@/assets/images/ships/DodgeCharger.png";
import ShipEmptyImg from "@/assets/images/ships/empty.png";
import ShipEndraImg from "@/assets/images/ships/Endra.png";
import ShipFirebirdImg from "@/assets/images/ships/Firebird.png";
import ShipHarbingerImg from "@/assets/images/ships/Harbinger.png";
import ShipHullImg from "@/assets/images/ships/Hull.png";
import ShipMjolnirMarkVImg from "@/assets/images/ships/MjolnirMarkV.png";
import ShipNorthStarImg from "@/assets/images/ships/NorthStar.png";
import ShipNTeslaImg from "@/assets/images/ships/NTesla.png";
import ShipPointBreakImg from "@/assets/images/ships/PointBreak.png";
import ShipRavenImg from "@/assets/images/ships/Raven.png";
import ShipSciFighterImg from "@/assets/images/ships/SciFighter.png";
import ShipScorpionImg from "@/assets/images/ships/Scorpion.png";
import ShipSeraphImg from "@/assets/images/ships/Seraph.png";
import ShipSkyjetImg from "@/assets/images/ships/Skyjet.png";
import ShipStarblasterImg from "@/assets/images/ships/Starblaster.png";
import ShipStarSparrowImg from "@/assets/images/ships/StarSparrow.png";
import ShipSwitchBladeImg from "@/assets/images/ships/SwitchBlade.png";
import ShipTridentImg from "@/assets/images/ships/Trident.png";
import ShipVanguardImg from "@/assets/images/ships/Vanguard.png";

// import components
import ShipModal from "@/components/ShipModal";
import ShipEmptyModal from "@/components/ShipEmptyModal";

// Smart Contract details
import { spacecraftPurchaseContractAddress } from "@/utils/contract";
import { spacecraftPurchaseABI } from "@/utils/abis/spacecraftPurchase";

const SHIP_IMAGES = {
  Arachnid: ShipArachnidImg,
  ArcBlaster: ShipArcBlasterImg,
  Areisu: ShipAreisuImg,
  Bison: ShipBisonImg,
  Cargo: ShipCargoImg,
  Crossbow: ShipCrossbowImg,
  Cruxio: ShipCruxioImg,
  Destructor: ShipDestructorImg,
  Diablo: ShipDiabloImg,
  Diverger: ShipDivergerImg,
  DodgeCharger: ShipDodgeChargerImg,
  Empty: ShipEmptyImg,
  Endra: ShipEndraImg,
  Firebird: ShipFirebirdImg,
  Harbinger: ShipHarbingerImg,
  Hull: ShipHullImg,
  MjolnirMarkV: ShipMjolnirMarkVImg,
  NorthStar: ShipNorthStarImg,
  NTesla: ShipNTeslaImg,
  PointBreak: ShipPointBreakImg,
  Raven: ShipRavenImg,
  SciFighter: ShipSciFighterImg,
  Scorpion: ShipScorpionImg,
  Seraph: ShipSeraphImg,
  Skyjet: ShipSkyjetImg,
  Starblaster: ShipStarblasterImg,
  StarSparrow: ShipStarSparrowImg,
  SwitchBlade: ShipSwitchBladeImg,
  Trident: ShipTridentImg,
  Vanguard: ShipVanguardImg,
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
  { name: "Arachnid", imageKey: "Arachnid", img: ShipArachnidImg },
  { name: "ArcBlaster", imageKey: "ArcBlaster", img: ShipArcBlasterImg },
  { name: "Areisu", imageKey: "Areisu", img: ShipAreisuImg },
  { name: "Bison", imageKey: "Bison", img: ShipBisonImg },
  { name: "Cargo", imageKey: "Cargo", img: ShipCargoImg },
  { name: "Crossbow", imageKey: "Crossbow", img: ShipCrossbowImg },
  { name: "Cruxio", imageKey: "Cruxio", img: ShipCruxioImg },
  { name: "Destructor", imageKey: "Destructor", img: ShipDestructorImg },
  { name: "Diablo", imageKey: "Diablo", img: ShipDiabloImg },
  { name: "Diverger", imageKey: "Diverger", img: ShipDivergerImg },
  { name: "DodgeCharger", imageKey: "DodgeCharger", img: ShipDodgeChargerImg },
  { name: "Empty", imageKey: "Empty", img: ShipEmptyImg },
  { name: "Endra", imageKey: "Endra", img: ShipEndraImg },
  { name: "Firebird", imageKey: "Firebird", img: ShipFirebirdImg },
  { name: "Harbinger", imageKey: "Harbinger", img: ShipHarbingerImg },
  { name: "Hull", imageKey: "Hull", img: ShipHullImg },
  { name: "MjolnirMarkV", imageKey: "MjolnirMarkV", img: ShipMjolnirMarkVImg },
  { name: "NorthStar", imageKey: "NorthStar", img: ShipNorthStarImg },
  { name: "NTesla", imageKey: "NTesla", img: ShipNTeslaImg },
  { name: "PointBreak", imageKey: "PointBreak", img: ShipPointBreakImg },
  { name: "Raven", imageKey: "Raven", img: ShipRavenImg },
  { name: "SciFighter", imageKey: "SciFighter", img: ShipSciFighterImg },
  { name: "Scorpion", imageKey: "Scorpion", img: ShipScorpionImg },
  { name: "Seraph", imageKey: "Seraph", img: ShipSeraphImg },
  { name: "Skyjet", imageKey: "Skyjet", img: ShipSkyjetImg },
  { name: "Starblaster", imageKey: "Starblaster", img: ShipStarblasterImg },
  { name: "StarSparrow", imageKey: "StarSparrow", img: ShipStarSparrowImg },
  { name: "SwitchBlade", imageKey: "SwitchBlade", img: ShipSwitchBladeImg },
  { name: "Trident", imageKey: "Trident", img: ShipTridentImg },
  { name: "Vanguard", imageKey: "Vanguard", img: ShipVanguardImg },
  // { name: "", imageKey: "", img: ShipEmptyImg }, // empty case
];

const getRandomStatus = () => (Math.random() > 0.5 ? "On" : "Off");

const getRandomFleetPower = () => Math.floor(Math.random() * 200) + 50; // between 50–250

const makeRows = (tokenIds) => {
  return tokenIds.map((item, i) => {
    const ship = ships[Math.floor(Math.random() * ships.length)];

    return {
      tokenId: item,
      name: ship.name ? ship.name + "-" + item : `Empty-${i + 1}`,
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
