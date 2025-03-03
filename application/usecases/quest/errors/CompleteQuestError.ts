/* 퀘스트 생성 에러 */
export type CompleteQuestErrorType =
  | "QUEST_NOT_FOUND"
  | "CHARACTER_NOT_FOUND"
  | "STATUS_NOT_FOUND"
  | "INVALID_TAG";

export class CompleteQuestError extends Error {
  constructor(public type: CompleteQuestErrorType, message: string) {
    super(message);
    this.name = "CompleteQuestError";
  }
}