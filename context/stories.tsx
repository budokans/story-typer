import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  ReactElement,
} from "react";
import { option as O, function as F } from "fp-ts";
import { useProvideStories } from "@/hooks";
import { useUserContext } from "./user";
import { Story } from "api-schemas";
import { ChildrenProps } from "components";

interface StoryContext {
  readonly stories: readonly Story.Story[];
  readonly isLoading: boolean;
  readonly gameCount: number;
  readonly setGameCount: Dispatch<SetStateAction<number>>;
  readonly handlePlayArchiveStoryClick: (id: string) => void;
}

const storiesContext = createContext<O.Option<StoryContext>>(O.none);

export const StoriesProvider = ({ children }: ChildrenProps): ReactElement => {
  const [gameCount, setGameCount] = useState(1);
  const { stories, isLoading, handlePlayArchiveStoryClick } =
    useProvideStories(gameCount);
  const user = useUserContext();

  // Listen for no user (signed out) and reset gameCount
  useEffect(() => {
    if (!user) {
      setGameCount(1);
    }
  }, [user]);

  return (
    <storiesContext.Provider
      value={O.some({
        stories,
        isLoading,
        gameCount,
        setGameCount,
        handlePlayArchiveStoryClick,
      })}
    >
      {children}
    </storiesContext.Provider>
  );
};

export const useStoriesContext = (): StoryContext => {
  const context = useContext(storiesContext);

  return F.pipe(
    context,
    O.match(
      () => {
        throw new Error(
          "useStoriesContext was called where storiesContext does not exist."
        );
      },
      (context) => context
    )
  );
};
