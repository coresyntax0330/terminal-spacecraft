export function getPaginationRange({
  currentPage,
  totalPages,
  siblingCount = 1,
}) {
  // Returns an array like [1, 2, 3, '…', 10]
  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const totalNumbers = siblingCount * 2 + 5; // first, last, current, 2*siblings
  const totalBlocks = totalNumbers + 2; // plus 2 ellipses

  if (totalPages <= totalNumbers) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!showLeftDots && showRightDots) {
    const leftRange = range(1, 3 + 2 * siblingCount);
    return [...leftRange, "…", lastPageIndex];
  }

  if (showLeftDots && !showRightDots) {
    const rightRange = range(
      totalPages - (3 + 2 * siblingCount) + 1,
      totalPages
    );
    return [firstPageIndex, "…", ...rightRange];
  }

  if (showLeftDots && showRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [firstPageIndex, "…", ...middleRange, "…", lastPageIndex];
  }

  return range(1, totalPages);
}
