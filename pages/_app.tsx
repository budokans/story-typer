import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactElement } from "react";
import "@fontsource/inter/100.css";
import "@fontsource/inter/200.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import { theme } from "@/styles";
import { AuthProvider } from "@/context/auth";
import { UserProvider } from "@/context/user";
import { StoriesProvider } from "@/context/stories";

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <UserProvider>
            <StoriesProvider>
              <Component {...pageProps} />
            </StoriesProvider>
          </UserProvider>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
