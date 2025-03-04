export interface IVerifyPasswordUsecase {
    execute(password: string, hashed: string): Promise<boolean>;
}