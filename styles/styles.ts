export const headerHeightMobile = 41;
export const headerHeightDesktop = 61;
export const headerBorderHeight = 5;
export const footerHeightDesktop = headerHeightDesktop - headerBorderHeight;
export const footerHeightMobile = headerHeightMobile;

export const headerFooterHeight = (
  device: "mobile" | "desktop",
  isHeader: boolean
): number => {
  switch (device) {
    case "desktop":
      return isHeader ? headerHeightDesktop : footerHeightDesktop;
    case "mobile":
      return isHeader ? headerHeightMobile : footerHeightMobile;
  }
};

export const mainPaddingYMobile = 16;
export const mainPaddingYDesktop = 32;

export const totalMainPaddingY = (isWideViewport: boolean): number =>
  isWideViewport ? mainPaddingYDesktop * 2 : mainPaddingYMobile * 2;

export const userMenuItemStateStyles = {
  _hover: { bg: "blackAlpha.600" },
  _active: { bg: "blackAlpha.300" },
  _focus: { bg: "blackAlpha.300" },
};
