import { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  function as F,
  io as IO,
  taskEither as TE,
  task as T,
  option as O,
} from "fp-ts";
import { useCountdown, Timer } from "hooks";
import {
  User as UserAPI,
  Story as StoryAPI,
  PrevGame as PrevGameAPI,
} from "api-client";
import { User as UserContext, Stories as StoriesContext } from "context";
import { buildPostSkipUser, buildPostWinUser } from "lib/manageUser";
import { PrevGame as DBPrevGame, Error as DBError } from "db";

// State
type PreGameState = {
  readonly _tag: "pre-game";
};
type CountdownState = {
  readonly _tag: "countdown";
};
type InGameState = {
  readonly _tag: "in-game";
  readonly userInput: string;
  readonly userErrorIsPresent: boolean;
};
type WinState = {
  readonly _tag: "win";
  readonly userInput: string;
  readonly score: number;
};
type LoseState = {
  readonly _tag: "lose";
  readonly userInput: string;
  readonly userErrorIsPresent: boolean;
};
type State = PreGameState | CountdownState | InGameState | WinState | LoseState;

// Hook
type PreGame = {
  readonly _tag: "pre-game";
  readonly currentStory: StoryAPI.Response;
  readonly countdown: number;
  readonly onInitCountdown: IO.IO<void>;
  readonly onSkipClick: ({
    currentStory,
    user,
  }: {
    readonly currentStory: StoryAPI.Response;
    readonly user: UserAPI.Response;
  }) => T.Task<void>;
};
type Countdown = {
  readonly _tag: "countdown";
  readonly countdown: number;
  readonly currentStory: StoryAPI.Response;
  readonly onResetClick: IO.IO<void>;
};
type InGame = {
  readonly _tag: "in-game";
  readonly currentStory: StoryAPI.Response;
  readonly onInputChange: (e: ChangeEvent<HTMLInputElement>) => IO.IO<void>;
  readonly userInput: string;
  readonly userErrorIsPresent: boolean;
  readonly timer: Timer.Timer;
  readonly onResetClick: IO.IO<void>;
};
type Win = {
  readonly _tag: "win";
  readonly currentStory: StoryAPI.Response;
  readonly timer: Timer.Timer;
  readonly wpm: number;
  readonly onResetClick: IO.IO<void>;
  readonly onNextClick: IO.IO<void>;
};
type Lose = {
  readonly _tag: "lose";
  readonly currentStory: StoryAPI.Response;
  readonly userErrorIsPresent: boolean;
  readonly onResetClick: IO.IO<void>;
  readonly onSkipClick: ({
    currentStory,
    user,
  }: {
    readonly currentStory: StoryAPI.Response;
    readonly user: UserAPI.Response;
  }) => T.Task<void>;
};
type UseGame = PreGame | Countdown | InGame | Win | Lose;

const TIME_LIMIT = 120;

export const useGame = (): UseGame => {
  const [gameState, setGameState] = useState<State>({ _tag: "pre-game" });
  const user = UserContext.useUserContext();
  const setUserAPI = UserAPI.useSetUser();
  const { currentStory, setCurrentStoryIdx, leastRecentStoryPublishedDate } =
    StoriesContext.useStoriesContext();
  const countdown = useCountdown(gameState._tag === "countdown");
  const timer = Timer.useTimer(gameState._tag === "in-game", TIME_LIMIT);

  // Listen for countdown complete, set in-game state
  useEffect(() => {
    if (countdown === 0 && gameState._tag === "countdown") {
      setGameState({
        _tag: "in-game",
        userInput: "",
        userErrorIsPresent: false,
      });
    }
  }, [countdown, gameState]);

  const isInGame = useCallback(
    (): O.Option<InGameState> =>
      F.pipe(
        gameState,
        O.fromPredicate(
          (prevState): prevState is InGameState => prevState._tag === "in-game"
        )
      ),
    [gameState]
  );

  // Listen for time limit up, set lose state
  useEffect(() => {
    if (timer.totalSeconds === TIME_LIMIT)
      F.pipe(
        isInGame(),
        O.match(
          F.constVoid,
          F.flow(
            ({ userInput, userErrorIsPresent }): LoseState => ({
              _tag: "lose" as const,
              userInput,
              userErrorIsPresent,
            }),
            setGameState
          )
        )
      );
  }, [gameState, isInGame, timer.totalSeconds]);

  const handleInputChange =
    (e: ChangeEvent<HTMLInputElement>): IO.IO<void> =>
    () =>
      F.pipe(
        isInGame(),
        O.match(
          F.constVoid,
          F.flow(
            (): InGameState => ({
              _tag: "in-game" as const,
              userInput: e.target.value,
              userErrorIsPresent:
                e.target.value !==
                currentStory.storyText.slice(0, e.target.value.length),
            }),
            setGameState
          )
        )
      );

  const updateUserPostSkip: ({
    user,
    currentStory,
  }: {
    readonly user: UserAPI.Response;
    readonly currentStory: StoryAPI.Response;
  }) => TE.TaskEither<DBError.DBError, UserAPI.Response> = F.flow(
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
    readonly story: StoryAPI.Response;
    readonly wpm: number;
  }) => TE.TaskEither<DBError.DBError, string> = F.flow(
    // Force new line
    buildPrevGame,
    (prevGame) =>
      // TODO: Move this to prev-game API module
      TE.tryCatch(
        () => DBPrevGame.createPrevGame(prevGame),
        // Note: Casting dangerously for now, as that's what our DB function will error with.
        (error) => error as DBError.DBError
      )
  );

  const reset: IO.IO<void> = () => setGameState({ _tag: "pre-game" });

  const nextStory: IO.IO<void> = useCallback(
    () =>
      F.pipe(
        () => setCurrentStoryIdx((prev) => prev + 1),
        IO.apFirst(() => setGameState({ _tag: "pre-game" }))
      )(),
    [setCurrentStoryIdx]
  );

  const handleSkipClick = useCallback(
    ({
      currentStory,
      user,
    }: {
      readonly currentStory: StoryAPI.Response;
      readonly user: UserAPI.Response;
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
          () => F.pipe(nextStory, T.fromIO)
        )
      ),
    [createPrevGame, updateUserPostSkip, nextStory]
  );

  const updateUserPostWin = useCallback(
    (
      userData: UserAPI.Response,
      currentStory: StoryAPI.Response,
      score: number
    ): TE.TaskEither<DBError.DBError, UserAPI.Response> =>
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
    (currentStory: StoryAPI.Response, user: UserAPI.Response, score: number) =>
      F.pipe(
        () =>
          F.pipe(
            isInGame(),
            O.match(
              F.constVoid,
              F.flow(
                ({ userInput }): WinState => ({
                  _tag: "win" as const,
                  userInput,
                  score,
                }),
                setGameState
              )
            )
          ),
        TE.fromIO,
        TE.chain(() => updateUserPostWin(user, currentStory, score)),
        TE.chain((updatedUser) =>
          createPrevGame({
            userId: updatedUser.id,
            story: currentStory,
            wpm: score,
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
    [isInGame, createPrevGame, updateUserPostWin]
  );

  // Listen for game completion
  useEffect(() => {
    if (
      gameState._tag === "in-game" &&
      gameState.userInput === currentStory?.storyText
    ) {
      F.pipe(
        // Force new line
        winGame(currentStory, user, wpm(timer.totalSeconds)),
        (unsafeRunTask) => unsafeRunTask()
      );
    }
  }, [gameState, currentStory, user, timer.totalSeconds, winGame]);

  switch (gameState._tag) {
    case "pre-game":
      return {
        _tag: "pre-game",
        currentStory,
        countdown,
        onInitCountdown: () => setGameState({ _tag: "countdown" }),
        onSkipClick: handleSkipClick,
      };
    case "countdown":
      return {
        _tag: "countdown",
        countdown,
        currentStory,
        onResetClick: reset,
      };
    case "in-game":
      return {
        _tag: "in-game",
        currentStory,
        onInputChange: handleInputChange,
        userInput: gameState.userInput,
        userErrorIsPresent: gameState.userErrorIsPresent,
        timer,
        onResetClick: reset,
      };
    case "win":
      return {
        _tag: "win",
        currentStory,
        timer,
        wpm: wpm(timer.totalSeconds),
        onResetClick: reset,
        onNextClick: nextStory,
      };
    case "lose":
      return {
        _tag: "lose",
        currentStory,
        userErrorIsPresent: gameState.userErrorIsPresent,
        onResetClick: reset,
        onSkipClick: handleSkipClick,
      };
  }
};

const wpm = (totalSeconds: number): number =>
  Math.round(50 * (60 / totalSeconds));

const buildPrevGame = ({
  userId,
  story,
  wpm,
}: {
  readonly userId: string;
  readonly story: StoryAPI.Response;
  readonly wpm: number;
}): PrevGameAPI.Body => ({
  userId: userId,
  storyId: story.id,
  storyTitle: story.title,
  storyHtml: story.storyHtml,
  score: wpm,
});
