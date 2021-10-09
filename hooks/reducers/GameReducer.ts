import { GameAction, GameState } from "../useGame.types";

export const initialState: GameState = {
  status: "pending",
  userError: false,
  userStoredInput: "",
  userCurrentInput: "",
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
        userStoredInput: "",
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
