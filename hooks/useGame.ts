import { ChangeEvent, useEffect, useReducer } from "react";
import { useStories } from "@/context/stories";
import { useCountdown } from "./useCountdown";
import { useTimer } from "./useTimer";
import { GameAction, GameState } from "./useGame.types";

const initialState: GameState = {
  status: "loading",
  userError: false,
  userStoredInput: "",
  userCurrentInput: "",
  stories: [],
  gameCount: 0,
};

const GameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "storiesLoaded": {
      return {
        ...state,
        stories: action.stories,
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
      };
    }
    case "reset": {
      return {
        ...state,
        userError: false,
        userStoredInput: "",
        userCurrentInput: "",
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
  const { stories, isLoading: storiesAreLoading } = useStories();
  const count = useCountdown(state.status);
  const timer = useTimer(state.status);
  const totalUserInput = state.userStoredInput.concat(state.userCurrentInput);
  const currentStory = state.stories[state.gameCount];

  useEffect(() => {
    if (!storiesAreLoading) {
      dispatch({ type: "storiesLoaded", stories });
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

  const checkForUserError = (
    currentInput: string,
    storedInput: string,
    source: string
  ) => {
    const totalUserInput = storedInput.concat(currentInput);
    const sourceTilUserInputEnds = source.slice(0, totalUserInput.length);
    return totalUserInput !== sourceTilUserInputEnds;
  };

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
    if (currentStory) {
      if (state.userStoredInput === currentStory.storyText) {
        dispatch({ type: "win" });
      }
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
    onResetClick: handleResetClick,
  };
};
