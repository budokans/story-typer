import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import "@fontsource/courier-prime/700.css";
import "@fontsource/montserrat";
import { theme } from "../theme";
import { AuthProvider } from "@/context/auth";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
};

export default MyApp;
