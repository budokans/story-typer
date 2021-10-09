import { User } from "interfaces";

export interface AuthState {
  status: "idle" | "pending" | "resolved" | "rejected";
  userId: User["uid"] | null;
}

export type AuthAction =
  | { type: "success"; userId: User["uid"] | null }
  | { type: "started" };

export interface ProvideAuth {
  userId: string | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}
