import { ChangeEvent, useCallback, useEffect, useReducer } from "react";
import { useMutation, useQueryClient } from "react-query";
import * as GameState from "./reducers/GameReducer";
import { useCountdown, Timer } from "@/hooks";
import { useUserContext } from "@/context/user";
import { useStoriesContext } from "@/context/stories";
import { Story, User } from "api-schemas";
import { createPostSkipUser, createPostWinUser } from "@/lib/manageUser";
import { PrevGame as DBPrevGame, User as DBUser } from "db";

export interface UseGame {
  readonly currentStory: Story.StoryResponse;
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
  const user = useUserContext();
  const queryClient = useQueryClient();
  const userWinMutation = useMutation(
    (newUserData: User.User) => DBUser.updateUserDataOnWin(newUserData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("user");
      },
    }
  );
  const {
    stories,
    isLoading: storiesAreLoading,
    gameCount,
    setGameCount,
  } = useStoriesContext();
  const count = useCountdown(state.status);
  const timer = Timer.useTimer(state.status, TIME_LIMIT);
  const currentStory = stories[gameCount - 1];

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

  const initCountdown = () =>
    state.status === "idle" && dispatch({ type: "startCountdown" });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    dispatch({ type: "inputValueChange", inputValue });
  };

  const handleResetClick = () => {
    dispatch({ type: "reset" });
  };

  const handleSkipClick = () => {
    if (user) {
      const game = DBPrevGame.buildGame(user.uid, currentStory, 0);
      DBPrevGame.createPrevGame(game);
      const updatedUser = createPostSkipUser(user, currentStory);
      userWinMutation.mutate(updatedUser);
    }
    setGameCount(gameCount + 1);
    dispatch({ type: "next" });
  };

  const handleNextStoryClick = () => {
    setGameCount(gameCount + 1);
    dispatch({ type: "next" });
  };

  const checkForUserError = (currentInput: string, source: string) => {
    return currentInput !== source.slice(0, currentInput.length);
  };

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

  const winGame = useCallback(() => {
    const wpm = getWpm(timer.totalSeconds);
    if (user) {
      const game = DBPrevGame.buildGame(user.uid, currentStory, wpm);
      const updatedUser = createPostWinUser(user, currentStory, wpm);
      userWinMutation.mutate(updatedUser);
      DBPrevGame.createPrevGame(game);
    }
    dispatch({ type: "win", wpm: wpm });
  }, [currentStory, timer.totalSeconds, user, userWinMutation]);

  // Listen for game completion
  useEffect(() => {
    if (state.userInput === currentStory?.storyText) {
      winGame();
    }
  }, [state.userInput, currentStory, winGame]);

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
