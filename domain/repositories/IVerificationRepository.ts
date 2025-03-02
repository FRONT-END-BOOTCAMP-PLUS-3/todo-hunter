export interface IVerificationRepository {
    saveVerificationCode(email: string, code: string, expiresIn: number): Promise<void>;
    getVerificationCode(email: string): Promise<string | null>;
    deleteVerificationCode(email: string): Promise<void>;
}