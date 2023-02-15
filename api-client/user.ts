import { useMutation, useQuery, useQueryClient } from "react-query";
import { function as F, taskEither as TE, either as E } from "fp-ts";
import { User as UserSchema } from "api-schemas";
import { User as DBUser } from "db";
import { useAuthContext } from "@/context/auth";

export type Document = DBUser.UserDocument;
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

export const useUser = (): {
  readonly data: E.Either<unknown, Response>;
  readonly status: "idle" | "error" | "loading" | "success";
} => {
  const { authUser } = useAuthContext();
  const authUserId = authUser?.uid;

  const {
    data: rawData,
    error,
    status,
  } = useQuery(
    // Force new line
    ["user", authUserId],
    async () => DBUser.getUser(authUserId!),
    {
      enabled: !!authUserId,
    }
  );

  return {
    data: F.pipe(
      rawData,
      E.fromNullable(error ?? noUserResponseMessage),
      E.map(serializeUser)
    ),
    status,
  };
};

export const useSetUser = (): ((
  body: Body
) => TE.TaskEither<unknown, void>) => {
  const queryClient = useQueryClient();

  const setUserMutation = useMutation(
    async (user: Body) => DBUser.setUser(user),
    {
      onSuccess: () => queryClient.invalidateQueries("user"),
    }
  );

  return (body: Body) =>
    F.pipe(
      // Force new Line
      body,
      UserSchema.User.encode,
      (encodedBody) =>
        TE.tryCatch(
          () => setUserMutation.mutateAsync(encodedBody),
          (error) => error
        )
    );
};
