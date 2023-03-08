import { ChangeEvent, useCallback, useEffect, useReducer } from "react";
import {
  function as F,
  io as IO,
  taskEither as TE,
  task as T,
  readonlyArray as A,
} from "fp-ts";
import * as GameState from "@/reducers/GameReducer";
import { useCountdown, Timer } from "hooks";
import { User as UserAPI } from "api-client";
import { User as UserContext, Stories as StoriesContext } from "context";
import {
  Story as StorySchema,
  User as UserSchema,
  PrevGame as PrevGameSchema,
} from "api-schemas";
import { buildPostSkipUser, buildPostWinUser } from "lib/manageUser";
import { PrevGame as DBPrevGame, Error as DBError } from "db";

export interface UseGame {
  readonly currentStory: StorySchema.StoryResponse | undefined;
  readonly status: GameState.GameStatus;
  readonly inputValue: string;
  readonly userError: boolean;
  readonly onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  readonly onInitCountdown: (status: GameState.GameStatus) => void;
  readonly countdown: number;
  readonly timer: Timer.Timer;
  readonly wpm: number;
  readonly onResetClick: IO.IO<void>;
  readonly onSkipClick: ({
    currentStory,
    user,
  }: {
    readonly currentStory: StorySchema.StoryResponse;
    readonly user: UserSchema.User;
  }) => T.Task<void>;
  readonly onNextClick: () => IO.IO<void>;
}

const TIME_LIMIT = 120;

const buildGame = ({
  userId,
  story,
  wpm,
}: {
  readonly userId: string;
  readonly story: StorySchema.StoryResponse;
  readonly wpm: number;
}): PrevGameSchema.PrevGameBody => ({
  userId: userId,
  storyId: story.id,
  storyTitle: story.title,
  storyHtml: story.storyHtml,
  score: wpm,
});

export const useGame = (): UseGame => {
  const [state, dispatch] = useReducer(
    GameState.GameReducer,
    GameState.initialState
  );
  const user = UserContext.useUserContext();
  const setUserAPI = UserAPI.useSetUser();

  const {
    stories,
    isFetching: storiesAreLoading,
    currentStoryIdx,
    setCurrentStoryIdx,
    fetchNext,
    leastRecentStoryPublishedDate,
  } = StoriesContext.useStoriesContext();
  const countdown = useCountdown(state.status === "countdown");
  const timer = Timer.useTimer(state.status, TIME_LIMIT);
  // TODO: We shouldn't return anything if we have no current story. We can return a discriminated
  // union type from this hook with an error tag and handle error and other states in the container.
  // .
  const currentStory = A.isOutOfBound(currentStoryIdx, stories)
    ? undefined
    : stories[currentStoryIdx];

  // Listen for when stories have been loaded into game state and initialise idle state.
  useEffect(() => {
    if (!storiesAreLoading) {
      dispatch({ type: "storiesLoaded" });
    } else if (storiesAreLoading) {
      dispatch({ type: "storiesLoading" });
    }
  }, [storiesAreLoading, stories]);

  // Listen for countdown complete and update game status to "inGame"
  useEffect(() => {
    if (countdown === 0) {
      dispatch({ type: "countdownComplete" });
    }
  }, [countdown]);

  // Listen for time limit up and dispatch outOfTime action
  useEffect(() => {
    timer.totalSeconds === TIME_LIMIT && dispatch({ type: "outOfTime" });
  }, [timer.totalSeconds]);

  // TODO: This shouldn't rely on an if check. It can be an IO<void> and
  // only be passed down if game state is idle.
  const initCountdown = (status: GameState.GameStatus) => {
    if (status === "idle") dispatch({ type: "startCountdown" });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: "inputValueChange", inputValue: e.target.value });

  const updateUserPostSkip: ({
    user,
    currentStory,
  }: {
    readonly user: UserSchema.User;
    readonly currentStory: StorySchema.StoryResponse;
  }) => TE.TaskEither<DBError.DBError, UserSchema.User> = F.flow(
    ({ user, currentStory }) =>
      buildPostSkipUser(user, currentStory, leastRecentStoryPublishedDate),
    setUserAPI.mutateAsync
  );

  const createPrevGame: ({
    userId,
    story,
    wpm,
  }: {
    readonly userId: string;
    readonly story: StorySchema.StoryResponse;
    readonly wpm: number;
  }) => TE.TaskEither<DBError.DBError, string> = F.flow(
    // Force new line
    buildGame,
    (prevGame) =>
      TE.tryCatch(
        () => DBPrevGame.createPrevGame(prevGame),
        (error) => error as DBError.DBError
      )
  );

  const handleResetClick: IO.IO<void> = () => dispatch({ type: "reset" });

  const nextStory = useCallback(
    () =>
      F.pipe(
        () => setCurrentStoryIdx(currentStoryIdx + 1),
        IO.apFirst(() => {
          if (stories.length - 1 === currentStoryIdx) fetchNext();
        }),
        IO.apFirst(() => dispatch({ type: "next" }))
      ),
    [fetchNext, currentStoryIdx, setCurrentStoryIdx, stories.length]
  );

  const handleSkipClick = useCallback(
    ({
      currentStory,
      user,
    }: {
      readonly currentStory: StorySchema.StoryResponse;
      readonly user: UserSchema.User;
    }): T.Task<void> =>
      F.pipe(
        updateUserPostSkip({ user, currentStory }),
        TE.chain((updatedUser) =>
          createPrevGame({
            userId: updatedUser.id,
            story: currentStory,
            wpm: 0,
          })
        ),
        TE.fold(
          (error) =>
            F.pipe(
              // Force new line
              () => console.error(error),
              T.fromIO
            ),
          () => F.pipe(nextStory(), T.fromIO)
        )
      ),
    [createPrevGame, updateUserPostSkip, nextStory]
  );

  const checkForUserError = (currentInput: string, source: string) =>
    currentInput !== source.slice(0, currentInput.length);

  const wpm = (time: number) => Math.round(50 * (60 / time));

  // Listen for user error
  useEffect(() => {
    if (currentStory) {
      const errorPresent = checkForUserError(
        state.userInput,
        currentStory.storyText
      );

      if (errorPresent) {
        return dispatch({ type: "userTypingError" });
      } else {
        dispatch({ type: "errorFree" });
      }
    }
  }, [state.userInput, currentStory, state.userError]);

  const updateUserPostWin = useCallback(
    (
      userData: UserSchema.User,
      currentStory: StorySchema.StoryResponse,
      score: number
    ): TE.TaskEither<DBError.DBError, UserSchema.User> =>
      F.pipe(
        buildPostWinUser(
          userData,
          currentStory,
          score,
          leastRecentStoryPublishedDate
        ),
        setUserAPI.mutateAsync
      ),
    [setUserAPI, leastRecentStoryPublishedDate]
  );

  const winGame = useCallback(
    (
      currentStory: StorySchema.StoryResponse,
      user: UserSchema.User,
      seconds: number
    ) =>
      F.pipe(
        () => dispatch({ type: "win", wpm: wpm(seconds) }),
        TE.fromIO,
        TE.chain(() => updateUserPostWin(user, currentStory, wpm(seconds))),
        TE.chain((updatedUser) =>
          createPrevGame({
            userId: updatedUser.id,
            story: currentStory,
            wpm: wpm(seconds),
          })
        ),
        TE.fold(
          (error) =>
            F.pipe(
              // Force new line
              () => console.error(error),
              T.fromIO
            ),
          () => T.of(undefined)
        )
      ),
    [createPrevGame, updateUserPostWin]
  );

  // Listen for game completion
  useEffect(() => {
    if (state.userInput === currentStory?.storyText) {
      F.pipe(
        // Force new line
        winGame(currentStory, user, timer.totalSeconds),
        (unsafeRunTask) => unsafeRunTask()
      );
    }
  }, [state.userInput, currentStory, user, timer.totalSeconds, winGame]);

  return {
    currentStory,
    status: state.status,
    inputValue: state.userInput,
    userError: state.userError,
    onInputChange: handleInputChange,
    onInitCountdown: initCountdown,
    countdown,
    timer,
    wpm: state.wpm,
    onResetClick: handleResetClick,
    onSkipClick: handleSkipClick,
    onNextClick: nextStory,
  };
};
