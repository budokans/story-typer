import { ChangeEvent, useEffect, useReducer } from "react";
import { useMutation, useQueryClient } from "react-query";
import { UseGame } from "./types/Game.types";
import { GameReducer, initialGameState } from "./reducers/GameReducer";
import { useUser } from "@/hooks/useUser";
import { useStories } from "@/context/stories";
import { useCountdown } from "./useCountdown";
import { useTimer } from "./useTimer";
import { PrevGame, StoryWithId, User } from "interfaces";
import { createPostSkipUser, createPostWinUser } from "@/lib/manageUser";
import { createPrevGame, updateUserDataOnWin } from "@/lib/db";

const TIME_LIMIT = 120;

export const useGame = (): UseGame => {
  const [state, dispatch] = useReducer(GameReducer, initialGameState);
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const userWinMutation = useMutation(
    (newUserData: User) => updateUserDataOnWin(newUserData),
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
  } = useStories();
  const count = useCountdown(state.status);
  const timer = useTimer(state.status, TIME_LIMIT);
  const totalUserInput = state.userStoredInput.concat(state.userCurrentInput);
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
      const game = constructGame(user.uid, currentStory, 0);
      createPrevGame(game);
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

  const checkForUserError = (
    currentInput: string,
    storedInput: string,
    source: string
  ) => {
    const totalUserInput = storedInput.concat(currentInput);
    const sourceTilUserInputEnds = source.slice(0, totalUserInput.length);
    return totalUserInput !== sourceTilUserInputEnds;
  };

  const getWpm = (time: number) => Math.round(50 * (60 / time));

  const constructGame = (
    userId: string,
    story: StoryWithId,
    wpm: number
  ): PrevGame => ({
    userId: userId,
    storyId: story.uid,
    storyTitle: story.title,
    storyHtml: story.storyHtml,
    datePlayed: new Date().toISOString(),
    score: wpm,
  });

  // Listen for user errors and finished words.
  useEffect(() => {
    if (currentStory) {
      const errorPresent = checkForUserError(
        state.userCurrentInput,
        state.userStoredInput,
        currentStory.storyText
      );

      if (errorPresent) {
        return dispatch({ type: "userTypingError" });
      } else {
        dispatch({ type: "errorFree" });
      }

      const lastInputCharIsSpace =
        state.userCurrentInput.charAt(state.userCurrentInput.length - 1) ===
        " ";

      const isFinalChar =
        totalUserInput.length === currentStory.storyText.length &&
        !state.userError;

      if ((!state.userError && lastInputCharIsSpace) || isFinalChar) {
        dispatch({ type: "wordCompleted" });
      }
    }
  }, [
    state.userCurrentInput,
    state.userStoredInput,
    currentStory,
    state.userError,
    totalUserInput,
  ]);

  const winGame = () => {
    const wpm = getWpm(timer.totalSeconds);
    if (user) {
      const game = constructGame(user.uid, currentStory, wpm);
      const updatedUser = createPostWinUser(user, currentStory, wpm);
      userWinMutation.mutate(updatedUser);
      createPrevGame(game);
    }
    dispatch({ type: "win", wpm: wpm });
  };

  // Listen for game completion
  useEffect(() => {
    if (state.userStoredInput === currentStory?.storyText) {
      winGame();
    }
  }, [state.userStoredInput, currentStory]);

  return {
    currentStory,
    status: state.status,
    inputValue: state.userCurrentInput,
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
