import { ChangeEvent, useEffect, useReducer } from "react";
import { useUser } from "@/context/user";
import { useStories } from "@/context/stories";
import { useCountdown } from "./useCountdown";
import { useTimer } from "./useTimer";
import { GameAction, GameState } from "./useGame.types";
import { PrevGame, StoryWithId } from "interfaces";
import { createPrevGame } from "@/lib/db";

const initialState: GameState = {
  status: "pending",
  firstPlay: true,
  userError: false,
  userStoredInput: "",
  userCurrentInput: "",
  wpm: 0,
};

const GameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "storiesLoaded": {
      return {
        ...state,
        status: "idle",
      };
    }
    case "startCountdown": {
      return {
        ...state,
        status: "countdown",
      };
    }
    case "countdownComplete": {
      return {
        ...state,
        status: "inGame",
      };
    }
    case "inputValueChange": {
      return {
        ...state,
        userCurrentInput: action.inputValue,
      };
    }
    case "errorFree": {
      return {
        ...state,
        userError: false,
      };
    }
    case "userTypingError": {
      return {
        ...state,
        userError: true,
      };
    }
    case "wordCompleted": {
      return {
        ...state,
        userStoredInput: state.userStoredInput.concat(state.userCurrentInput),
        userCurrentInput: "",
      };
    }
    case "win": {
      return {
        ...state,
        status: "complete",
        wpm: action.wpm,
      };
    }
    case "reset": {
      return {
        ...state,
        userError: false,
        userStoredInput: "",
        userCurrentInput: "",
        status: "idle",
        wpm: 0,
      };
    }
    case "next": {
      return {
        ...initialState,
        status: "idle",
      };
    }
    default: {
      throw new Error(`Action of type ${action} not recognized.`);
    }
  }
};

export const useGame = () => {
  const [state, dispatch] = useReducer(GameReducer, initialState);
  const user = useUser();
  const {
    stories,
    isLoading: storiesAreLoading,
    gameCount,
    setGameCount,
  } = useStories();
  const count = useCountdown(state.status);
  const timer = useTimer(state.status);
  const totalUserInput = state.userStoredInput.concat(state.userCurrentInput);
  const currentStory = stories[gameCount - 1];

  // Listen for when stories have been loaded into game state and initialise idle state.
  useEffect(() => {
    if (!storiesAreLoading) {
      dispatch({ type: "storiesLoaded" });
    }
  }, [storiesAreLoading, stories]);

  // Listen for countdown complete and update game status to "inGame"
  useEffect(() => {
    if (count === 0) {
      dispatch({ type: "countdownComplete" });
    }
  }, [count]);

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
    }
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
    storyText: story.storyText,
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

  // Listen for game completion
  useEffect(() => {
    if (state.userStoredInput === currentStory?.storyText) {
      const wpm = getWpm(timer.totalSeconds);
      if (user) {
        const game = constructGame(user.uid, currentStory, wpm);
        createPrevGame(game);
      }
      setGameCount(gameCount + 1);
      dispatch({ type: "win", wpm: wpm });
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
  };
};
