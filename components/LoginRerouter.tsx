import { useEffect } from "react";
import { useRouter } from "next/router";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/context/auth";

export const LoginRerouter: React.FC = () => {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();

  useEffect(() => {
    router.push("/");
    signInWithGoogle();
  });

  return <Spinner />;
};
