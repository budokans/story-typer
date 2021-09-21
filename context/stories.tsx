import {
  Context,
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { useProvideStories } from "@/hooks/useProvideStories";
import { StoryWithId } from "interfaces";
import { useUser } from "@/hooks/useUser";

interface StoryContext {
  stories: StoryWithId[];
  isLoading: boolean;
  gameCount: number;
  setGameCount: Dispatch<SetStateAction<number>>;
}

const storiesContext = createContext<StoryContext | null>(null);

export const StoriesProvider: React.FC = ({ children }) => {
  const [gameCount, setGameCount] = useState(1);
  const { stories, isLoading } = useProvideStories(gameCount);
  const { data: user } = useUser();

  // Listen for no user (signed out) and reset gameCount
  useEffect(() => {
    if (!user) {
      setGameCount(1);
    }
  }, [user]);

  return (
    <storiesContext.Provider
      value={{ stories, isLoading, gameCount, setGameCount }}
    >
      {children}
    </storiesContext.Provider>
  );
};

export const useStories = (): StoryContext => {
  return useContext(storiesContext as Context<StoryContext>);
};
