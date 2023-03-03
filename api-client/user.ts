import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "react-query";
import { useCallback } from "react";
import { function as F, taskEither as TE, either as E } from "fp-ts";
import { User as FirebaseUser } from "firebase/auth";
import { User as UserSchema } from "api-schemas";
import { User as DBUser, Error as DBError } from "db";

export type Document = DBUser.DocumentRead;
export type Body = UserSchema.User;
export type Response = UserSchema.User;

export const serializeUser = (userDoc: Document): Response => ({
  id: userDoc.id,
  name: userDoc.name,
  email: userDoc.email,
  photoURL: userDoc.photoURL,
  registeredDate: userDoc.registeredDate,
  lastSignInTime: userDoc.lastSignInTime,
  personalBest: userDoc.personalBest,
  lastTenScores: userDoc.lastTenScores,
  gamesPlayed: userDoc.gamesPlayed,
  newestPlayedStoryPublishedDate: userDoc.newestPlayedStoryPublishedDate,
  oldestPlayedStoryPublishedDate: userDoc.oldestPlayedStoryPublishedDate,
});

export const noUserResponseMessage =
  "A user has not been returned from the server.";

type UseUser =
  | {
      _tag: "loading";
    }
  | {
      _tag: "resolved";
      data: E.Either<DBError.DBError, Response>;
    }
  | {
      _tag: "create-new-user";
    };

type UserQueryKey = ["user", string];

export const useUser = (id: string): UseUser => {
  const {
    data: rawData,
    error,
    status,
  } = useQuery<
    Response | undefined,
    DBError.DBError,
    Response | undefined,
    UserQueryKey
  >(
    // Force new line
    ["user", id],
    () => DBUser.getUser(id),
    {
      refetchOnWindowFocus: false,
      retry: (_, error): boolean =>
        error instanceof DBError.NotFound ? false : true,
    }
  );

  if (status === "loading") return { _tag: "loading" };
  if (error instanceof DBError.NotFound) return { _tag: "create-new-user" };

  return {
    _tag: "resolved",
    data: F.pipe(
      rawData,
      E.fromNullable(error ?? new DBError.Unknown("Unknown Error.")),
      E.map(serializeUser)
    ),
  };
};

export const buildNewUser = (user: FirebaseUser): Body => ({
  id: user.uid,
  name: user.displayName,
  email: user.email,
  photoURL: user.photoURL,
  registeredDate: user.metadata.creationTime ?? new Date().toISOString(),
  lastSignInTime: user.metadata.lastSignInTime ?? new Date().toISOString(),
  personalBest: null,
  lastTenScores: [],
  gamesPlayed: 0,
  newestPlayedStoryPublishedDate: null,
  oldestPlayedStoryPublishedDate: null,
});

export const useSetUser = (
  options?: UseMutationOptions<
    void,
    DBError.DBError,
    Body,
    UserSchema.User | undefined
  >
): {
  readonly mutateAsync: (body: Body) => TE.TaskEither<unknown, void>;
  readonly isLoading: boolean;
} => {
  const queryClient = useQueryClient();

  const setUserMutation = useMutation<
    void,
    DBError.DBError,
    Body,
    UserSchema.User | undefined
  >((user: Body) => DBUser.setUser(user), {
    onSettled: () => queryClient.invalidateQueries("user"),
    ...options,
  });

  return {
    mutateAsync: useCallback(
      (body: Body) =>
        F.pipe(
          // Force new Line
          body,
          UserSchema.User.encode,
          (encodedBody) =>
            TE.tryCatch(
              () => setUserMutation.mutateAsync(encodedBody),
              (error) => error
            )
        ),
      [setUserMutation]
    ),
    isLoading: setUserMutation.isLoading,
  };
};
