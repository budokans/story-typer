import { Context, createContext, useContext } from "react";
import { useProvideStories } from "@/hooks/useProvideStories";
import { StoryWithId } from "interfaces";

interface StoryContext {
  stories: StoryWithId[];
  isLoading: boolean;
}

const storiesContext = createContext<StoryContext | null>(null);

export const StoriesProvider: React.FC = ({ children }) => {
  const { stories, isLoading } = useProvideStories();
  return (
    <storiesContext.Provider value={{ stories, isLoading }}>
      {children}
    </storiesContext.Provider>
  );
};

export const useStories = (): StoryContext => {
  return useContext(storiesContext as Context<StoryContext>);
};
