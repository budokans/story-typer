import { FirestoreError } from "firebase/firestore";
import { function as F } from "fp-ts";

type DBErrorType =
  | "Not Found"
  | "Unknown"
  | "Unauthenticated"
  | "FirestoreOther";

abstract class ErrorBase extends Error {
  abstract type: DBErrorType;

  constructor(readonly message: string) {
    super(message);
  }
}

export class NotFound extends ErrorBase {
  readonly type: DBErrorType = "Not Found";
}

export class Unknown extends ErrorBase {
  readonly type: DBErrorType = "Unknown";
}

export class Unauthenticated extends ErrorBase {
  readonly type: DBErrorType = "Unauthenticated";
}

export class FirestoreOther extends ErrorBase {
  readonly type: DBErrorType = "FirestoreOther";
}

export type DBError = NotFound | Unknown | Unauthenticated | FirestoreOther;

export const buildFirestoreError = (error: FirestoreError): DBError => {
  switch (error.code) {
    case "not-found":
      return new NotFound(error.message);
    case "unauthenticated":
      return new Unauthenticated(error.message);
    default:
      return new FirestoreOther(error.message);
  }
};

export const throwError = (error: DBError): never => {
  throw error;
};

export const catchError = (error: NotFound | FirestoreError): never =>
  error instanceof NotFound
    ? throwError(error)
    : F.pipe(error, buildFirestoreError, throwError);
