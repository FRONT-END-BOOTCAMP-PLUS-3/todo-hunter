export type VerifyCodeErrorType =
  | "EXPIRED_CODE"
  | "INVALID_CODE"
  | "UNKNOWN_ERROR";

export class VerifyCodeError extends Error {
  constructor(public type: VerifyCodeErrorType, message: string) {
    super(message);
    this.name = "VerifyCodeError";
  }
}