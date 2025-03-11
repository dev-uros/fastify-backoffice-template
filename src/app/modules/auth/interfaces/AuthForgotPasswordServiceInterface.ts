export interface AuthForgotPasswordServiceInterface {
    generateForgotPasswordRequest(email: string): Promise<void>
}