import React, { useEffect, useMemo, useState } from "react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { useDispatch } from "react-redux";
import Image from "next/image";

// import style
import styles from "@/assets/css/dashboard/managementpage.module.css";

// import slice
import { pageSet } from "@/redux/slices/pageSlice";

// import components
import ShipModal from "@/components/ShipModal";
import ShipEmptyModal from "@/components/ShipEmptyModal";

// Smart Contract details
import { spacecraftPurchaseContractAddress } from "@/utils/contract";
import { spacecraftPurchaseABI } from "@/utils/abis/spacecraftPurchase";

// ---------------- Pagination helper ----------------
const getPaginationRange = ({ currentPage, totalPages, siblingCount = 1 }) => {
  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const totalNumbers = siblingCount * 2 + 5;
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

const PAGE_SIZE = 4;

// ---------------- Component ----------------
const ManagementPage = () => {
  const dispatch = useDispatch();
  const [shipFlag, setShipFlag] = useState(false);
  const [shipEmptyFlag, setShipEmptyFlag] = useState(false);
  const [shipGame, setShipGame] = useState({});
  const [page, setPage] = useState(1);

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

  const {
    data: tokenActiveData,
    isSuccess: isActiveSuccess,
    refetch: refetchActive,
  } = useReadContracts({
    contracts: (tokenIds || []).map((id) => ({
      address: spacecraftPurchaseContractAddress,
      abi: spacecraftPurchaseABI,
      functionName: "isActive",
      args: [id],
    })),
  });

  const [allRows, setAllRows] = useState([]);
  const [pageRowsData, setPageRowsData] = useState([]);

  const fetchMetadata = async () => {
    if (
      !tokenIds ||
      !isUriSuccess ||
      !tokenUriData ||
      !tokenActiveData ||
      !isActiveSuccess
    )
      return;

    const rows = await Promise.all(
      tokenIds.map(async (id, idx) => {
        let name = `Ship-${id}`;
        let image = "";
        let description = "";
        let status = false;
        let fleetPower = Math.floor(Math.random() * 200) + 50;

        try {
          const uri = tokenUriData[idx]; // e.g. ipfs://bafy.../4.json
          const tokenActive = tokenActiveData[idx];

          if (tokenActive) {
            status =
              tokenActive.status === "success" ? tokenActive.result : false;
          }

          if (uri) {
            // // 1. Strip "ipfs://" and file name
            const result = uri.result;
            const json = result.replace("ipfs://", "");

            // 2. Build full JSON URL with tokenId
            const metadataUrl = `https://ipfs.io/ipfs/${json}`;

            // 3. Fetch metadata
            const response = await fetch(metadataUrl);
            const metadata = await response.json();

            name = metadata.name || name;
            description = metadata.description || "";

            // 4. Convert image ipfs://CID to https://ipfs.io/ipfs/CID
            if (metadata.image && metadata.image.startsWith("ipfs://")) {
              const imgCid = metadata.image.replace("ipfs://", "");
              image = `https://ipfs.io/ipfs/${imgCid}`;
            }
          }
        } catch (err) {
          console.warn("Failed to fetch metadata for token", id, err);
        }

        return {
          tokenId: id,
          name,
          description,
          image,
          status,
          fleetPower,
          hasImage: !!image,
        };
      })
    );

    setAllRows(rows);
    setPage(1);
  };

  // 3. Parse metadata from each tokenURI
  useEffect(() => {
    if (shipFlag === false) {
      refetchActive();
      fetchMetadata();
    }
  }, [
    tokenIds,
    tokenUriData,
    isUriSuccess,
    tokenActiveData,
    isActiveSuccess,
    shipFlag,
  ]);

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
              <button
                type="button"
                className={styles.previousBtn}
                onClick={() => dispatch(pageSet("miningcore"))}
              >
                &gt; Go to previous page
              </button>
              {pageRowsData.length > 0 && (
                <div>
                  [{page}/{totalPages}]
                </div>
              )}
            </div>
            {pageRowsData.length > 0 ? (
              <div className={styles.list}>
                {pageRowsData.map((item, i) => (
                  <button
                    className={styles.item}
                    key={i}
                    onClick={() => handleClickShipItem(item)}
                  >
                    <div className={styles.subItem}>
                      {item.hasImage ? (
                        <div className={styles.shipTitle}>{item.name}</div>
                      ) : (
                        <div className={styles.shipEmptyTitle}>
                          Ship Capability
                        </div>
                      )}

                      <div className={styles.imgSection}>
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            className={styles.shipImg}
                            width={290}
                            height={200}
                          />
                        ) : (
                          <div className={styles.noImage}>No Image</div>
                        )}
                      </div>

                      {item.hasImage ? (
                        <div className={styles.footerSection}>
                          <div className={styles.footerItem}>
                            <div className={styles.footerText}>Status</div>
                            <div className={styles.footerText}>
                              {item.status ? "On" : "Off"}
                            </div>
                          </div>
                          <div className={styles.footerItem}>
                            <div className={styles.footerText}>Fleet Power</div>
                            <div className={styles.footerText}>
                              {item.fleetPower}
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
                ))}
              </div>
            ) : (
              <div className={styles.emptyList}>No Fleets</div>
            )}
          </div>
          {pageRowsData.length > 0 && (
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

              {/* Numbers */}
              {pageRange.map((token, idx) =>
                token === "…" ? (
                  <span key={`dots-${idx}`}>[ ... ]</span>
                ) : (
                  <button
                    type="button"
                    key={token}
                    onClick={() => goTo(token)}
                    style={{
                      background: token === page ? "#4AFF41" : "transparent",
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
                  opacity: page === totalPages ? 0.4 : 1,
                  cursor: page === totalPages ? "default" : "pointer",
                }}
              >
                [&gt;]
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManagementPage;
