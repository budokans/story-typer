import {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { option as O, function as F } from "fp-ts";
import { ChildrenProps } from "components";

interface CardIsExpandedContext {
  readonly isExpanded: boolean;
  readonly setIsExpanded: Dispatch<SetStateAction<boolean>>;
}

export const cardIsExpandedContext = createContext<
  O.Option<CardIsExpandedContext>
>(O.none);

export const useCardIsExpandedContext = (): CardIsExpandedContext => {
  const context = useContext(cardIsExpandedContext);

  return F.pipe(
    context,
    O.match(
      () => {
        throw new Error(
          "useCardIsExpandedContext called where cardIsExpandedContext does not exist."
        );
      },
      (context) => context
    )
  );
};

export const CardIsExpandedProvider = ({
  children,
}: ChildrenProps): ReactElement => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <cardIsExpandedContext.Provider
      value={O.some<CardIsExpandedContext>({ isExpanded, setIsExpanded })}
    >
      {children}
    </cardIsExpandedContext.Provider>
  );
};
