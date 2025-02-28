export interface SignInResponseDTO {
    user: {
        loginId: string;
        // email: string;
        nickname: string;
        createdAt: Date;
        // updatedAt: Date;
    };
}