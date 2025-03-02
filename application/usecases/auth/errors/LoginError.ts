export type LoginErrorType =
  | "MISSING_CREDENTIALS"
  | "LOGIN_ID_NOT_FOUND"
  | "INVALID_PASSWORD"
  | "UNKNOWN_ERROR";

export class LoginError extends Error {
  constructor(public type: LoginErrorType, message: string) {
    super(message);
    this.name = "LoginError";
  }
}