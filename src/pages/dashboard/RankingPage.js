import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";

// redux slices
import { pageSet } from "@/redux/slices/pageSlice";

// import style
import styles from "@/assets/css/dashboard/rankingpage.module.css";

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

// ====== fake data (replace with your real data fetch) ======
const TOTAL_ROWS = 148; // 100+ as requested
const makeRows = (n = TOTAL_ROWS) => {
  return Array.from({ length: n }, (_, i) => ({
    address:
      "0x" +
      (i + 1).toString(16).padStart(2, "0") +
      Math.random().toString(16).slice(2, 40),
    power: 3000,
  }));
};

const PAGE_SIZE = 20;

const RankingPage = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  // In real app, you'd fetch data here and paginate server-side if you prefer.
  const allRows = useMemo(() => makeRows(), []);
  const totalPages = Math.max(1, Math.ceil(allRows.length / PAGE_SIZE));

  const start = (page - 1) * PAGE_SIZE;
  const pageRows = allRows.slice(start, start + PAGE_SIZE);

  const pageRange = useMemo(
    () =>
      getPaginationRange({ currentPage: page, totalPages, siblingCount: 1 }),
    [page, totalPages]
  );

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));
  const next = () => goTo(page + 1);
  const prev = () => goTo(page - 1);

  return (
    <div className={styles.main}>
      <div className={styles.wrapper}>
        <div className={styles.headerSection}>
          <div className={styles.title}>LeaderBoard</div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => dispatch(pageSet(""))}
          >
            [&times;]
          </button>
        </div>
        <div className={styles.mainSection}>
          {pageRows.map((row, i) => {
            const rank = start + i + 1;
            return (
              <div className={styles.item} key={rank}>
                <div className={styles.no}>#{rank}</div>
                <div
                  className={styles.address}
                  style={{ wordBreak: "break-all" }}
                >
                  {row.address}
                </div>
                <div className={styles.value}>
                  {row.power.toLocaleString()} FLEET POWER
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.footerSection}>
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
      </div>
    </div>
  );
};

export default RankingPage;
