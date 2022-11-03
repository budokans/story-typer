import { createContext, useContext, ReactElement } from "react";
import { option as O, function as F } from "fp-ts";
import { ProvideAuth } from "@/hooks";
import { ChildrenProps } from "interfaces";

const authContext = createContext<O.Option<ProvideAuth.ProvideAuth>>(O.none);

export const AuthProvider = ({ children }: ChildrenProps): ReactElement => {
  const auth = ProvideAuth.useProvideAuth();
  return (
    <authContext.Provider value={O.some(auth)}>{children}</authContext.Provider>
  );
};

export const useAuthContext = (): ProvideAuth.ProvideAuth => {
  const context = useContext(authContext);

  return F.pipe(
    context,
    O.match(
      () => {
        throw new Error(
          "useAuthContext called where authContext does not exist"
        );
      },
      (context) => context
    )
  );
};
