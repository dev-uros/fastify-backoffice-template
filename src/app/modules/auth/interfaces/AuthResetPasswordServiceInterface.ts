export interface AuthResetPasswordServiceInterface {
    resetPassword(email: string, password: string, passwordResetId: number): Promise<void>
}