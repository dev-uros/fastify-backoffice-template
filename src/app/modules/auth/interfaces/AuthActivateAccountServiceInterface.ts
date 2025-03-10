export interface AuthActivateAccountServiceInterface {
    activateAccount(email: string, password: string, passwordResetId: number): Promise<void>
}