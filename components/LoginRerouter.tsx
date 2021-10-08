import { useEffect } from "react";
import { useRouter } from "next/router";
import { Spinner, Center } from "@chakra-ui/react";
import { useAuth } from "@/context/auth";

export const LoginRerouter: React.FC = () => {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();

  useEffect(() => {
    router.push("/");
    signInWithGoogle();
  });

  return (
    <Center minH={["auto", "calc(100vh - 61px - 56px - 64px)"]}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="brand.500"
        size="xl"
      />
    </Center>
  );
};
