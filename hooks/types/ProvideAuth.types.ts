import { User } from "interfaces";

export interface AuthState {
  readonly status: "idle" | "pending" | "resolved" | "rejected";
  readonly userId: User["uid"] | null;
}

export type AuthAction =
  | { readonly type: "success"; readonly userId: User["uid"] | null }
  | { readonly type: "started" };

export interface ProvideAuth {
  readonly userId: string | null;
  readonly isLoading: boolean;
  readonly signInWithGoogle: () => Promise<void>;
  readonly signOut: () => Promise<void>;
}
