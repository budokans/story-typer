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
import { Util as APIUtil } from "api-client";

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

type UseUser =
  | APIUtil.UseQuery<DBError.DBError, Response>
  | {
      _tag: "create-new-user";
    };

type UserQueryKey = ["user", string];

export const useUser = (id: string): UseUser => {
  const {
    data: rawData,
    error,
    status,
  } = useQuery<Response, DBError.DBError, Response, UserQueryKey>(
    ["user", id],
    () => DBUser.getUser(id),
    {
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  if (status === "loading") return { _tag: "loading" };
  if (error instanceof DBError.NotFound) return { _tag: "create-new-user" };

  return {
    _tag: "settled",
    data: F.pipe(
      rawData,
      E.fromNullable(error ?? new DBError.Unknown("Unknown error.")),
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
  options?: UseMutationOptions<Response, DBError.DBError, Body, UserSchema.User>
): {
  readonly mutateAsync: (
    body: Body
  ) => TE.TaskEither<DBError.DBError, Response>;
  readonly isLoading: boolean;
} => {
  const queryClient = useQueryClient();

  const setUserMutation = useMutation<
    Response,
    DBError.DBError,
    Body,
    UserSchema.User
  >((user: Body) => DBUser.setUser(user), {
    onMutate: async (newUser: UserSchema.User) => {
      await queryClient.cancelQueries(["user", newUser.id]);
      const prevUser = queryClient.getQueryData<UserSchema.User>([
        "user",
        newUser.id,
      ]);
      queryClient.setQueryData<UserSchema.User>(["user", newUser.id], newUser);
      return prevUser;
    },
    onError: (_, __, context) => {
      if (context) {
        queryClient.setQueryData<UserSchema.User>(["user"], context);
      }
    },
    onSettled: () => queryClient.invalidateQueries(["user"]),
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
              // Note: This is not fully type-safe as we're assuming that we build
              // a DBError in the db, as we do at the time of writing.
              (error) => error as DBError.DBError
            )
        ),
      [setUserMutation]
    ),
    isLoading: setUserMutation.isLoading,
  };
};
