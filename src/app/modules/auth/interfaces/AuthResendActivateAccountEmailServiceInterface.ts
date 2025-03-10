export interface AuthResendActivateAccountEmailServiceInterface {
    resendActivateAccountEmail(email: string): Promise<void>
}