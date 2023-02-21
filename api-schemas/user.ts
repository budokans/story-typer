import * as IoTs from "io-ts";

export const AuthUser = IoTs.type({
  id: IoTs.string,
  name: IoTs.union([IoTs.string, IoTs.null]),
  email: IoTs.union([IoTs.string, IoTs.null]),
  photoURL: IoTs.union([IoTs.string, IoTs.null]),
});
export type AuthUser = IoTs.TypeOf<typeof AuthUser>;

export const User = IoTs.intersection([
  AuthUser,
  IoTs.type({
    registeredDate: IoTs.string,
    lastSignInTime: IoTs.string,
    personalBest: IoTs.union([IoTs.number, IoTs.null]),
    lastTenScores: IoTs.readonlyArray(IoTs.number),
    gamesPlayed: IoTs.number,
    newestPlayedStoryPublishedDate: IoTs.union([IoTs.string, IoTs.null]),
    oldestPlayedStoryPublishedDate: IoTs.union([IoTs.string, IoTs.null]),
  }),
]);
export type User = IoTs.TypeOf<typeof User>;
