export const headerHeightMobile = 41;
export const headerHeightDesktop = 61;
export const headerBorderHeight = 5;

export const headerFooterTotalHeight = (
  device: "mobile" | "desktop",
  isHeader: boolean
): number => {
  switch (device) {
    case "desktop":
      return isHeader
        ? headerHeightDesktop
        : headerHeightDesktop - headerBorderHeight;
    case "mobile":
      return isHeader
        ? headerHeightMobile
        : headerHeightMobile - headerBorderHeight;
  }
};

export const mainPaddingYMobile = 16;
export const mainPaddingYDesktop = 32;

export const totalMainPaddingY = (isWideViewport: boolean): number =>
  isWideViewport ? mainPaddingYDesktop * 2 : mainPaddingYMobile * 2;
