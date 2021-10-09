import { AuthAction, AuthState } from "../types/ProvideAuth.types";

export const initialAuthState: AuthState = {
  status: "idle",
  userId: null,
};

export const AuthReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "success": {
      return {
        ...state,
        status: "resolved",
        userId: action.userId,
      };
    }
    case "started": {
      return {
        ...state,
        status: "pending",
      };
    }
    default: {
      throw new Error(`Action ${action} is not recognized.`);
    }
  }
};
