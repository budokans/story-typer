import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactElement,
} from "react";
import {
  option as O,
  function as F,
  readonlyArray as A,
  readonlyNonEmptyArray as NEA,
  either as E,
} from "fp-ts";
import { useMediaQuery } from "@chakra-ui/react";
import { ChildrenProps, Game } from "components";
import { Story as StoryAPI, Util as APIUtil } from "api-client";
import { GameContainer } from "containers";

interface StoryContext {
  readonly stories: NEA.ReadonlyNonEmptyArray<StoryAPI.Response>;
  readonly setStories: Dispatch<SetStateAction<readonly StoryAPI.Response[]>>;
  readonly currentStory: StoryAPI.Response;
  readonly currentStoryIdx: number;
  readonly setCurrentStoryIdx: Dispatch<SetStateAction<number>>;
  readonly leastRecentStoryPublishedDate: string;
}

const storiesContext = createContext<O.Option<StoryContext>>(O.none);

export const StoriesLoader = ({ children }: ChildrenProps): ReactElement => {
  const [mediaQuery] = useMediaQuery("(min-width: 769px)");
  const viewportIsWiderThan768 = mediaQuery!;
  const [currentStoryIdx, setCurrentStoryIdx] = useState(0);
  const storiesQuery = StoryAPI.useStoriesInfinite({
    limit: APIUtil.defaultInfiniteQueryLimit,
    currentStoryIdx,
  });

  switch (storiesQuery._tag) {
    case "loading":
      // TODO: Render appropriate loading UI depending on route
      return (
        <GameContainer.GameWrapper>
          <Game.Skeleton isLargeViewport={viewportIsWiderThan768} />
        </GameContainer.GameWrapper>
      );
    case "settled":
      return F.pipe(
        E.Do,
        E.bind("stories", () => storiesQuery.data),
        E.bind(
          "leastRecentStoryPublishedDate",
          () => storiesQuery.leastRecentStoryPublishedDate
        ),
        E.bind("currentStory", ({ stories }) =>
          A.isOutOfBound(currentStoryIdx, stories)
            ? E.left(new Error(`Story not found at index ${currentStoryIdx}`))
            : // Asserting here because we have checked the existence of the idx
              E.right(stories[currentStoryIdx]!)
        ),
        E.match(
          (error) => {
            // Any of our errors render our game potentially unplayable, so
            // rather than letting the game container and children render
            // and fail with unusable data, we'll render an error page.

            //TODO: Create error page
            console.error(error);
            return <p>Error: {error.message}</p>;
          },
          (data) => (
            <storiesContext.Provider
              value={O.some<StoryContext>({
                stories: data.stories,
                setStories: storiesQuery.setStories,
                currentStory: data.currentStory,
                currentStoryIdx,
                setCurrentStoryIdx,
                leastRecentStoryPublishedDate:
                  data.leastRecentStoryPublishedDate,
              })}
            >
              {children}
            </storiesContext.Provider>
          )
        )
      );
  }
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
