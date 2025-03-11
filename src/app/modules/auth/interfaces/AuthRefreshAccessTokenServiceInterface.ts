
export interface AuthRefreshAccessTokenServiceInterface {
    refreshAccessToken(refreshToken: string): Promise<string>
}