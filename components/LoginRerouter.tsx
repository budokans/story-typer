import { useEffect } from "react";
import { useRouter } from "next/router";
import { Spinner } from "@/components/Spinner";
import { CenterContent } from "./CenterContent";

export const LoginRerouter: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  });

  return (
    <CenterContent>
      <Spinner />
    </CenterContent>
  );
};
