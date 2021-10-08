import { useEffect } from "react";
import { useRouter } from "next/router";
import { Center } from "@chakra-ui/react";
import { Spinner } from "@/components/Spinner";
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
      <Spinner />
    </Center>
  );
};
