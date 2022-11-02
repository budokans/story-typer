import {
  Context,
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  ReactElement,
} from "react";
import { useProvideStories } from "@/hooks/useProvideStories";
import { ChildrenProps, StoryWithId } from "interfaces";
import { useUser } from "@/hooks/useUser";

interface StoryContext {
  readonly stories: readonly StoryWithId[];
  readonly isLoading: boolean;
  readonly gameCount: number;
  readonly setGameCount: Dispatch<SetStateAction<number>>;
  readonly handlePlayArchiveStoryClick: (id: StoryWithId["uid"]) => void;
}

const storiesContext = createContext<StoryContext | null>(null);

export const StoriesProvider = ({ children }: ChildrenProps): ReactElement => {
  const [gameCount, setGameCount] = useState(1);
  const { stories, isLoading, handlePlayArchiveStoryClick } =
    useProvideStories(gameCount);
  const { data: user } = useUser();

  // Listen for no user (signed out) and reset gameCount
  useEffect(() => {
    if (!user) {
      setGameCount(1);
    }
  }, [user]);

  return (
    <storiesContext.Provider
      value={{
        stories,
        isLoading,
        gameCount,
        setGameCount,
        handlePlayArchiveStoryClick,
      }}
    >
      {children}
    </storiesContext.Provider>
  );
};

export const useStories = (): StoryContext => {
  return useContext(storiesContext as Context<StoryContext>);
};
