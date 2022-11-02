import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import { CenterContent, Spinner } from "@/components";

export const LoginRerouter = (): ReactElement => {
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
