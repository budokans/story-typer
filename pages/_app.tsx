import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import "@fontsource/inter/100.css";
import "@fontsource/inter/200.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import { theme } from "../theme";
import { AuthProvider } from "@/context/auth";
import { StoriesProvider } from "@/context/stories";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <StoriesProvider>
          <Component {...pageProps} />
        </StoriesProvider>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default MyApp;
