import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactElement,
} from "react";
import { option as O, function as F } from "fp-ts";
import { useProvideStories } from "@/hooks";
import { Story as StorySchema } from "api-schemas";
import { ChildrenProps } from "components";

interface StoryContext {
  readonly stories: readonly StorySchema.StoryResponse[];
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
