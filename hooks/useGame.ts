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
import { PrevGame as DBPrevGame } from "db";

export interface UseGame {
  readonly currentStory: StorySchema.StoryResponse | undefined;
  readonly status: GameState.GameStatus;
  readonly inputValue: string;
  readonly userError: boolean;
  readonly onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  readonly onInitCountdown: () => void;
  readonly countdown: number;
  readonly timer: Timer.Timer;
  readonly wpm: number;
  readonly onResetClick: () => void;
  readonly onSkipClick: () => void;
  readonly onNextClick: () => void;
}

const TIME_LIMIT = 120;

export const useGame = (): UseGame => {
  const [state, dispatch] = useReducer(
    GameState.GameReducer,
    GameState.initialState
  );
  const user = UserContext.useUserContext();
  const setUserAPI = UserAPI.useSetUser();

  const {
    stories,
    isLoading: storiesAreLoading,
    gameCount,
    setGameCount,
    fetchNext,
    leastRecentStoryPublishedDate,
  } = StoriesContext.useStoriesContext();
  const count = useCountdown(state.status);
  const timer = Timer.useTimer(state.status, TIME_LIMIT);
  const currentStory = A.isOutOfBound(gameCount - 1, stories)
    ? undefined
    : stories[gameCount - 1];

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
    if (count === 0) {
      dispatch({ type: "countdownComplete" });
    }
  }, [count]);

  // Listen for time limit up and dispatch outOfTime action
  useEffect(() => {
    timer.totalSeconds === TIME_LIMIT && dispatch({ type: "outOfTime" });
  }, [timer.totalSeconds]);

  const initCountdown = useCallback(
    () => state.status === "idle" && dispatch({ type: "startCountdown" }),
    [state.status]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: "inputValueChange", inputValue: e.target.value });

  const handleResetClick = () => dispatch({ type: "reset" });

  const updateUserPostSkip: ({
    user,
    currentStory,
  }: {
    readonly user: UserSchema.User;
    readonly currentStory: StorySchema.StoryResponse;
  }) => TE.TaskEither<unknown, void> = F.flow(
    ({ user, currentStory }) =>
      buildPostSkipUser(user, currentStory, leastRecentStoryPublishedDate),
    setUserAPI.mutateAsync
  );

  const createPrevGame: ({
    user,
    currentStory,
  }: {
    readonly user: UserSchema.User;
    readonly currentStory: StorySchema.StoryResponse;
  }) => TE.TaskEither<unknown, PrevGameSchema.PrevGameBody> = F.flow(
    ({ user, currentStory }) =>
      TE.right(DBPrevGame.buildGame(user.id, currentStory, 0)),
    TE.chainFirst((prevGame) =>
      TE.tryCatch(
        () => DBPrevGame.createPrevGame(prevGame),
        (error) => error
      )
    )
  );

  const handleSkipClick = useCallback(
    () =>
      F.pipe(
        currentStory,
        TE.fromNullable("Invalid current story"),
        TE.bind("updatedUser", (currentStory) =>
          updateUserPostSkip({ user, currentStory })
        ),
        TE.bind("prevGame", (currentStory) =>
          createPrevGame({ user, currentStory })
        ),
        TE.fold(
          (error) =>
            F.pipe(
              // Force new line
              () => console.error(error),
              T.fromIO
            ),
          () =>
            F.pipe(
              () => setGameCount(gameCount + 1),
              IO.apFirst(() => {
                if (stories.length === gameCount) fetchNext();
              }),
              IO.apFirst(() => dispatch({ type: "next" })),
              T.fromIO
            )
        )
      )(),
    [
      currentStory,
      user,
      createPrevGame,
      fetchNext,
      gameCount,
      setGameCount,
      stories.length,
      updateUserPostSkip,
    ]
  );

  const handleNextStoryClick = useCallback(
    (): IO.IO<void> =>
      F.pipe(
        () => setGameCount(gameCount + 1),
        IO.apFirst(() => {
          if (stories.length === gameCount) fetchNext();
        }),
        IO.apFirst(() => dispatch({ type: "next" }))
      ),
    [fetchNext, gameCount, setGameCount, stories.length]
  );

  const checkForUserError = (currentInput: string, source: string) =>
    currentInput !== source.slice(0, currentInput.length);

  const getWpm = (time: number) => Math.round(50 * (60 / time));

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
    ): TE.TaskEither<unknown, void> =>
      F.pipe(
        userData,
        (user) =>
          buildPostWinUser(
            user,
            currentStory,
            score,
            leastRecentStoryPublishedDate
          ),
        setUserAPI.mutateAsync
      ),
    [setUserAPI, leastRecentStoryPublishedDate]
  );

  const winGame = useCallback(() => {
    F.pipe(
      currentStory,
      TE.fromNullable("Invalid current story."),
      TE.chainFirstIOK(
        () => () => dispatch({ type: "win", wpm: getWpm(timer.totalSeconds) })
      ),
      TE.bind("updatedUser", (currentStory) =>
        updateUserPostWin(user, currentStory, getWpm(timer.totalSeconds))
      ),
      TE.bind("prevGame", (currentStory) =>
        createPrevGame({ user, currentStory })
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
    )();
  }, [
    user,
    currentStory,
    timer.totalSeconds,
    createPrevGame,
    updateUserPostWin,
  ]);

  // Listen for game completion
  useEffect(() => {
    if (state.userInput === currentStory?.storyText) {
      winGame();
    }
  }, [state.userInput, currentStory, timer.seconds, winGame]);

  return {
    currentStory,
    status: state.status,
    inputValue: state.userInput,
    userError: state.userError,
    onInputChange: handleInputChange,
    onInitCountdown: initCountdown,
    countdown: count,
    timer: timer,
    wpm: state.wpm,
    onResetClick: handleResetClick,
    onSkipClick: handleSkipClick,
    onNextClick: handleNextStoryClick,
  };
};
