import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: `Inter, Arial, serif`,
    body: `Inter, Arial, sans-serif`,
  },
  colors: {
    brand: {
      100: "#CBFDFD",
      200: "#A8FBFB",
      300: "#85FAFA",
      400: "#62F8F8",
      500: "#0AF5F4",
      600: "#09E3E3",
      700: "#09D2D2",
      800: "#08C0C0",
      900: "#07AFAF",
    },
  },
  styles: {
    global: {
      body: {
        bg: "gray.100",
        color: "blackAlpha.800",
      },
      a: {
        _hover: {
          color: "black",
        },
      },
      li: {
        listStyleType: "none",
      },
      p: {
        marginBottom: "1rem",
      },
    },
  },
  components: {
    Link: {
      baseStyle: {
        _hover: {
          textDecoration: "none",
        },
      },
    },
  },
});
