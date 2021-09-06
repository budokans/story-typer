import {
  Context,
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useProvideStories } from "@/hooks/useProvideStories";
import { StoryWithId } from "interfaces";

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
