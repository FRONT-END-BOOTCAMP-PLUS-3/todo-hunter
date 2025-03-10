export interface SignInResponseDTO {
    id: number;
    loginId: string;
    // email: string;
    nickname: string;
    createdAt: Date;
    // updatedAt: Date;
    accessToken?: string; // 임시 적용
    refreshToken?: string; // 임시 적용
}