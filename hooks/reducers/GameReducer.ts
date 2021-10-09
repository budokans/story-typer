import { GameAction, GameState } from "../types/Game.types";

export const initialGameState: GameState = {
  status: "pending",
  userError: false,
  userInput: "",
  wpm: 0,
};

export const GameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case "storiesLoading": {
      return {
        ...state,
        status: "pending",
      };
    }
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
        userInput: action.inputValue,
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
    case "win": {
      return {
        ...state,
        status: "complete",
        userInput: "",
        wpm: action.wpm,
      };
    }
    case "outOfTime": {
      return {
        ...state,
        status: "outOfTime",
      };
    }
    case "reset": {
      return {
        ...state,
        userError: false,
        userInput: "",
        status: "idle",
        wpm: 0,
      };
    }
    case "next": {
      return {
        ...initialGameState,
        status: "idle",
      };
    }
    default: {
      throw new Error(`Action of type ${action} not recognized.`);
    }
  }
};
