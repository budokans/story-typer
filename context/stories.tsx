import {
  Context,
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  FC,
} from "react";
import { useProvideStories } from "@/hooks/useProvideStories";
import { StoryWithId } from "interfaces";
import { useUser } from "@/hooks/useUser";

interface StoryContext {
  stories: StoryWithId[];
  isLoading: boolean;
  gameCount: number;
  setGameCount: Dispatch<SetStateAction<number>>;
  handlePlayArchiveStoryClick: (id: StoryWithId["uid"]) => void;
}

const storiesContext = createContext<StoryContext | null>(null);

export const StoriesProvider: FC = ({ children }) => {
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
