export interface AuthForgotPasswordServiceInterface {
    generateForgotPasswordRequest(email: string, password: string, passwordResetId: number): Promise<void>
}