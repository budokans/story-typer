import { User } from "interfaces";

interface AuthState {
  readonly status: "idle" | "pending" | "resolved" | "rejected";
  readonly userId: User["uid"] | null;
}

type AuthAction =
  | { readonly type: "success"; readonly userId: User["uid"] | null }
  | { readonly type: "started" };

export const initialState: AuthState = {
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
