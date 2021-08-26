import { ChangeEvent, useEffect, useReducer } from "react";
import { useCountdown } from "./useCountdown";
import { useTimer } from "./useTimer";
import { GameAction, GameState } from "./useGame.types";
import { useProvideStories } from "./useProvideStories";

const GameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
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
    default: {
      throw new Error(`Action of type ${action} not recognized.`);
    }
  }
};

export const useGame = () => {
  const [state, dispatch] = useReducer(GameReducer, {
    status: "idle",
    userError: false,
    userStoredInput: "",
    userCurrentInput: "",
    story: {
      storyText:
        "When the GPS said that I had arrived at my destination, I found myself parked in front of an abandoned country church on a dead end, gravel road. Most of the paint had long peeled away, and the graveyard beside it was full. I wondered who buried the last member.",
      title: "EDDIE D MOORE: You Have Arrived",
    },
  });
  const count = useCountdown(state.status);
  const timer = useTimer(state.status);
  const totalUserInput = state.userStoredInput.concat(state.userCurrentInput);
  const stories = useProvideStories();
  console.log(stories);

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
    const errorPresent = checkForUserError(
      state.userCurrentInput,
      state.userStoredInput,
      state.story.storyText
    );

    if (errorPresent) {
      return dispatch({ type: "userTypingError" });
    } else {
      dispatch({ type: "errorFree" });
    }

    const lastInputCharIsSpace =
      state.userCurrentInput.charAt(state.userCurrentInput.length - 1) === " ";

    const isFinalChar =
      totalUserInput.length === state.story.storyText.length &&
      !state.userError;

    if ((!state.userError && lastInputCharIsSpace) || isFinalChar) {
      dispatch({ type: "wordCompleted" });
    }
  }, [
    state.userCurrentInput,
    state.userStoredInput,
    state.story.storyText,
    state.userError,
    totalUserInput,
  ]);

  // Listen for game completion
  useEffect(() => {
    if (state.userStoredInput === state.story.storyText) {
      dispatch({ type: "win" });
    }
  }, [state.userStoredInput, state.story.storyText]);

  return {
    status: state.status,
    inputValue: state.userCurrentInput,
    userError: state.userError,
    onInputChange: handleInputChange,
    onInitCountdown: initCountdown,
    countdown: count,
    timer: timer,
  };
};
