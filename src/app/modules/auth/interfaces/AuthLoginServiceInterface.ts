import {LoginRequestSchemaType} from "../schemas/generateTokenSchema";

export interface AuthLoginServiceInterface {
    login(loginData: LoginRequestSchemaType, ip:string, userAgent: string): Promise<{accessToken: string, refreshToken: string}>
}