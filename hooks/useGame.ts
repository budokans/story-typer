import { ChangeEvent, useEffect, useReducer } from "react";

interface GameState {
  status: "idle" | "countdown" | "inGame" | "complete";
  countdown: number;
  userError: boolean;
  userInput: string;
  story: { storyText: string; title: string };
}

type GameAction =
  | { type: "startCountdown" }
  | { type: "countdownTick" }
  | { type: "countdownComplete" }
  | { type: "userTypingError" }
  | { type: "wordCompleted"; word: string }
  | { type: "win" };

const GameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "startCountdown": {
      return {
        ...state,
        status: "countdown",
      };
    }
    case "countdownTick": {
      return {
        ...state,
        countdown: state.countdown - 1,
      };
    }
    case "countdownComplete": {
      return {
        ...state,
        status: "inGame",
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
        userInput: state.userInput.concat(action.word),
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
    countdown: 3,
    userError: false,
    userInput: "",
    story: {
      storyText:
        "When the GPS said that I had arrived at my destination, I found myself parked in front of an abandoned country church on a dead end, gravel road. Most of the paint had long peeled away, and the graveyard beside it was full. I wondered who buried the last member.",
      title: "EDDIE D MOORE: You Have Arrived",
    },
  });

  useEffect(() => {
    const countdownTimeout = setTimeout(() => {
      dispatch({ type: "countdownTick" });
    }, 1000);
    return () => clearTimeout(countdownTimeout);
  }, []);

  useEffect(() => {
    if (state.countdown === 0) {
      dispatch({ type: "countdownComplete" });
    }
  }, [state.countdown]);

  const checkForUserError = (
    currentInput: string,
    storedInput: string,
    source: string
  ) => {
    const totalUserInput = storedInput.concat(currentInput);
    const sourceTilUserInputEnds = source.slice(0, totalUserInput.length);
    if (totalUserInput !== sourceTilUserInputEnds) {
      dispatch({ type: "userTypingError" });
    }
    return totalUserInput !== sourceTilUserInputEnds;
  };

  const initCountdown = () => dispatch({ type: "startCountdown" });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentUserInput = e.target.value;
    checkForUserError(currentUserInput, state.userInput, state.story.storyText);
    const lastCharIsSpace =
      currentUserInput.charAt(currentUserInput.length - 1) === " ";

    if (!state.userError && lastCharIsSpace) {
      dispatch({ type: "wordCompleted", word: currentUserInput });
    }
  };

  useEffect(() => {
    if (state.userInput === state.story.storyText) {
      dispatch({ type: "win" });
    }
  }, [state.userInput, state.story.storyText]);

  return {
    status: state.status,
    countdown: state.countdown,
    userError: state.userError,
    onInputChange: handleInputChange,
    onInitCountdown: initCountdown,
  };
};
